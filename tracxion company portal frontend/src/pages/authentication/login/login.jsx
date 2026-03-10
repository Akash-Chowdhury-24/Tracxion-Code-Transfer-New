import { useState, useEffect } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Auto-fill form data from localStorage on page load
  useEffect(() => {
    const savedData = localStorage.getItem('tracxion admin rememberMe');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setEmail(parsedData.email || "");
        setPassword(parsedData.password || "");
        setRememberMe(parsedData.rememberMe || false);
      } catch (error) {
        console.error('Error parsing saved login data:', error);
        // Clear corrupted data
        localStorage.removeItem('tracxion admin rememberMe');
      }
    }
  }, []);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

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
    };
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

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        newErrors.password = "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
      }
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

    // Save live data to localStorage if remember me is active
    if (rememberMe) {
      saveToLocalStorage(newEmail, password, rememberMe);
    }

    if (errors.email) {
      setErrors(prev => ({ ...prev, email: "" }));
    }
    setApiError("");
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Save live data to localStorage if remember me is active
    if (rememberMe) {
      saveToLocalStorage(email, newPassword, rememberMe);
    }

    if (errors.password) {
      setErrors(prev => ({ ...prev, password: "" }));
    }
    setApiError("");
  };

  // Function to save data to localStorage
  const saveToLocalStorage = (emailData, passwordData, rememberMeData) => {
    if (rememberMeData) {
      const dataToSave = {
        email: emailData,
        password: passwordData,
        rememberMe: rememberMeData
      };
      localStorage.setItem('tracxion admin rememberMe', JSON.stringify(dataToSave));
    } else {
      localStorage.removeItem('tracxion admin rememberMe');
    }
  };

  const handleRememberMeChange = (e) => {
    const newRememberMe = e.target.checked;
    setRememberMe(newRememberMe);
    saveToLocalStorage(email, password, newRememberMe);
  };

  // API call function
  const loginUser = async (loginData) => {
    // try {
    //   setIsLoading(true);
    //   setApiError("");

    //   // Replace with your actual API endpoint
    //   const response = await fetch('/api/auth/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(loginData),
    //   });

    //   const data = await response.json();

    //   if (!response.ok) {
    //     throw new Error(data.message || 'Login failed');
    //   }

    //   // Store authentication token
    //   if (data.token) {
    //     if (rememberMe) {
    //       localStorage.setItem('authToken', data.token);
    //     } else {
    //       sessionStorage.setItem('authToken', data.token);
    //     }
    //   }

    //   // Redirect to dashboard or handle successful login
    //   console.log('Login successful:', data);
    //   navigate('/dashboard');

    // } catch (error) {
    //   console.error('Login error:', error);
    //   setApiError(error.message || 'An error occurred during login. Please try again.');
    // } finally {
    //   setIsLoading(false);
    // }

    navigate('/dashboard');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const loginData = {
        email: email.trim(),
        password: password,
        rememberMe: rememberMe
      };

      await loginUser(loginData);
    }
  };

  return (
    <div className="login-container">

      <form className="login-form-container" onSubmit={handleSubmit}>
        <img src="/logo.svg" alt="" />
        <h1 className="login-form-container-title">Welcome Back</h1>
        <p className="login-form-container-description">Enter your email and password to access your account</p>

        {/* API Error Message */}
        {apiError && (
          <div className="login-form-container-api-error">
            {apiError}
          </div>
        )}

        <div className="login-form-container-input">
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
            <span className="login-form-container-error-message">{errors.email}</span>
          )}
        </div>

        <div className="login-form-container-input">
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            className={errors.password ? 'error' : ''}
            disabled={isLoading}
            readOnly={showPassword}
          />
          {errors.password && (
            <span className="login-form-container-error-message">{errors.password}</span>
          )}
          <img src="/eye-icon.svg" alt="" className="login-form-container-eye-icon" onClick={() => setShowPassword(!showPassword)} />
        </div>

        <div className="login-form-container-remember-me">
          <div className="login-form-container-remember-me-checkbox">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              disabled={isLoading}
            />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <p className="login-form-container-remember-me-forgot-password" onClick={() => navigate('forget-password')}>Forgot password?</p>
        </div>

        <button
          type="submit"
          className="login-form-container-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="login-form-container-loading">
              <div className="login-form-container-spinner"></div>
              Signing In...
            </div>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

    </div>
  );
}

export default Login;