"use client";
import React, { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const useAlertContext = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState(() => () => {});
  const [onCancel, setOnCancel] = useState(() => () => {});

  const showAlert = (msg, confirmCallback, cancelCallback) => {
    setMessage(msg);
    setOnConfirm(() => () => {
      confirmCallback();
      closeAlert();
    });
    setOnCancel(() => () => {
      if (cancelCallback) cancelCallback();
      closeAlert();
    });
    setIsVisible(true);
  };

  const closeAlert = () => {
    setIsVisible(false);
    setMessage("");
    setOnConfirm(() => () => {});
    setOnCancel(() => () => {});
  };

  return (
    <AlertContext.Provider value={{ showAlert, closeAlert }}>
      {children}
      <div
        className={`bg-slate-950/20 w-screen h-screen backdrop-blur-xs fixed top-0 left-0 z-50 transition ${
          isVisible
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      ></div>
      <div
        className={`alert max-w-lg w-full fixed  left-1/2 -translate-x-1/2 shadow border z-50 bg-zinc-100 flex flex-col transition ${
          isVisible
            ? "pointer-events-auto opacity-100 bottom-20 translate-y-0"
            : "pointer-events-none opacity-0 bottom-0 translate-y-full"
        }`}
      >
        <p>{message}</p>
        <div className='flex gap-2'>
          <button
            className='btn bg-zinc-50 border-zinc-50 shadow-sm'
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className='btn bg-zinc-50 border-zinc-50 shadow-sm'
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </AlertContext.Provider>
  );
};
