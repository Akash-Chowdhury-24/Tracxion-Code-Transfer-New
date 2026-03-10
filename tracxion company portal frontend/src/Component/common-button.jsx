import "../css/common-button.css";
function CommonButton({
  text = "",
  onClick,
  backgroundColor = "",
  textColor = "",
  borderColor = "",
  className = ""
}) {
  return (
    <button className={"common-button " + className} style={{
      backgroundColor: backgroundColor,
      color: textColor,
      borderColor: borderColor,
    }} onClick={onClick}>
      {text}
    </button>
  );
}

export default CommonButton;