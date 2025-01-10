import { useState } from "react";

const Login = () => {
  const [darkMode, setDarkMode] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const { username, password } = e.target.elements;
    if (username.value === "admin" && password.value === "admin123") {
      alert("Login successful!");
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input type="text" name="username" placeholder="Username" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <button onClick={() => setDarkMode(!darkMode)}>
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </button>
      </div>
      <style jsx>{`
        .login-container {
          padding: 20px;
          max-width: 400px;
          margin: auto;
          text-align: center;
        }
        .dark {
          background: #333;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Login;
