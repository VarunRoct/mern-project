import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      alert(data.message);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

    } catch (error) {
      alert("Login failed ❌");
    }
  };

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/auth/dashboard", {
        headers: {
          "Authorization": token
        }
      });

      const data = await res.json();
      setMessage(data.message);

    } catch (error) {
      setMessage("Access denied ❌");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Authentication System</h1>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>

      <br /><br />

      <button onClick={loadDashboard}>
        Load Dashboard
      </button>

<button onClick={() => {
  localStorage.removeItem("token");
  setMessage("Logged out ✅");
}}>
  Logout
</button>
      <p>{message}</p>
    </div>
  );
}

export default App;