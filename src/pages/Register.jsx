import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function scorePassword(p) {
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p) && /[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

const STRENGTH_COLORS = ["#e24b4a", "#ef9f27", "#7c6ff7", "#1d9e75"];

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone_number: "",
    country_code: "",   // will hold the selected country id
    password: "",
  });
  const [countryCodes, setCountryCodes] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loading, setLoading] = useState(false);

  // ── Fetch country codes on mount ──────────────────────────────────────────
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await API.get("users/countrycode/");
        setCountryCodes(res.data);
        // Default to India (id=2) if present, else first entry
        const india = res.data.find((c) => c.country_name === "India");
        setForm((prev) => ({ ...prev, country_code: india ? india.id : res.data[0]?.id ?? "" }));
      } catch (err) {
        console.error("Failed to fetch country codes:", err);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  const pwdScore = scorePassword(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // country_code now carries the id (integer) from the API
      const payload = { ...form, country_code: parseInt(form.country_code) };
      const res = await API.post("users/users/", payload);
      console.log(res.data);
      navigate("/");
    } catch (err) {
      console.log(err.response?.data);
      alert("Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  // ─── Shared styles ─────────────────────────────────────────────────────────
  const inputStyle = {
    width: "100%",
    padding: "10px 13px",
    border: "1.5px solid #d0d0d0",
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    color: "#111",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  };

  const labelStyle = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#444",
    marginBottom: 5,
    letterSpacing: "0.3px",
    textTransform: "uppercase",
  };

  const fieldStyle = { display: "flex", flexDirection: "column" };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          minHeight: "100vh",
          background: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "2px solid #1a1a1a",
            borderRadius: 18,
            overflow: "hidden",
            width: "100%",
            maxWidth: 960,
            boxShadow: "6px 6px 0px #1a1a1a",
            display: "grid",
            gridTemplateColumns: "1fr 1.35fr",
          }}
        >
          {/* ── LEFT PANEL ───────────────────────────────────────────────── */}
          <div
            style={{
              background: "#eef0ff",
              padding: "44px 38px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px", color: "#111", marginBottom: 32 }}>
              Taskly
            </div>

            <h1 style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.2, color: "#111", marginBottom: 28 }}>
              Join Taskly &<br />Start Achieving<br />
              <span style={{ color: "#7c6ff7" }}>Your Goals.</span>
            </h1>

            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 0" }}>
              <svg width="180" height="160" viewBox="0 0 180 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="20" width="160" height="120" rx="12" fill="#dde0fc" stroke="#b0b6f8" strokeWidth="1.5" />
                <rect x="24" y="40" width="70" height="8" rx="4" fill="#b0b6f8" />
                <rect x="24" y="55" width="100" height="6" rx="3" fill="#c8cbfb" />
                <rect x="24" y="67" width="80" height="6" rx="3" fill="#c8cbfb" />
                <rect x="24" y="86" width="48" height="14" rx="6" fill="#7c6ff7" />
                <circle cx="148" cy="30" r="14" fill="#7c6ff7" />
                <path d="M142 30l4 4 7-8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="24" y="110" width="30" height="6" rx="3" fill="#b0b6f8" />
                <rect x="62" y="110" width="30" height="6" rx="3" fill="#b0b6f8" />
                <rect x="100" y="110" width="30" height="6" rx="3" fill="#c8cbfb" />
              </svg>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "Track tasks & deadlines effortlessly",
                "Collaborate with your team in real time",
                "Free forever. No credit card required.",
              ].map((text) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#444", fontWeight: 500 }}>
                  <div
                    style={{
                      width: 28, height: 28, borderRadius: "50%", background: "#7c6ff7",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="2,7 6,11 12,3" />
                    </svg>
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT PANEL ──────────────────────────────────────────────── */}
          <form
            onSubmit={handleSubmit}
            style={{ padding: "36px 42px", display: "flex", flexDirection: "column", justifyContent: "center" }}
          >
            <div
              style={{
                display: "flex", border: "2px solid #111", borderRadius: 8,
                overflow: "hidden", width: "fit-content", marginBottom: 24,
              }}
            >
              <Link
                to="/"
                style={{
                  padding: "9px 28px", fontWeight: 700, fontSize: 13,
                  background: "#fff", color: "#111", textDecoration: "none",
                  display: "flex", alignItems: "center",
                }}
              >
                Login
              </Link>
              <button
                type="button"
                style={{
                  padding: "9px 28px", fontWeight: 700, fontSize: 13,
                  background: "#111", color: "#fff", border: "none", cursor: "default",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Register
              </button>
            </div>

            <p style={{ fontSize: 19, fontWeight: 700, color: "#111", marginBottom: 20 }}>
              Create your account.
            </p>

            {/* Row 1: First + Last name */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>First Name</label>
                <input type="text" placeholder="John" required style={inputStyle} onChange={set("first_name")} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Last Name</label>
                <input type="text" placeholder="Doe" required style={inputStyle} onChange={set("last_name")} />
              </div>
            </div>

            {/* Row 2: Username + Email */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Username</label>
                <input type="text" placeholder="johndoe123" required style={inputStyle} onChange={set("username")} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Email</label>
                <input type="email" placeholder="john@example.com" required style={inputStyle} onChange={set("email")} />
              </div>
            </div>

            {/* Row 3: Phone with country code (API-driven) */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Phone Number</label>
              <div
                style={{
                  display: "flex", border: "1.5px solid #d0d0d0",
                  borderRadius: 8, overflow: "hidden",
                }}
              >
                <select
                  value={form.country_code}
                  onChange={set("country_code")}
                  disabled={loadingCountries}
                  style={{
                    border: "none", outline: "none", background: "#f5f5f5",
                    padding: "10px 10px", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                    color: "#333", borderRight: "1.5px solid #e0e0e0",
                    cursor: loadingCountries ? "not-allowed" : "pointer", minWidth: 110,
                  }}
                >
                  {loadingCountries ? (
                    <option>Loading…</option>
                  ) : (
                    countryCodes.map(({ id, code, country_name, country_flag }) => (
                      <option key={id} value={id}>
                        {country_flag
                          ? ""           // flag image can't render inside <option>
                          : ""}
                        {country_name} {code}
                      </option>
                    ))
                  )}
                </select>
                {/* Flag preview for selected country */}
                {!loadingCountries && form.country_code && (() => {
                  const selected = countryCodes.find((c) => c.id === parseInt(form.country_code));
                  return selected?.country_flag ? (
                    <img
                      src={selected.country_flag}
                      alt={selected.country_name}
                      style={{
                        width: 28, height: 20, objectFit: "cover",
                        alignSelf: "center", marginLeft: -6, marginRight: 4,
                        borderRadius: 3, border: "1px solid #e0e0e0",
                        pointerEvents: "none",
                      }}
                    />
                  ) : null;
                })()}
                <input
                  type="text"
                  placeholder="9876543210"
                  maxLength={15}
                  required
                  onChange={set("phone_number")}
                  style={{
                    border: "none", outline: "none", padding: "10px 13px",
                    fontSize: 14, fontFamily: "'DM Mono', monospace", flex: 1, color: "#111",
                  }}
                />
              </div>
            </div>

            {/* Row 4: Password + strength bar */}
            <div style={{ marginBottom: 6 }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder="Min 8 chars, include symbol"
                required
                style={inputStyle}
                onChange={set("password")}
              />
              <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: 3, flex: 1, borderRadius: 2,
                      background: i < pwdScore ? STRENGTH_COLORS[pwdScore - 1] : "#e0e0e0",
                      transition: "background 0.3s",
                    }}
                  />
                ))}
              </div>
            </div>

            <p style={{ fontSize: 12, color: "#999", marginBottom: 16, lineHeight: 1.55 }}>
              By registering, you agree to our{" "}
              <a href="#" style={{ color: "#7c6ff7", textDecoration: "none", fontWeight: 600 }}>Terms of Service</a>{" "}
              and{" "}
              <a href="#" style={{ color: "#7c6ff7", textDecoration: "none", fontWeight: 600 }}>Privacy Policy</a>.
            </p>

            <button
              type="submit"
              disabled={loading || loadingCountries}
              style={{
                width: "100%", padding: 13,
                background: loading || loadingCountries ? "#999" : "#111",
                border: "none", borderRadius: 8, color: "#fff",
                fontSize: 15, fontWeight: 700,
                cursor: loading || loadingCountries ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.2px",
                transition: "background 0.15s",
              }}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>

            <p style={{ fontSize: 13, color: "#666", marginTop: 12 }}>
              Already have an account?{" "}
              <Link to="/" style={{ color: "#111", fontWeight: 700, textDecoration: "none" }}>
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
