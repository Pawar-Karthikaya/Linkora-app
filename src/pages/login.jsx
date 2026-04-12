import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api"; // ✅ correct

function Login() {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const navigate = useNavigate(); // ✅ initialize

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await API.post("users/login/", {   // ✅ fixed URL (from bug #17)
            email: form.email,
            password: form.password,
        });

        localStorage.setItem("access", res.data.access);    // ✅ matches backend key
        localStorage.setItem("refresh", res.data.refresh);  // ✅ save refresh token too
        localStorage.setItem("user", JSON.stringify(res.data.user)); // ✅ save user info for avatar/name

        navigate("/home");
    } catch (err) {
        console.log(err.response?.data);
        alert("Login failed. Check your credentials.");
    }
};


  const inputStyle = {
    width: "100%", padding: "11px 14px", border: "1.5px solid #d0d0d0",
    borderRadius: 8, fontSize: 14, fontFamily: "Inter, sans-serif",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      {/* ✅ added minHeight: "100vh" */}
      <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: "#fff", border: "2px solid #222", borderRadius: 16, overflow: "hidden", width: "100%", maxWidth: 900, boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>

          {/* Topbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: "1.5px solid #e5e5e5" }}>
            <span style={{ fontSize: 17, fontWeight: 700 }}>Taskly</span>
            <span style={{ fontSize: 13, color: "#444" }}>🌐 English ∨</span>
          </div>

          {/* Body */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 460 }}>

            {/* Left */}
            <div style={{ background: "#eef0ff", padding: "40px 36px", display: "flex", flexDirection: "column" }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.25, color: "#111", marginBottom: 24 }}>
                Stay Organized,<br />Achieve More<br />With Taskly.
              </h1>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src="/illustration.svg" alt="illustration" style={{ maxHeight: 220 }} />
              </div>
            </div>

            {/* ✅ Right panel is now a <form> so onSubmit + e.preventDefault() works */}
            <form onSubmit={handleSubmit} style={{ padding: "40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {/* Tabs */}
              <div style={{ display: "flex", border: "2px solid #111", borderRadius: 8, overflow: "hidden", width: "fit-content", marginBottom: 24 }}>
                <button type="button" style={{ padding: "10px 28px", fontWeight: 600, fontSize: 14, background: "#111", color: "#fff", border: "none", cursor: "pointer" }}>Login</button>
                <Link to="/register" style={{ padding: "10px 28px", fontWeight: 600, fontSize: 14, background: "#fff", color: "#111", textDecoration: "none", display: "flex", alignItems: "center" }}>Register</Link>
              </div>

              <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Let's login to your account.</p>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Email</label>
                <input
                  type="email" placeholder="Example@gmail.com" required
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Password</label>
                <input
                  type="password" placeholder="Enter your password" required
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#444", marginBottom: 20, cursor: "pointer" }}>
                <input type="checkbox" onChange={(e) => setForm({ ...form, remember: e.target.checked })} style={{ accentColor: "#7c6ff7" }} />
                Remember me
              </label>

              {/* ✅ type="submit" triggers form onSubmit */}
              <button type="submit"
                style={{ width: "100%", padding: 13, background: "#7c6ff7", border: "none", borderRadius: 8, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 16 }}>
                Login
              </button>

              <p style={{ fontSize: 13, color: "#666" }}>
                Don't have an account?
                <Link to="/register" style={{ color: "#111", fontWeight: 700, marginLeft: 4, textDecoration: "none" }}>Register</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;