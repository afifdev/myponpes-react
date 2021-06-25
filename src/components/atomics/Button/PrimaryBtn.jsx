const PrimaryBtn = ({ compact, equal, children, ...rest }) => {
  return (
    <button
      {...rest}
      className={`${compact ? "p-1.5" : "py-1.5 px-4"} ${
        equal ? "w-24" : ""
      } disabled:opacity-50 disabled:pointer-events-none font-medium rounded-md bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 focus:ring-2 focus:ring-offset-1 focus:ring-blue-700 outline-none focus:outline-none text-white`}
    >
      {children}
    </button>
  );
};

export default PrimaryBtn;
