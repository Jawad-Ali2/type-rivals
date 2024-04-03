import React from "react";
import ReactDOM from "react-dom";

export const Modal = () => {
  const modalRoot = document.getElementById("modal-root");
  return ReactDOM.createPortal(
    <div className="text-black fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center z-1">
      Modal
    </div>,
    modalRoot
  );
};
