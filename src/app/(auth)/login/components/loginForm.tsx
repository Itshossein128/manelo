"use client";

import { LoginFormInputs, loginSchema } from "@/app/utils/validationSchemas";
import { useAuth } from "@/app/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

export default function LoginForm() {
  const { login, error: authError, isLoading } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    login(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='bg-white p-8 rounded-lg shadow-md w-96'
    >
      <h1 className='text-2xl font-bold mb-6 text-center'>Welcome Back</h1>

      {authError && (
        <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
          {authError}
        </div>
      )}

      <div className='mb-4'>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700'
        >
          Email
        </label>
        <input
          type='email'
          id='email'
          {...register("email")}
          className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
          disabled={isLoading}
        />
        {errors.email && (
          <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>
        )}
      </div>

      <div className='mb-6'>
        <label
          htmlFor='password'
          className='block text-sm font-medium text-gray-700'
        >
          Password
        </label>
        <input
          type='password'
          id='password'
          {...register("password")}
          className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
          disabled={isLoading}
        />
        {errors.password && (
          <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>
        )}
      </div>

      <button
        type='submit'
        disabled={isLoading}
        className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
