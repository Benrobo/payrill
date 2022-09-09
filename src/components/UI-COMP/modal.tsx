import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import { Link, useParams } from "react-router-dom";
import { getLastPathName } from "../../utils";

interface ModalProps {
  children: React.ReactNode;
  isActive?: boolean;
  clickHandler?: () => void;
  back?: boolean;
  backHandler?:()=> void;
}

function Modal({ children, isActive, clickHandler, backHandler, back }: ModalProps) {
  return (
    <div
      data-name="modal-cont"
      className={`w-full md:w-[500px] ${
        isActive ? "h-screen" : "h-0"
      } overflow-hidden z-[20] bg-dark-800 fixed top-0 flex flex-col items-center justify-center `}
    >
      {typeof clickHandler !== "undefined" && (
        <button
          className="absolute scale-[.60] top-1 right-2 px-4 py-4 flex flex-row items-center justify-center rounded-[50%] bg-red-900 opacity-[.8] text-[15px] "
          onClick={clickHandler}
        >
          <CgClose className="text-[25px] text-red-200 " />
        </button>
      )}
      {back && (
        <Link to="/dashboard">
          <button
            className="absolute scale-[.60] top-1 right-2 px-4 py-4 flex flex-row items-center justify-center rounded-[50%] bg-red-900 opacity-[.8] text-[15px] "
            onClick={()=>{
              typeof clickHandler !== "undefined" && clickHandler()
              typeof backHandler !== "undefined" && backHandler()
            }}
          >
            <CgClose className="text-[25px] text-red-200 " />
          </button>
        </Link>
      )}

      {children}
    </div>
  );
}

export default Modal;



export function OrgModal({ children, isActive, clickHandler, backHandler, back }: ModalProps) {

  const pathName= getLastPathName()

  return (
    <div
      data-name="modal-cont"
      className={`w-screen ${
        isActive ? "h-screen" : "h-0"
      } overflow-hidden z-[20] bg-dark-800 fixed top-0 left-0 flex flex-col items-center justify-center `}
    >
      {typeof clickHandler !== "undefined" && (
        <button
          className="absolute scale-[.60] top-1 right-2 px-4 py-4 flex flex-row items-center justify-center rounded-[50%] bg-red-900 opacity-[.8] text-[15px] "
          onClick={clickHandler}
        >
          <CgClose className="text-[25px] text-red-200 " />
        </button>
      )}
      {back && (
        <Link to={`/${pathName}`}>
          <button
            className="absolute scale-[.60] top-1 right-2 px-4 py-4 flex flex-row items-center justify-center rounded-[50%] bg-red-900 opacity-[.8] text-[15px] "
            onClick={()=>{
              typeof clickHandler !== "undefined" && clickHandler()
              typeof backHandler !== "undefined" && backHandler()
            }}
          >
            <CgClose className="text-[25px] text-red-200 " />
          </button>
        </Link>
      )}

      {children}
    </div>
  );
}
