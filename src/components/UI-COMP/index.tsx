import React from 'react'
import { AiFillStar } from "react-icons/ai";


export function StarRate({ count = 1, color = "", size = 15 }) {
  return (
    <>
      {Array(count)
        .fill(count)
        .map((list, i) => {
          return (
            <AiFillStar
              key={i}
              className={`text-[20px] `}
              style={{
                color: color === "" ? "#64f4acea" : color,
                fontSize: `${size}px`,
              }}
            />
          );
        })}
    </>
  );
}

export function Input({ ...rest }) {
  return (
    <input
      {...rest}
      className={`w-full rounded-md ourtline-none bg-dark-200 px-3 py-3 mt-4 text-white-200 `}
    />
  );
}

export function SelectInput({ data = [], title = "select title" }) {
  return (
    <>
      <select className="w-full h-auto px-4 py-2 mt-4 rounded-md bg-dark-200 text-white-100">
        <option value="">{title}</option>
        {data.map((list, i) => (
          <option key={i} value={list} className="capitalize">
            {list}
          </option>
        ))}
      </select>
    </>
  );
}


type ButtonProps = {
  text?: string;
  type?: string;
  long?: boolean;
  children?: React.ReactNode;
  size?: string;
  onClick?: ()=> void
}

export function Button<T extends ButtonProps>({
  text = "Button",
  type = "secondary" || "primary" || "danger",
  long = false,
  size = "md",
  children,
  ...rest
}: T ) {
  const validTypes = ["primary", "secondary", "danger"];
  const isTypeExists = validTypes.includes(type);
  const styles =
    type === "secondary"
      ? "bg-dark-100 text-white-100"
      : type === "primary"
        ? "bg-blue-400 text-white-100"
        : type === "success"
          ? "bg-green-400 text-dark-100"
          : type === "danger"
            ? "bg-red-700 text-white-100"
            : "bg-dark-200 text-white-100";
  
  const SIZE = size === "sm" ? "scale-[.85]" : size === "md" ? "scale-[.90]" : size === "lg" ? "scale-[.95]" : "scale-[1]"

  return (
    <button
      className={`px-5 py-2 ${isTypeExists ? styles : styles
        } font-extrabold rounded-md ${SIZE} hover:scale-[.75] transition-all ${long ? "w-full" : ""} `}
      {...rest}
    >
      {children} {text}
    </button>
  );
}

export function PendingState({ state = "pending" }) {
  return (
    <span
      className={`px-3 py-1 scale-[.60] rounded-[30px] text-[10px] font-extrabold ${state === "pending"
          ? "bg-green-400 text-dark-100"
          : state === "approved"
            ? "bg-dark-100 text-white-100"
            : state === "rejected"
              ? "bg-red-200 text-white-100"
              : "bg-red-200 text-white-100"
        }`}
    >
      {state === "pending"
        ? "Pending"
        : state === "approved"
          ? "Approved"
          : state === "rejected"
            ? "Rejected"
            : "Invalid State"}
    </span>
  );
}
