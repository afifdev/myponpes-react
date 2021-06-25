const Card = ({ flow, children }) => {
  return <div className={`${flow} bg-white rounded-xl p-8`}>{children}</div>;
};

export default Card;
