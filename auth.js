const AUTH_KEY = 'eduBridgeAuthSeen';
const API_BASE = 'http://localhost:4000/api/auth';
const USERS_KEY = 'eduBridgeUsers';

// User storage functions
const getUsers = () => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (e) {
    console.error('Error getting users:', e);
    return [];
  }
};

const saveUser = (user) => {
  try {
    const users = getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    console.log('User saved successfully:', user.email);
    return true;
  } catch (e) {
    console.error('Error saving user:', e);
    return false;
  }
};

const findUser = (email) => {
  const users = getUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

const validateUser = (email, password) => {
  const user = findUser(email);
  return user && user.password === password ? user : null;
};

// Check if we're on login page or need to redirect
document.addEventListener('DOMContentLoaded', () => {
  try {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop();
    
    // Check if user is already authenticated
    const hasToken = localStorage.getItem('eduBridgeToken');
    console.log('Auth check:', { currentPage, hasToken: !!hasToken });
    
    // If user has token and is not on login page, allow access
    if (hasToken && currentPage !== 'login.html') {
      console.log('User authenticated, allowing access to:', currentPage);
      return; // Allow access to the page
    }
    
    // If user has token but is on login page, redirect to index
    if (hasToken && currentPage === 'login.html') {
      console.log('User already logged in, redirecting to homepage');
      window.location.href = 'index.html';
      return;
    }
    
    // If user has no token and is not on login page, redirect to login
    if (!hasToken && currentPage !== 'login.html') {
      console.log('User not authenticated, redirecting to login from:', currentPage);
      window.location.href = 'login.html';
      return;
    }
    
    // If user has no token and is on login page, initialize login form
    if (!hasToken && currentPage === 'login.html') {
      console.log('Initializing login page for unauthenticated user');
      initializeLoginForm();
      return;
    }
    
  } catch (error) {
    console.error('Error initializing auth system:', error);
    // Fallback: try to show a simple alert
    alert('Authentication system error. Please refresh the page.');
  }
});

// Initialize login form functionality
const initializeLoginForm = () => {
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        50% { transform: translateX(5px); }
        75% { transform: translateX(-5px); }
      }
    </style>
  `;
  
  // Add screen switching functionality
  const setScreen = (screen) => {
    document.querySelectorAll('.auth-panel').forEach((panel) => {
      panel.style.display = panel.dataset.panel === screen ? 'block' : 'none';
    });
  };
  
  // Add click handlers for navigation
  document.querySelectorAll('[data-screen]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      setScreen(btn.dataset.screen);
    });
  });
  
  // Enhanced email validation
  const isValidEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    
    // Basic structure checks
    if (email.includes(' ')) return false;
    if (!email.includes('@')) return false;
    if (email.indexOf('@') === 0 || email.indexOf('@') === email.length - 1) return false;
    
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    
    const [localPart, domain] = parts;
    
    // Local part validation
    if (localPart.length < 1) return false;
    
    // Domain validation
    if (!domain.includes('.')) return false;
    const domainParts = domain.split('.');
    if (domainParts.length < 2) return false;
    
    // TLD validation (at least 2 characters)
    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2) return false;
    
    return true;
  };
  
  // Email validation feedback
  const setupEmailValidation = (emailInput) => {
    if (!emailInput) return;
    
    let typingTimer;
    const doneTypingInterval = 500;
    
    // Real-time validation during typing
    emailInput.addEventListener('input', (e) => {
      clearTimeout(typingTimer);
      const email = e.target.value;
      
      // Clear previous validation styling
      emailInput.style.border = '1px solid #d1d5db';
      
      if (email.length > 0) {
        typingTimer = setTimeout(() => {
          if (!isValidEmail(email)) {
            // Show typing error
            showEmailError(emailInput, '⚠️ Please enter a valid email address (e.g., user@example.com)');
            emailInput.style.border = '2px solid #dc2626';
          } else {
            // Valid email
            clearEmailError(emailInput);
            emailInput.style.border = '2px solid #22c55e';
          }
        }, doneTypingInterval);
      } else {
        clearEmailError(emailInput);
      }
    });
    
    // Validation on blur
    emailInput.addEventListener('blur', (e) => {
      const email = e.target.value;
      if (email.length > 0 && !isValidEmail(email)) {
        showEmailError(emailInput, '⚠️ Invalid email format. Please check and try again.');
        emailInput.style.border = '2px solid #dc2626';
      } else if (email.length > 0 && isValidEmail(email)) {
        clearEmailError(emailInput);
        emailInput.style.border = '2px solid #22c55e';
      }
    });
  };
  
  // Show email-specific error
  const showEmailError = (input, message) => {
    clearEmailError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'email-error';
    errorDiv.style.cssText = `
      color: #dc2626 !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      margin-top: 4px !important;
      margin-bottom: 8px !important;
      animation: shake 0.3s ease-in-out !important;
      text-align: left !important;
    `;
    errorDiv.textContent = message;
    
    input.parentNode.style.position = 'relative';
    input.parentNode.appendChild(errorDiv);
  };
  
  // Clear email-specific error
  const clearEmailError = (input) => {
    const errorDiv = input.parentNode.querySelector('.email-error');
    if (errorDiv) errorDiv.remove();
  };
  
  // Show password-specific error
  const showPasswordError = (input, message) => {
    clearPasswordError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'password-error';
    errorDiv.style.cssText = `
      color: #dc2626 !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      margin-top: 4px !important;
      margin-bottom: 8px !important;
      animation: shake 0.3s ease-in-out !important;
      text-align: left !important;
    `;
    errorDiv.textContent = message;
    
    input.parentNode.style.position = 'relative';
    input.parentNode.appendChild(errorDiv);
  };
  
  // Clear password-specific error
  const clearPasswordError = (input) => {
    const errorDiv = input.parentNode.querySelector('.password-error');
    if (errorDiv) errorDiv.remove();
  };
  
  // Show error message with auto-cleanup
  const showError = (msg) => {
    try {
      console.log('showError called with:', msg);
      
      // Remove any existing error first
      clearError();
      
      console.log('Creating error element');
      const bar = document.createElement('div');
      bar.className = 'auth-error';
      bar.textContent = `⚠️ ${msg}`;
      bar.style.cssText = `
        background: #ff0000 !important;
        color: #ffffff !important;
        padding: 16px 20px !important;
        border-radius: 12px !important;
        border: 3px solid #cc0000 !important;
        margin-bottom: 20px !important;
        font-size: 16px !important;
        font-weight: 700 !important;
        text-align: center !important;
        animation: shake 0.5s ease-in-out !important;
        box-shadow: 0 8px 16px rgba(255, 0, 0, 0.3) !important;
        position: relative !important;
        z-index: 1000 !important;
      `;
      
      console.log('Finding form to insert error before');
      const firstForm = document.querySelector('.auth-form');
      console.log('Found form:', firstForm);
      
      if (firstForm && firstForm.parentNode) {
        console.log('Inserting error before form');
        firstForm.parentNode.insertBefore(bar, firstForm);
        console.log('Error inserted successfully');
      } else {
        console.log('Form not found, appending to body');
        document.body.appendChild(bar);
      }
      
      // Auto-cleanup after 3 seconds
      setTimeout(() => {
        if (bar.parentNode) {
          bar.style.opacity = '0';
          bar.style.transform = 'translateY(-10px)';
          bar.style.transition = 'all 0.3s ease';
          setTimeout(() => bar.remove(), 300);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error in showError function:', error);
      // Fallback: simple alert
      alert(`⚠️ ${msg}`);
    }
  };
  
  // Clear error
  const clearError = () => {
    const bar = document.querySelector('.auth-error');
    if (bar) bar.remove();
  };
  
  // Complete authentication and redirect to index
  const complete = (token, email, name) => {
    try {
      // Save auth tokens
      if (token) {
        localStorage.setItem('eduBridgeToken', token);
        localStorage.setItem('eduBridgeEmail', email || '');
        if (name) {
          localStorage.setItem('eduBridgeName', name);
        }
      }
      
      console.log('Login successful, redirecting to homepage');
      
      // Redirect to homepage
      window.location.href = 'index.html';
    } catch (e) {
      console.error('Error saving auth state:', e);
      // Still redirect even if localStorage fails
      window.location.href = 'index.html';
    }
  };
  
  // Handle form submissions
  const signinForm = document.querySelector('[data-form="signin"]');
  const signupForm = document.querySelector('[data-form="signup"]');
  const resetForm = document.querySelector('[data-form="reset"]');
  
  if (signinForm) {
    // Setup email validation
    const emailInput = signinForm.querySelector('input[type="email"]');
    setupEmailValidation(emailInput);
    
    signinForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = signinForm.querySelector('input[type="email"]').value;
      const password = signinForm.querySelector('input[type="password"]').value;
      
      // Enhanced validation
      if (!email || !password) {
        console.log('Empty fields validation failed');
        showError('Please fill in all fields');
        if (!email) emailInput.style.border = '2px solid #dc2626';
        if (!password) passInput.style.border = '2px solid #dc2626';
        return;
      }
      
      if (!isValidEmail(email)) {
        console.log('Email validation failed');
        showError('Invalid credentials - Please check your email format');
        emailInput.style.border = '2px solid #dc2626';
        return;
      }
      
      if (password.length < 8) {
        console.log('Password length validation failed');
        showError('Invalid credentials - Password must be at least 8 characters');
        passInput.style.border = '2px solid #dc2626';
        return;
      }
      
      // Check if user exists and validate credentials
      console.log('Validating user credentials for:', email);
      const existingUser = findUser(email);
      
      if (!existingUser) {
        console.log('User not found');
        showError('Invalid credentials - Email not registered. Please sign up first.');
        return;
      }
      
      if (existingUser.password !== password) {
        console.log('Password mismatch');
        showError('Invalid credentials - Email or password is incorrect');
        return;
      }
      
      console.log('Login successful for:', email);
      // Successful login
      complete('demo-token', email, existingUser.name);
    });
  }
  
  if (signupForm) {
    // Setup email validation
    const emailInput = signupForm.querySelector('input[type="email"]');
    setupEmailValidation(emailInput);
    
    // Setup password validation
    const [nameInput, emailInput2, passInput, confirmInput] = signupForm.querySelectorAll('input');
    
    let passwordTimer;
    const passwordCheckInterval = 500;
    
    // Real-time password validation
    confirmInput.addEventListener('input', (e) => {
      clearTimeout(passwordTimer);
      const password = passInput.value;
      const confirm = e.target.value;
      
      // Clear previous validation styling
      confirmInput.style.border = '1px solid #d1d5db';
      
      if (confirm.length > 0 && password.length > 0) {
        passwordTimer = setTimeout(() => {
          if (password !== confirm) {
            // Show typing error
            showPasswordError(confirmInput, '⚠️ Passwords do not match');
            confirmInput.style.border = '2px solid #dc2626';
          } else {
            // Valid password match
            clearPasswordError(confirmInput);
            confirmInput.style.border = '2px solid #22c55e';
          }
        }, passwordCheckInterval);
      } else {
        clearPasswordError(confirmInput);
      }
    });
    
    // Also validate when password changes
    passInput.addEventListener('input', (e) => {
      clearTimeout(passwordTimer);
      const password = e.target.value;
      const confirm = confirmInput.value;
      
      if (confirm.length > 0 && password.length > 0) {
        passwordTimer = setTimeout(() => {
          if (password !== confirm) {
            showPasswordError(confirmInput, '⚠️ Passwords do not match');
            confirmInput.style.border = '2px solid #dc2626';
          } else {
            clearPasswordError(confirmInput);
            confirmInput.style.border = '2px solid #22c55e';
          }
        }, passwordCheckInterval);
      } else {
        clearPasswordError(confirmInput);
      }
    });
    
    signupForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const [nameInput, emailInput, passInput, confirmInput] = signupForm.querySelectorAll('input');
      
      console.log('Signup validation:', {
        name: nameInput.value,
        email: emailInput.value,
        password: passInput.value,
        confirm: confirmInput.value
      });
      
      // Enhanced validation
      if (nameInput.value.trim().length < 2) {
        console.log('Name validation failed');
        showError('Please enter your full name (at least 2 characters)');
        nameInput.style.border = '2px solid #dc2626';
        return;
      }
      
      if (!isValidEmail(emailInput.value)) {
        console.log('Email validation failed');
        showError('Invalid email format - Please enter a valid email address');
        emailInput.style.border = '2px solid #dc2626';
        return;
      }
      
      if (passInput.value.length < 8) {
        console.log('Password length validation failed');
        showError('Password must be at least 8 characters long');
        passInput.style.border = '2px solid #dc2626';
        return;
      }
      
      console.log('Checking password match:', { password: passInput.value, confirm: confirmInput.value });
      
      if (passInput.value !== confirmInput.value) {
        console.log('Passwords do not match');
        // Show inline error like email validation
        showPasswordError(confirmInput, '⚠️ Passwords do not match - Please re-enter your password');
        passInput.style.border = '2px solid #dc2626';
        confirmInput.style.border = '2px solid #dc2626';
        return;
      }
      
      console.log('Passwords match successfully');
      
      // Simulate email already exists
      if (emailInput.value === 'existing@user.com') {
        console.log('Email already exists');
        showError('Email already exists - Please use a different email or sign in');
        return;
      }
      
      console.log('Signup successful');
      // Successful signup
      complete('demo-token', emailInput.value, nameInput.value.trim());
    });
  }
  
  if (resetForm) {
    // Setup email validation
    const emailInput = resetForm.querySelector('input[type="email"]');
    setupEmailValidation(emailInput);
    
    resetForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = resetForm.querySelector('input[type="email"]').value;
      
      if (!email) {
        showError('Please enter your email address');
        emailInput.style.border = '2px solid #dc2626';
        return;
      }
      
      if (!isValidEmail(email)) {
        showError('Invalid email format - Please enter a valid email address');
        emailInput.style.border = '2px solid #dc2626';
        return;
      }
      
      // Check if email exists in our user database
      const existingUser = findUser(email);
      if (!existingUser) {
        console.log('Email not found in user database');
        showError('Email not found - Please check your email or sign up for a new account');
        return;
      }
      
      // Success message
      showError('Password reset link sent! Please check your email. (Demo)');
      setTimeout(() => setScreen('signin'), 3000);
    });
  }
  
  // Handle Google login button
  const googleBtn = document.querySelector('[data-action="complete"]');
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      showError('Google login coming soon! (Demo)');
    });
  }
  
  console.log('Login form initialized successfully');
};
