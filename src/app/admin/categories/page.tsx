"use client";

import AddCategoryForm from "./components/addCategoryForm";
import { useState } from "react";
import CategoriesTable from "./components/categoriesTable";
import EditCategoryForm from "./components/editCategoryModal";
import { TCategory } from "@/app/types/cateogy";

const Categories = () => {

  const [editingCategory, setEditingCategory] = useState<
    TCategory | undefined
  >();
  const [isEditing, setIsEditing] = useState(false);


  return (
    <>
      <AddCategoryForm />
      <div className='overflow-x-auto'>
          <CategoriesTable
            setIsEditing={setIsEditing}
            setEditingCategory={setEditingCategory}
          />
      </div>
      <EditCategoryForm
        category={editingCategory}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </>
  );
};

export default Categories;
