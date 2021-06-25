import React from "react";

const Input = ({ disabled, ...rest }) => {
  return (
    <input
      className="py-2 px-4 w-full rounded-md border-2 bg-gray-50 disabled:bg-gray-200 focus:border-blue-600 outline-none font-medium"
      disabled={disabled}
      {...rest}
    />
  );
};

export default Input;
