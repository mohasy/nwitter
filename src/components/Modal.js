import React, { useRef } from "react";
import ReactDom from "react-dom";

export const Modal = ({ setShowModal }) => {
  const modalRef = useRef();
  const closeModal = (e) => {
    if (e.target === modalRef.current) {
        console.log("modal close click");
      setShowModal(false);
    }
  };
  
  return ReactDom.createPortal(
      
    <div className="container" ref={modalRef} onClick={closeModal}>
      <div className="modal">
        <button onClick={() => setShowModal(false)} className="Xbutton">X</button>
      </div>
    </div>,
    document.getElementById("portal")
  );
};