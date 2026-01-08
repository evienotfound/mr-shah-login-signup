import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { AuthButton } from "@/components/ui/AuthButton";

// Complete PHP/MySQL Code Guide for Mr Shah Men's Clothing Store
// This page contains all the backend code needed for your college project

const PHPGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState("structure");

  // Code snippets for each file
  const codeSnippets = {
    structure: `
📁 mr_shah_store/
├── 📁 css/
│   └── style.css          (Styling for all pages)
├── 📁 includes/
│   └── db_connect.php     (Database connection file)
├── 📁 php/
│   ├── signup.php         (Handle signup form)
│   ├── login.php          (Handle login form)
│   └── logout.php         (Destroy session)
├── index.php              (Home page)
├── login.html             (Login page)
└── signup.html            (Signup page)
    `,
    database: `
-- =========================================
-- MR SHAH MEN'S CLOTHING STORE DATABASE
-- SQL Code for MySQL Database Setup
-- =========================================

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS mr_shah_store;

-- Step 2: Select the database to use
USE mr_shah_store;

-- Step 3: Create the users table
-- This table stores all customer information
CREATE TABLE IF NOT EXISTS users (
    -- Primary key: Auto-incrementing unique ID for each user
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Customer's full name (required, max 100 characters)
    full_name VARCHAR(100) NOT NULL,
    
    -- Email address (required, must be unique, max 100 characters)
    email VARCHAR(100) NOT NULL UNIQUE,
    
    -- Mobile number (required, 15 characters for international format)
    mobile VARCHAR(15) NOT NULL,
    
    -- Password hash (required, 255 characters for bcrypt hash)
    password VARCHAR(255) NOT NULL,
    
    -- Timestamp when account was created (auto-set)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Add an index on email for faster login queries
CREATE INDEX idx_email ON users(email);

-- =========================================
-- HOW TO RUN THIS SQL:
-- 1. Open XAMPP Control Panel
-- 2. Start Apache and MySQL
-- 3. Open phpMyAdmin (http://localhost/phpmyadmin)
-- 4. Click "SQL" tab at the top
-- 5. Paste this entire code and click "Go"
-- =========================================
    `,
    dbConnect: `
<?php
/**
 * =========================================
 * DATABASE CONNECTION FILE
 * File: includes/db_connect.php
 * =========================================
 * This file establishes connection to MySQL database.
 * Include this file in any PHP page that needs database access.
 */

// Database configuration constants
// These values work with default XAMPP installation
define('DB_HOST', 'localhost');     // Database server (localhost for XAMPP)
define('DB_USER', 'root');          // Default XAMPP username
define('DB_PASS', '');              // Default XAMPP password (empty)
define('DB_NAME', 'mr_shah_store'); // Our database name

// Create connection using mysqli (MySQL Improved)
// mysqli is recommended over the older mysql extension
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check if connection was successful
// If connection fails, stop execution and show error
if ($conn->connect_error) {
    // die() stops the script and displays the message
    die("Connection failed: " . $conn->connect_error);
}

// Set character encoding to UTF-8
// This ensures special characters are handled correctly
$conn->set_charset("utf8mb4");

/**
 * HOW TO USE THIS FILE:
 * In any PHP file where you need database access, add:
 * require_once 'includes/db_connect.php';
 * 
 * Then use $conn to run queries:
 * $result = $conn->query("SELECT * FROM users");
 */
?>
    `,
    signup: `
<?php
/**
 * =========================================
 * SIGNUP HANDLER
 * File: php/signup.php
 * =========================================
 * This file processes the signup form submission.
 * It validates input, hashes the password, and stores data in database.
 */

// Start PHP session (required for storing user data after login)
session_start();

// Include the database connection file
// Using require_once ensures file is included only once
require_once '../includes/db_connect.php';

// Check if form was submitted using POST method
// This prevents direct access to this file via URL
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // ===== STEP 1: GET AND SANITIZE FORM DATA =====
    // trim() removes whitespace from beginning and end
    // htmlspecialchars() converts special characters to HTML entities (prevents XSS attacks)
    
    $full_name = trim(htmlspecialchars($_POST['full_name']));
    $email = trim(htmlspecialchars($_POST['email']));
    $mobile = trim(htmlspecialchars($_POST['mobile']));
    $password = $_POST['password'];  // Don't sanitize password (will be hashed)
    $confirm_password = $_POST['confirm_password'];
    
    // ===== STEP 2: VALIDATE INPUT DATA =====
    $errors = []; // Array to store validation errors
    
    // Check if full name is empty
    if (empty($full_name)) {
        $errors[] = "Full name is required";
    }
    
    // Validate email format using filter_var()
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Valid email address is required";
    }
    
    // Validate mobile number (should be 10 digits)
    if (empty($mobile) || !preg_match('/^[0-9]{10}$/', $mobile)) {
        $errors[] = "Valid 10-digit mobile number is required";
    }
    
    // Check password length (minimum 6 characters)
    if (strlen($password) < 6) {
        $errors[] = "Password must be at least 6 characters";
    }
    
    // Check if passwords match
    if ($password !== $confirm_password) {
        $errors[] = "Passwords do not match";
    }
    
    // ===== STEP 3: CHECK IF EMAIL ALREADY EXISTS =====
    // Use prepared statement to prevent SQL injection
    $check_email = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check_email->bind_param("s", $email);  // "s" means string type
    $check_email->execute();
    $result = $check_email->get_result();
    
    if ($result->num_rows > 0) {
        $errors[] = "Email address is already registered";
    }
    $check_email->close();
    
    // ===== STEP 4: IF NO ERRORS, INSERT INTO DATABASE =====
    if (empty($errors)) {
        // Hash the password using PASSWORD_DEFAULT (bcrypt)
        // This creates a secure, one-way hash that cannot be reversed
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Prepare INSERT statement (prevents SQL injection)
        $stmt = $conn->prepare(
            "INSERT INTO users (full_name, email, mobile, password) VALUES (?, ?, ?, ?)"
        );
        
        // Bind parameters to the prepared statement
        // "ssss" means 4 string parameters
        $stmt->bind_param("ssss", $full_name, $email, $mobile, $hashed_password);
        
        // Execute the query
        if ($stmt->execute()) {
            // Success! Redirect to login page with success message
            header("Location: ../login.html?signup=success");
            exit();
        } else {
            $errors[] = "Registration failed. Please try again.";
        }
        
        $stmt->close();
    }
    
    // ===== STEP 5: IF ERRORS, REDIRECT BACK WITH ERROR =====
    if (!empty($errors)) {
        // Store first error in session to display on signup page
        $_SESSION['signup_error'] = $errors[0];
        header("Location: ../signup.html?error=1");
        exit();
    }
    
} else {
    // If someone tries to access this file directly (not via form)
    header("Location: ../signup.html");
    exit();
}

// Close database connection
$conn->close();
?>
    `,
    login: `
<?php
/**
 * =========================================
 * LOGIN HANDLER
 * File: php/login.php
 * =========================================
 * This file processes the login form submission.
 * It verifies credentials and creates a user session.
 */

// Start PHP session
// Sessions are used to maintain user login state across pages
session_start();

// Include database connection
require_once '../includes/db_connect.php';

// Check if form was submitted via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // ===== STEP 1: GET FORM DATA =====
    $email = trim(htmlspecialchars($_POST['email']));
    $password = $_POST['password'];  // Don't sanitize (will be verified)
    
    // ===== STEP 2: VALIDATE INPUT =====
    if (empty($email) || empty($password)) {
        $_SESSION['login_error'] = "Please fill in all fields";
        header("Location: ../login.html?error=1");
        exit();
    }
    
    // ===== STEP 3: QUERY DATABASE FOR USER =====
    // Use prepared statement to prevent SQL injection
    $stmt = $conn->prepare("SELECT id, full_name, email, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    // ===== STEP 4: VERIFY USER EXISTS AND PASSWORD IS CORRECT =====
    if ($result->num_rows === 1) {
        // User found - get their data
        $user = $result->fetch_assoc();
        
        // Verify password using password_verify()
        // This compares the entered password with the stored hash
        if (password_verify($password, $user['password'])) {
            
            // ===== STEP 5: LOGIN SUCCESSFUL - CREATE SESSION =====
            // Regenerate session ID to prevent session fixation attacks
            session_regenerate_id(true);
            
            // Store user information in session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['full_name'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['logged_in'] = true;
            
            // Redirect to home page
            header("Location: ../index.php");
            exit();
            
        } else {
            // Password incorrect
            $_SESSION['login_error'] = "Invalid email or password";
            header("Location: ../login.html?error=1");
            exit();
        }
        
    } else {
        // User not found
        $_SESSION['login_error'] = "Invalid email or password";
        header("Location: ../login.html?error=1");
        exit();
    }
    
    $stmt->close();
    
} else {
    // Direct access attempt - redirect to login page
    header("Location: ../login.html");
    exit();
}

// Close database connection
$conn->close();
?>
    `,
    logout: `
<?php
/**
 * =========================================
 * LOGOUT HANDLER
 * File: php/logout.php
 * =========================================
 * This file destroys the user session and logs them out.
 */

// Start the session (required to access session data)
session_start();

// ===== STEP 1: UNSET ALL SESSION VARIABLES =====
// This removes all data stored in $_SESSION
$_SESSION = array();

// ===== STEP 2: DESTROY THE SESSION COOKIE =====
// Check if session uses cookies
if (ini_get("session.use_cookies")) {
    // Get session cookie parameters
    $params = session_get_cookie_params();
    
    // Set cookie to expire in the past (deletes it)
    setcookie(
        session_name(),           // Cookie name
        '',                       // Empty value
        time() - 42000,           // Expired time (past)
        $params["path"],          // Cookie path
        $params["domain"],        // Cookie domain
        $params["secure"],        // HTTPS only?
        $params["httponly"]       // HTTP only? (prevents JavaScript access)
    );
}

// ===== STEP 3: DESTROY THE SESSION =====
session_destroy();

// ===== STEP 4: REDIRECT TO LOGIN PAGE =====
header("Location: ../login.html?logout=success");
exit();
?>
    `,
    loginHtml: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Mr Shah Men's Clothing</title>
    
    <!-- Bootstrap CSS for styling -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Google Fonts for elegant typography -->
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="css/style.css" rel="stylesheet">
</head>
<body class="auth-page">
    
    <div class="container">
        <div class="row justify-content-center align-items-center min-vh-100">
            <div class="col-md-5">
                
                <!-- Login Card -->
                <div class="auth-card">
                    <!-- Logo -->
                    <div class="text-center mb-4">
                        <h1 class="logo">MR SHAH</h1>
                        <div class="tagline">
                            <span class="line"></span>
                            <span class="text">Men's Clothing</span>
                            <span class="line"></span>
                        </div>
                    </div>
                    
                    <!-- Welcome Text -->
                    <h2 class="auth-title">Welcome Back</h2>
                    <p class="auth-subtitle">Sign in to access your account</p>
                    
                    <!-- Error Message (shown via PHP) -->
                    <div id="error-message" class="alert alert-danger d-none"></div>
                    
                    <!-- Success Message (after signup) -->
                    <div id="success-message" class="alert alert-success d-none"></div>
                    
                    <!-- Login Form -->
                    <form action="php/login.php" method="POST" id="loginForm">
                        <!-- Email Field -->
                        <div class="mb-3">
                            <label for="email" class="form-label">Email Address</label>
                            <input 
                                type="email" 
                                class="form-control" 
                                id="email" 
                                name="email" 
                                placeholder="Enter your email"
                                required
                            >
                        </div>
                        
                        <!-- Password Field -->
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input 
                                type="password" 
                                class="form-control" 
                                id="password" 
                                name="password" 
                                placeholder="Enter your password"
                                required
                            >
                        </div>
                        
                        <!-- Forgot Password Link -->
                        <div class="text-end mb-3">
                            <a href="#" class="forgot-link">Forgot password?</a>
                        </div>
                        
                        <!-- Submit Button -->
                        <button type="submit" class="btn btn-primary w-100">
                            Sign In
                        </button>
                    </form>
                    
                    <!-- Divider -->
                    <div class="divider">
                        <span>or</span>
                    </div>
                    
                    <!-- Sign Up Link -->
                    <p class="text-center auth-footer">
                        Don't have an account? 
                        <a href="signup.html" class="auth-link">Create Account</a>
                    </p>
                </div>
                
            </div>
        </div>
    </div>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Custom JavaScript for validation and messages -->
    <script>
        // Check URL parameters for messages
        const urlParams = new URLSearchParams(window.location.search);
        
        // Show success message after signup
        if (urlParams.get('signup') === 'success') {
            const successDiv = document.getElementById('success-message');
            successDiv.textContent = 'Account created successfully! Please login.';
            successDiv.classList.remove('d-none');
        }
        
        // Show logout success message
        if (urlParams.get('logout') === 'success') {
            const successDiv = document.getElementById('success-message');
            successDiv.textContent = 'You have been logged out successfully.';
            successDiv.classList.remove('d-none');
        }
        
        // Show error message if login failed
        if (urlParams.get('error') === '1') {
            const errorDiv = document.getElementById('error-message');
            errorDiv.textContent = 'Invalid email or password. Please try again.';
            errorDiv.classList.remove('d-none');
        }
        
        // Form validation before submit
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                e.preventDefault();
                alert('Please fill in all fields');
            }
        });
    </script>
</body>
</html>
    `,
    signupHtml: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up - Mr Shah Men's Clothing</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="css/style.css" rel="stylesheet">
</head>
<body class="auth-page">
    
    <div class="container">
        <div class="row justify-content-center align-items-center min-vh-100 py-5">
            <div class="col-md-5">
                
                <!-- Signup Card -->
                <div class="auth-card">
                    <!-- Logo -->
                    <div class="text-center mb-4">
                        <h1 class="logo">MR SHAH</h1>
                        <div class="tagline">
                            <span class="line"></span>
                            <span class="text">Men's Clothing</span>
                            <span class="line"></span>
                        </div>
                    </div>
                    
                    <!-- Header Text -->
                    <h2 class="auth-title">Create Account</h2>
                    <p class="auth-subtitle">Join Mr Shah for exclusive offers</p>
                    
                    <!-- Error Message -->
                    <div id="error-message" class="alert alert-danger d-none"></div>
                    
                    <!-- Signup Form -->
                    <form action="php/signup.php" method="POST" id="signupForm">
                        <!-- Full Name -->
                        <div class="mb-3">
                            <label for="full_name" class="form-label">Full Name</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                id="full_name" 
                                name="full_name" 
                                placeholder="Enter your full name"
                                required
                            >
                        </div>
                        
                        <!-- Email -->
                        <div class="mb-3">
                            <label for="email" class="form-label">Email Address</label>
                            <input 
                                type="email" 
                                class="form-control" 
                                id="email" 
                                name="email" 
                                placeholder="Enter your email"
                                required
                            >
                        </div>
                        
                        <!-- Mobile -->
                        <div class="mb-3">
                            <label for="mobile" class="form-label">Mobile Number</label>
                            <input 
                                type="tel" 
                                class="form-control" 
                                id="mobile" 
                                name="mobile" 
                                placeholder="Enter 10-digit mobile"
                                pattern="[0-9]{10}"
                                required
                            >
                        </div>
                        
                        <!-- Password -->
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input 
                                type="password" 
                                class="form-control" 
                                id="password" 
                                name="password" 
                                placeholder="Create password (min 6 chars)"
                                minlength="6"
                                required
                            >
                        </div>
                        
                        <!-- Confirm Password -->
                        <div class="mb-3">
                            <label for="confirm_password" class="form-label">Confirm Password</label>
                            <input 
                                type="password" 
                                class="form-control" 
                                id="confirm_password" 
                                name="confirm_password" 
                                placeholder="Re-enter your password"
                                required
                            >
                        </div>
                        
                        <!-- Terms Checkbox -->
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="terms" required>
                            <label class="form-check-label" for="terms">
                                I agree to the <a href="#" class="auth-link">Terms of Service</a>
                            </label>
                        </div>
                        
                        <!-- Submit Button -->
                        <button type="submit" class="btn btn-primary w-100">
                            Create Account
                        </button>
                    </form>
                    
                    <!-- Login Link -->
                    <p class="text-center auth-footer mt-4">
                        Already have an account? 
                        <a href="login.html" class="auth-link">Sign In</a>
                    </p>
                </div>
                
            </div>
        </div>
    </div>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Validation Script -->
    <script>
        document.getElementById('signupForm').addEventListener('submit', function(e) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            const mobile = document.getElementById('mobile').value;
            
            // Check passwords match
            if (password !== confirmPassword) {
                e.preventDefault();
                alert('Passwords do not match!');
                return;
            }
            
            // Check password length
            if (password.length < 6) {
                e.preventDefault();
                alert('Password must be at least 6 characters!');
                return;
            }
            
            // Check mobile format
            if (!/^[0-9]{10}$/.test(mobile)) {
                e.preventDefault();
                alert('Please enter a valid 10-digit mobile number!');
                return;
            }
        });
        
        // Show error from PHP session
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('error') === '1') {
            const errorDiv = document.getElementById('error-message');
            errorDiv.textContent = 'Registration failed. Please check your details.';
            errorDiv.classList.remove('d-none');
        }
    </script>
</body>
</html>
    `,
    css: `
/**
 * =========================================
 * MR SHAH MEN'S CLOTHING STORE
 * Custom CSS Stylesheet
 * File: css/style.css
 * =========================================
 */

/* ===== CSS VARIABLES (Color Theme) ===== */
:root {
    /* Primary Colors */
    --charcoal: #1f2937;           /* Dark charcoal - main brand color */
    --charcoal-light: #374151;     /* Lighter charcoal for hover states */
    --gold: #d4a745;               /* Gold accent color */
    --gold-light: #e5c577;         /* Light gold for hover */
    
    /* Neutral Colors */
    --cream: #f5f3f0;              /* Warm cream background */
    --white: #ffffff;
    --slate: #64748b;              /* Muted text color */
    --border-color: #e5e7eb;       /* Border color */
    
    /* Status Colors */
    --error: #dc2626;              /* Error red */
    --success: #16a34a;            /* Success green */
}

/* ===== BASE STYLES ===== */
body {
    font-family: 'Inter', sans-serif;
    background-color: var(--cream);
    color: var(--charcoal);
    line-height: 1.6;
}

/* ===== AUTHENTICATION PAGE STYLES ===== */
.auth-page {
    background: linear-gradient(135deg, var(--cream) 0%, #e8e4df 100%);
    min-height: 100vh;
}

/* Auth Card - The main container for forms */
.auth-card {
    background: var(--white);
    padding: 2.5rem;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    border: 1px solid var(--border-color);
}

/* ===== LOGO STYLES ===== */
.logo {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--charcoal);
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
}

/* Tagline with decorative lines */
.tagline {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 0.25rem;
}

.tagline .line {
    width: 2rem;
    height: 1px;
    background-color: var(--gold);
}

.tagline .text {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--slate);
}

/* ===== FORM TITLE STYLES ===== */
.auth-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--charcoal);
    margin-bottom: 0.25rem;
}

.auth-subtitle {
    color: var(--slate);
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
}

/* ===== FORM INPUT STYLES ===== */
.form-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--charcoal);
    margin-bottom: 0.5rem;
}

.form-control {
    height: 48px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    transition: all 0.2s ease;
}

.form-control:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(212, 167, 69, 0.15);
}

.form-control::placeholder {
    color: var(--slate);
    opacity: 0.7;
}

/* ===== BUTTON STYLES ===== */
.btn-primary {
    background-color: var(--gold);
    border-color: var(--gold);
    color: var(--charcoal);
    height: 48px;
    font-weight: 500;
    font-size: 0.875rem;
    letter-spacing: 0.05em;
    transition: all 0.2s ease;
}

.btn-primary:hover {
    background-color: var(--gold-light);
    border-color: var(--gold-light);
    color: var(--charcoal);
}

.btn-primary:focus {
    box-shadow: 0 0 0 3px rgba(212, 167, 69, 0.3);
}

/* ===== LINK STYLES ===== */
.auth-link {
    color: var(--gold);
    font-weight: 500;
    text-decoration: none;
}

.auth-link:hover {
    color: var(--gold-light);
    text-decoration: underline;
}

.forgot-link {
    color: var(--gold);
    font-size: 0.875rem;
    text-decoration: none;
}

.forgot-link:hover {
    text-decoration: underline;
}

/* ===== DIVIDER ===== */
.divider {
    display: flex;
    align-items: center;
    margin: 1.5rem 0;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: var(--border-color);
}

.divider span {
    padding: 0 1rem;
    color: var(--slate);
    font-size: 0.875rem;
}

/* ===== FOOTER TEXT ===== */
.auth-footer {
    color: var(--slate);
    font-size: 0.875rem;
    margin-top: 0;
}

/* ===== ALERT STYLES ===== */
.alert {
    font-size: 0.875rem;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
}

.alert-danger {
    background-color: rgba(220, 38, 38, 0.1);
    border-color: rgba(220, 38, 38, 0.2);
    color: var(--error);
}

.alert-success {
    background-color: rgba(22, 163, 74, 0.1);
    border-color: rgba(22, 163, 74, 0.2);
    color: var(--success);
}

/* ===== CHECKBOX STYLES ===== */
.form-check-input:checked {
    background-color: var(--gold);
    border-color: var(--gold);
}

.form-check-input:focus {
    box-shadow: 0 0 0 3px rgba(212, 167, 69, 0.15);
}

.form-check-label {
    font-size: 0.875rem;
    color: var(--slate);
}

/* ===== RESPONSIVE ADJUSTMENTS ===== */
@media (max-width: 576px) {
    .auth-card {
        padding: 1.5rem;
        margin: 1rem;
    }
    
    .logo {
        font-size: 2rem;
    }
}
    `,
    indexPhp: `
<?php
/**
 * =========================================
 * HOME PAGE (Protected Page Example)
 * File: index.php
 * =========================================
 * This page shows how to protect pages for logged-in users only.
 */

// Start session to access session variables
session_start();

// Check if user is logged in
// If not, redirect to login page
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header("Location: login.html");
    exit();
}

// Get user data from session
$user_name = $_SESSION['user_name'];
$user_email = $_SESSION['user_email'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome - Mr Shah Men's Clothing</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: var(--charcoal);">
        <div class="container">
            <a class="navbar-brand logo" href="index.php">MR SHAH</a>
            <div class="d-flex align-items-center">
                <span class="text-white me-3">Welcome, <?php echo htmlspecialchars($user_name); ?>!</span>
                <a href="php/logout.php" class="btn btn-outline-light btn-sm">Logout</a>
            </div>
        </div>
    </nav>
    
    <!-- Main Content -->
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-8 text-center">
                <h1 class="auth-title mb-4">Welcome to Mr Shah!</h1>
                <p class="auth-subtitle">
                    You are now logged in as <strong><?php echo htmlspecialchars($user_email); ?></strong>
                </p>
                
                <div class="alert alert-success mt-4">
                    <strong>Login Successful!</strong><br>
                    This is a protected page. Only logged-in users can see this.
                </div>
                
                <!-- Add your store content here -->
                <div class="mt-5">
                    <h3 class="mb-3">Shop Our Collections</h3>
                    <p class="text-muted">Start exploring our premium men's clothing collection.</p>
                </div>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
    `,
  };

  const tabs = [
    { id: "structure", label: "📁 Folder Structure" },
    { id: "database", label: "🗄️ Database SQL" },
    { id: "dbConnect", label: "🔌 db_connect.php" },
    { id: "signup", label: "📝 signup.php" },
    { id: "login", label: "🔐 login.php" },
    { id: "logout", label: "🚪 logout.php" },
    { id: "loginHtml", label: "📄 login.html" },
    { id: "signupHtml", label: "📄 signup.html" },
    { id: "css", label: "🎨 style.css" },
    { id: "indexPhp", label: "🏠 index.php" },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text.trim());
    alert("Code copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Logo size="sm" className="text-primary-foreground" />
            <div className="flex gap-4">
              <Link to="/login">
                <AuthButton variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  View Login
                </AuthButton>
              </Link>
              <Link to="/signup">
                <AuthButton variant="primary">
                  View Signup
                </AuthButton>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              PHP/MySQL Code Guide
            </h1>
            <p className="font-sans text-muted-foreground text-lg max-w-2xl mx-auto">
              Complete backend code for your Final Year Project. Copy each file and follow the setup instructions.
            </p>
          </div>

          {/* Setup Instructions Card */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8 animate-fade-in">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              📋 Setup Instructions
            </h2>
            <ol className="font-sans text-muted-foreground space-y-3 list-decimal list-inside">
              <li><strong>Install XAMPP</strong> - Download from <span className="text-accent">apachefriends.org</span></li>
              <li><strong>Start Apache and MySQL</strong> - Open XAMPP Control Panel and click "Start" for both</li>
              <li><strong>Create folder</strong> - Navigate to <code className="bg-muted px-2 py-1 rounded text-sm">C:\xampp\htdocs\mr_shah_store</code></li>
              <li><strong>Create the database</strong> - Open <span className="text-accent">localhost/phpmyadmin</span> and run the SQL code</li>
              <li><strong>Copy all files</strong> - Create each file from the tabs below</li>
              <li><strong>Test</strong> - Visit <span className="text-accent">localhost/mr_shah_store/login.html</span></li>
            </ol>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-4 border-b border-border pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-sm text-sm font-sans transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Code Display */}
          <div className="bg-primary rounded-lg overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-4 py-3 border-b border-charcoal-light">
              <span className="font-sans text-primary-foreground text-sm">
                {tabs.find((t) => t.id === activeTab)?.label}
              </span>
              <button
                onClick={() => copyToClipboard(codeSnippets[activeTab as keyof typeof codeSnippets])}
                className="px-3 py-1 bg-accent text-accent-foreground text-xs rounded hover:brightness-110 transition-all"
              >
                📋 Copy Code
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm">
              <code className="text-primary-foreground/90 font-mono whitespace-pre">
                {codeSnippets[activeTab as keyof typeof codeSnippets]}
              </code>
            </pre>
          </div>

          {/* Security Note */}
          <div className="mt-8 bg-accent/10 border border-accent/20 rounded-lg p-6">
            <h3 className="font-display text-xl font-bold text-foreground mb-3">
              🔒 Security Features Implemented
            </h3>
            <ul className="font-sans text-muted-foreground space-y-2">
              <li>✅ <strong>Password Hashing</strong> - Using password_hash() with bcrypt</li>
              <li>✅ <strong>SQL Injection Prevention</strong> - Prepared statements throughout</li>
              <li>✅ <strong>XSS Prevention</strong> - htmlspecialchars() for output</li>
              <li>✅ <strong>Session Security</strong> - session_regenerate_id() on login</li>
              <li>✅ <strong>Input Validation</strong> - Server-side and client-side validation</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PHPGuide;
