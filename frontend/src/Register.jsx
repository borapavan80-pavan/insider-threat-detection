import { useState } from "react";

function Register({ onRegistered }) {
  const [form, setForm] = useState({
    user_id: "",
    name: "",
    email: "",
    device_id: ""
  });

  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Send OTP
  const sendOTP = async () => {
    if (!form.email) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/users/send-otp?email=${encodeURIComponent(
          form.email
        )}`,
        {
          method: "POST"
        }
      );

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setMessage("OTP sent successfully.");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Unable to connect to backend.");
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    try {
      // Verify OTP
      const response = await fetch(
        `http://127.0.0.1:8000/users/verify-otp?email=${encodeURIComponent(
          form.email
        )}&otp=${encodeURIComponent(otp)}`,
        {
          method: "POST"
        }
      );

      const data = await response.json();

      if (data.success) {
        // Email verified
        setEmailVerified(true);
        setMessage("Email verified successfully!");

        // Register user
        const registerResponse = await fetch(
          `http://127.0.0.1:8000/users/register?user_id=${encodeURIComponent(
            form.user_id
          )}&name=${encodeURIComponent(
            form.name
          )}&email=${encodeURIComponent(
            form.email
          )}&device_id=${encodeURIComponent(
            form.device_id
          )}`,
          {
            method: "POST"
          }
        );

        const registerData = await registerResponse.json();

        if (registerResponse.ok) {
          setMessage("Registration completed successfully!");

          // Open dashboard
          setTimeout(() => {
            onRegistered();
          }, 1000);
        } else {
          setMessage(
            registerData.detail || "User registration failed."
          );
        }
      } else {
        setEmailVerified(false);
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Unable to connect to backend.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto" }}>

      <h1>User Registration</h1>

      <p>Register your authorized device</p>

      <input
        type="text"
        name="user_id"
        placeholder="User ID"
        value={form.user_id}
        onChange={handleChange}
      />

      <br />
      <br />

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
      />

      <br />
      <br />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={form.email}
        onChange={handleChange}
      />

      <br />
      <br />

      <input
        type="text"
        name="device_id"
        placeholder="Device ID"
        value={form.device_id}
        onChange={handleChange}
      />

      <br />
      <br />

      <button onClick={sendOTP}>
        Send OTP
      </button>

      {otpSent && !emailVerified && (
        <div style={{ marginTop: "20px" }}>

          <h3>Enter OTP</h3>

          <p>
            OTP sent to: <strong>{form.email}</strong>
          </p>

          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <br />
          <br />

          <button onClick={verifyOTP}>
            Verify OTP
          </button>

        </div>
      )}

      {emailVerified && (
        <div style={{ marginTop: "20px" }}>
          <h3>✅ Email Verified</h3>

          <p>
            Verified Email:
            <strong> {form.email}</strong>
          </p>
        </div>
      )}

      {message && (
        <p style={{ marginTop: "20px" }}>
          {message}
        </p>
      )}

    </div>
  );
}

export default Register;