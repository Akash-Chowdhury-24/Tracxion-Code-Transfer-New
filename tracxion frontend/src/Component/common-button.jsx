import "../css/common-button.css";
function CommonButton({
  text = "",
  onClick,
  backgroundColor = "",
  textColor = "",
  borderColor = "",
  className = "",
  disabled = false
}) {
  return (
    <button className={`common-button ${disabled ? 'disabled' : ''} ${className}`} style={{
      backgroundColor: backgroundColor,
      color: textColor,
      borderColor: borderColor,
    }} onClick={(e) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onClick();
    }} disabled={disabled}>
      {text}
    </button>
  );
}

export default CommonButton;