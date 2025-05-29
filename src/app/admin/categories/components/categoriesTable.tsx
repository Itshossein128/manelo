"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import Image from "next/image";
import { TCategory } from "./page";
import { FormatDate } from "@/app/utils/formatDate";
import { useDeleteCategory } from "@/hooks/useDeleteCategory";
import { useAlertContext } from "@/app/contexts/alertContext";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminCategoryApi } from "@/app/services/category";

const columnHelper = createColumnHelper<TCategory>();

export default function CategoriesTable({
  setIsEditing,
  setEditingCategory,
}: {
  setIsEditing: (value: boolean) => void;
  setEditingCategory: (category: TCategory) => void;
}) {
  const { showAlert } = useAlertContext();
  const deleteCategoryMutation = useDeleteCategory();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getAdminCategoryApi,
  });

  const deleteCategoryHandler = (categoryId: string) => {
    deleteCategoryMutation.mutate(categoryId);
  };

  const handleDeleteAlert = (categoryId: string) => {
    showAlert("Are you sure you want to delete this category?", () =>
      deleteCategoryHandler(categoryId)
    );
  };

  const columns = [
    columnHelper.accessor((row) => row.name, {
      id: "name",
      header: "Name",
      enableSorting: true,
    }),
    columnHelper.accessor((row) => row.gender, {
      id: "gender",
      header: "Gender",
      enableSorting: true,
    }),
    columnHelper.accessor((row) => row.href, {
      id: "href",
      header: "Url",
      enableSorting: true,
    }),
    columnHelper.accessor((row) => row.createdAt, {
      id: "createdAt",
      header: "Created At",
      cell: (info) => FormatDate(info.getValue()),
      enableSorting: true,
    }),
    columnHelper.accessor((row) => row.updatedAt, {
      id: "updatedAt",
      header: "Updated At",
      cell: (info) => FormatDate(info.getValue()),
      enableSorting: true,
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className='flex gap-1 w-max'>
          <button
            className='btn btn-sm'
            onClick={() => {
              setIsEditing(true);
              setEditingCategory(info.row.original);
            }}
          >
            <Image src={"/edit-icon.svg"} width={20} height={20} alt='edit' />
          </button>
          <button
            className='btn btn-sm'
            onClick={() => handleDeleteAlert(info.row.original._id)}
            disabled={deleteCategoryMutation.isPending}
          >
            <Image
              src={"/delete-icon.svg"}
              width={20}
              height={20}
              alt='delete'
            />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: categories?.data || [],
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching categories</div>;

  return (
    <div>
      {categories?.data.length === 0 ? (
        <div className='mt-10 text-center'>
          <p>No categories available.</p>
        </div>
      ) : (
        <>
          {/* Search Input */}
          <div className='mt-16 flex items-center justify-between border-t border-slate-500 pt-4'>
            <h3>Categories</h3>
            <input
              type='text'
              placeholder='Search...'
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className='p-2 input input-bordered max-w-xs w-full'
            />
          </div>

          {/* Table */}
          <div className='overflow-x-auto border border-gray rounded-sm mt-4'>
            <table className='table text-nowrap'>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        style={{
                          cursor: "pointer",
                          position:
                            index === headerGroup.headers.length - 1
                              ? "sticky"
                              : "static",
                          right:
                            index === headerGroup.headers.length - 1
                              ? 0
                              : "auto",
                          backgroundColor: "white", // Ensure background color matches
                          zIndex: 1, // Ensure it stays above other columns
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell, index) => (
                      <td
                        key={cell.id}
                        style={{
                          position:
                            index === row.getVisibleCells().length - 1
                              ? "sticky"
                              : "static",
                          right:
                            index === row.getVisibleCells().length - 1
                              ? 0
                              : "auto",
                          backgroundColor: "white", // Ensure background color matches
                          zIndex: 1, // Ensure it stays above other columns
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className='flex items-center justify-between mt-4'>
            <div className='flex items-center gap-2'>
              <button
                className='btn btn-sm'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </button>
              <button
                className='btn btn-sm'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </button>
            </div>
            <div className='flex items-center gap-2'>
              <span>
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className='select select-bordered select-sm'
              >
                {[5, 10, 15, 20, 25].map((size) => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
