import { useState, useEffect, useRef } from "react";
import "./otp-verify.css";
import { useLocation, useNavigate } from "react-router-dom";

function OtpVerify() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if(!location.state){
      navigate('/auth/forget-password');
    }
  },[location,navigate])

  if(!location.state){
    return null;
  }

  const { email } = location.state;

  
  // Create refs for each input box
  const inputRefs = useRef([]);

  // Auto-focus on first input when component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    console.log(email);
  }, []);

  // Check if OTP is complete
  const isOtpComplete = () => {
    return otp.every(digit => digit !== "");
  };

  // Handle input changes
  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setApiError("");

    // Move to next input if value is entered
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle keyboard events
  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      
      if (otp[index]) {
        // If current box has value, clear it
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // If current box is empty, move to previous box and clear it
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
    
    // Handle arrow keys for navigation
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === "ArrowRight" && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    
    // Only accept 4-digit numbers
    if (/^\d{4}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      // Focus on last input
      inputRefs.current[3].focus();
    }
  };

  // API call function
  const otpVerifyUser = async (otpVerifyData) => {
    // try {
    //   setIsLoading(true);
    //   setApiError("");

    //   // Replace with your actual API endpoint
    //   const response = await fetch('/api/auth/verify-otp', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(otpVerifyData),
    //   });

    //   const data = await response.json();

    //   if (!response.ok) {
    //     throw new Error(data.message || 'OTP verification failed');
    //   }

    //   // Navigate to new password page
    //   navigate('new-password', { state: { otp: otpVerifyData.otp } });

    // } catch (error) {
    //   console.error('OTP verification error:', error);
    //   setApiError(error.message || 'An error occurred during verification. Please try again.');
    // } finally {
    //   setIsLoading(false);
    // }
    navigate('/auth/forget-password/new-password', { state: { email: email } });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isOtpComplete()) {
      const otpVerifyData = {
        otp: otp.join(""),
      };

      await otpVerifyUser(otpVerifyData);
    }
  };

  return (
    <div className="otp-verify-container">
      <form className="otp-verify-form-container" onSubmit={handleSubmit}>
        <img src="/logo.svg" alt="Logo" />
        <h1 className="otp-verify-form-container-title">Verification</h1>
        <p className="otp-verify-form-container-description">
          Enter your 4 digits code that you received on your email.
        </p>

        {/* API Error Message */}
        {apiError && (
          <div className="otp-verify-form-container-api-error">
            {apiError}
          </div>
        )}

        {/* OTP Input Boxes */}
        <div className="otp-verify-form-container-input-group">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="otp-verify-form-container-input-box"
              disabled={isLoading}
              autoComplete="off"
            />
          ))}
        </div>

        <button
          type="submit"
          className="otp-verify-form-container-button"
          disabled={isLoading || !isOtpComplete()}
        >
          {isLoading ? (
            <div className="otp-verify-form-container-loading">
              <div className="otp-verify-form-container-spinner"></div>
              Verifying...
            </div>
          ) : (
            'Verify'
          )}
        </button>
      </form>
    </div>
  );
}

export default OtpVerify;