import { useNavigate } from "react-router-dom";
import "./success.css";

function Success() {
  const navigate = useNavigate();
  return (
    <div className="success-container">
      <div className="success-form-container">
        <img src="/success-icon.svg" alt="" />
        <h1>Successful</h1>
        <p>Your password has been reset successfully</p>
        <button onClick={() => navigate('/auth')}>Continue</button>
      </div>
    </div>
  );
}

export default Success;