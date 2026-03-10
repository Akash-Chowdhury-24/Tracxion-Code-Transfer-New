import { useEffect, useState } from "react";
import "./new-password.css";
import { useLocation, useNavigate } from "react-router-dom";

function NewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state) {
      navigate('/auth/forget-password');
    }
  }, [location, navigate])

  if (!location.state) {
    return null;
  }

  const { email } = location.state;

  // Password validation function
  const validatePassword = (password) => {
    // const minLength = 8;
    // const hasUpperCase = /[A-Z]/.test(password);
    // const hasLowerCase = /[a-z]/.test(password);
    // const hasNumbers = /\d/.test(password);
    // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // return {
    //   isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    //   minLength: password.length >= minLength,
    //   hasUpperCase,
    //   hasLowerCase,
    //   hasNumbers,
    //   hasSpecialChar
    // };

    return {
      isValid: true,
    }
  };

  // Form validation function
  const validateForm = () => {
    const newErrors = {};

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        newErrors.password = "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
      }
    }

    // Confirm Password validation
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    setTimeout(() => {
      setErrors({});
    }, 3000);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (errors.password) {
      setErrors(prev => ({ ...prev, password: "" }));
    }
    setApiError("");
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);

    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
    }
    setApiError("");
  };

  // API call function
  const resetPassword = async (passwordData) => {
    // try {
    //   setIsLoading(true);
    //   setApiError("");

    //   // Replace with your actual API endpoint
    //   const response = await fetch('/api/auth/reset-password', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       password: passwordData.password,
    //       confirmPassword: passwordData.confirmPassword
    //     }),
    //   });

    //   const data = await response.json();

    //   if (!response.ok) {
    //     throw new Error(data.message || 'Password reset failed');
    //   }

    //   // Redirect to login with success message
    //   console.log('Password reset successful:', data);
    //   navigate('/login?message=Password reset successfully. Please login with your new password.');

    // } catch (error) {
    //   console.error('Password reset error:', error);
    //   setApiError(error.message || 'An error occurred during password reset. Please try again.');
    // } finally {
    //   setIsLoading(false);
    // }

    navigate('/auth/forget-password/success')
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const passwordData = {
        password: password,
        confirmPassword: confirmPassword
      };

      await resetPassword(passwordData);
    }
  };

  return (
    <div className="new-password-container">

      <form className="new-password-form-container" onSubmit={handleSubmit}>
        <img src="/logo.svg" alt="" />
        <h1 className="new-password-form-container-title">New Password</h1>
        <p className="new-password-form-container-description">Set the new password for your account so you can login.</p>

        {/* API Error Message */}
        {apiError && (
          <div className="new-password-form-container-api-error">
            {apiError}
          </div>
        )}

        <div className="new-password-form-container-input">
          <label htmlFor="password">New Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your new password"
            className={errors.password ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.password && (
            <span className="new-password-form-container-error-message">{errors.password}</span>
          )}
          <img
            src="/eye-icon.svg"
            alt="Toggle password visibility"
            className="new-password-form-container-eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>

        <div className="new-password-form-container-input">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm your new password"
            className={errors.confirmPassword ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <span className="new-password-form-container-error-message">{errors.confirmPassword}</span>
          )}
          <img
            src="/eye-icon.svg"
            alt="Toggle password visibility"
            className="new-password-form-container-eye-icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </div>

        <button
          type="submit"
          className="new-password-form-container-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="new-password-form-container-loading">
              <div className="new-password-form-container-spinner"></div>
              Setting New Password...
            </div>
          ) : (
            'Set New Password'
          )}
        </button>
      </form>

    </div>
  );
}

export default NewPassword;