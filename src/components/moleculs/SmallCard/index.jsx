const SmallCard = ({ flow, nopadding, children, ...rest }) => {
  return (
    <div
      {...rest}
      className={`${flow} bg-white rounded-xl ${nopadding ? "" : "p-4"}`}
    >
      {children}
    </div>
  );
};

export default SmallCard;
