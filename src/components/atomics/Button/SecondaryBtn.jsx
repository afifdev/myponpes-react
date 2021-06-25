const SecondaryBtn = ({ compact, equal, children, ...rest }) => {
  return (
    <button
      {...rest}
      className={`${compact ? "p-1.5" : "py-2 px-4"} ${
        equal ? "w-24" : ""
      } disabled:opacity-50 disabled:pointer-events-none font-medium rounded-md focus:bg-blue-700 ring-inset ring-2 ring-offset-1 ring-blue-700 outline-none focus:outline-none text-blue-700 focus:text-white`}
    >
      {children}
    </button>
  );
};

export default SecondaryBtn;
