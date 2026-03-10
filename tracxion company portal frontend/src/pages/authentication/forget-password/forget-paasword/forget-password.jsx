import { useState, useEffect } from "react";
import "./forget-password.css";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Form validation function
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }



    setErrors(newErrors);
    setTimeout(() => {
      setErrors({});
    }, 3000);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (errors.email) {
      setErrors(prev => ({ ...prev, email: "" }));
    }
    setApiError("");
  };

  // API call function
  const forgetPasswordUser = async (forgetPasswordData) => {
    // try {
    //   setIsLoading(true);
    //   setApiError("");

    //   // Replace with your actual API endpoint
    //   const response = await fetch('/api/auth/forget-password', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(forgetPasswordData),
    //   });

    //   const data = await response.json();

    //   if (!response.ok) {
    //     throw new Error(data.message || 'Login failed');
    //   }

    //   // Store authentication token
    //   if (data.token) {
    //     localStorage.setItem('authToken', data.token);
    //   }

    //   // Redirect to dashboard or handle successful forget-password
    //   console.log('Login successful:', data);
    //   navigate('/dashboard');

    // } catch (error) {
    //   console.error('Login error:', error);
    //   setApiError(error.message || 'An error occurred during forget-password. Please try again.');
    // } finally {
    //   setIsLoading(false);
    // }
    navigate('otp-verify', { state: { email: email } });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const forgetPasswordData = {
        email: email.trim(),

      };

      await forgetPasswordUser(forgetPasswordData);
    }
  };

  return (
    <div className="forget-password-container">

      <form className="forget-password-form-container" onSubmit={handleSubmit}>
        <img src="/logo.svg" alt="" />
        <h1 className="forget-password-form-container-title">Forgot Password</h1>
        <p className="forget-password-form-container-description">Enter your email for the verification proccess, we will send 4 digits code to your email.</p>

        {/* API Error Message */}
        {apiError && (
          <div className="forget-password-form-container-api-error">
            {apiError}
          </div>
        )}

        <div className="forget-password-form-container-input">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            className={errors.email ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.email && (
            <span className="forget-password-form-container-error-message">{errors.email}</span>
          )}
        </div>


        <button
          type="submit"
          className="forget-password-form-container-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="forget-password-form-container-loading">
              <div className="forget-password-form-container-spinner"></div>
              Sending code...
            </div>
          ) : (
            'Continue'
          )}
        </button>
      </form>

    </div>
  );
}

export default ForgetPassword;