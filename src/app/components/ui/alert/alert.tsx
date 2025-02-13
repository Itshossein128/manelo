"use client";
import React from "react";
import useAlert from "@/hooks/useAlert"; // Adjust the path as necessary

const Alert = () => {
  const { isVisible, message, onConfirm, onCancel, closeAlert } = useAlert();

  return (
    <>
      {isVisible && (
        <div className='alert'>
          <p>{message}</p>
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>No</button>
          <button onClick={closeAlert}>Close</button>
        </div>
      )}
    </>
  );
};

export default Alert;
