// DOM Elements
const togglePasswordBtns = document.querySelectorAll(".toggle-password");
const passwordInputs = document.querySelectorAll('input[type="password"]');

// Test credentials
const TEST_EMAIL = "johndoe@gmail.com";
const TEST_PASSWORD = "Password@123";

// Toggle password visibility
togglePasswordBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    const input = passwordInputs[index];
    const type = input.type === "password" ? "text" : "password";
    input.type = type;
    btn.querySelector(".material-symbols-rounded").textContent = type === "password" ? "visibility" : "visibility_off";
  });
});

// Handle Sign In
function handleSignIn(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.querySelector('input[type="email"]').value;
  const password = form.querySelector('input[type="password"]').value;

  // Check credentials
  if (email === TEST_EMAIL && password === TEST_PASSWORD) {
    // Successful login
    window.location.href = "../dashboard.html";
  } else {
    // Show error message
    alert("Invalid credentials. Please use:\nEmail: johndoe@gmail.com\nPassword: Password@123");
  }
}

// Handle Sign Up
function handleSignUp(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.querySelector('input[type="email"]').value;
  const password = form.querySelector('input[type="password"]').value;

  // Check credentials
  if (email === TEST_EMAIL && password === TEST_PASSWORD) {
    // Successful registration
    window.location.href = "../dashboard.html";
  } else {
    // Show error message
    alert("Please use:\nEmail: johndoe@gmail.com\nPassword: Password@123");
  }
}

// Social Auth Handlers
document.querySelectorAll(".social-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const provider = btn.classList.contains("google") ? "Google" : "Apple";
    alert(`Please use email login with:\nEmail: johndoe@gmail.com\nPassword: Password@123`);
  });
});

// Form Validation
document.querySelectorAll(".auth-form").forEach((form) => {
  form.addEventListener("input", (e) => {
    const input = e.target;
    if (input.type === "email") {
      const isValid = input.checkValidity();
      input.style.borderColor = isValid ? "rgba(255, 255, 255, 0.1)" : "#ff4444";
    }
  });
});
