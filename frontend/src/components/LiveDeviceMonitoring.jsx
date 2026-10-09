import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function LiveDeviceMonitoring() {
  const [devices, setDevices] = useState([]);
  const [telemetry, setTelemetry] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get registered devices
  const fetchDevices = async () => {
    try {
      const response = await fetch(`${API_URL}/devices/`);

      if (!response.ok) {
        throw new Error("Failed to fetch devices");
      }

      const result = await response.json();

      if (Array.isArray(result)) {
        setDevices(result);
      } else if (Array.isArray(result.data)) {
        setDevices(result.data);
      } else {
        setDevices([]);
      }
    } catch (error) {
      console.error("Device error:", error);
      setDevices([]);
    }
  };

  // Get telemetry
  const fetchTelemetry = async () => {
    try {
      const response = await fetch(`${API_URL}/telemetry/`);

      if (!response.ok) {
        throw new Error("Failed to fetch telemetry");
      }

      const result = await response.json();

      if (Array.isArray(result)) {
        setTelemetry(result);
      } else if (Array.isArray(result.data)) {
        setTelemetry(result.data);
      } else {
        setTelemetry([]);
      }
    } catch (error) {
      console.error("Telemetry error:", error);
      setTelemetry([]);
    }
  };

  // Load data
  const loadData = async () => {
    setLoading(true);

    await Promise.all([
      fetchDevices(),
      fetchTelemetry()
    ]);

    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // Refresh every 5 seconds
    const interval = setInterval(() => {
      fetchDevices();
      fetchTelemetry();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Check whether device is online
  const isDeviceOnline = (device) => {
    const deviceTelemetry = telemetry.find(
      (item) =>
        item.device_id === device.device_id
    );

    if (!deviceTelemetry) {
      return false;
    }

    return true;
  };

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h1>Live Device Monitoring</h1>
        <p>Loading devices...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px"
        }}
      >
        <div>
          <h1>Live Device Monitoring</h1>

          <p style={{ color: "#64748b" }}>
            Current status of registered laptops
          </p>
        </div>

        <div
          style={{
            color: "#16a34a",
            fontWeight: "600"
          }}
        >
          🟢 Live
        </div>
      </div>

      {/* No devices */}
      {devices.length === 0 && (
        <div
          style={{
            padding: "30px",
            textAlign: "center",
            background: "#f8fafc",
            borderRadius: "12px"
          }}
        >
          <h3>No devices registered</h3>

          <p>
            Register a device to start monitoring.
          </p>
        </div>
      )}

      {/* Devices */}
      {devices.map((device) => {

        const online = isDeviceOnline(device);

        return (
          <div
            key={device.device_id}
            style={{
              border: "1px solid #dbe3ef",
              borderRadius: "16px",
              padding: "25px",
              marginBottom: "25px",
              background: "white"
            }}
          >

            {/* Device header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >

              <div>

                <h2
                  style={{
                    margin: 0
                  }}
                >
                  💻 {device.device_name}
                </h2>

                <p
                  style={{
                    margin: "8px 0",
                    color: "#64748b",
                    fontSize: "18px"
                  }}
                >
                  {device.device_id}
                </p>

              </div>

              {/* ONLINE / OFFLINE */}
              <div
                style={{
                  color: online
                    ? "#16a34a"
                    : "#dc2626",
                  fontWeight: "600",
                  fontSize: "20px"
                }}
              >
                {online ? "🟢 Online" : "🔴 Offline"}
              </div>

            </div>

            {/* Owner */}
            <div
              style={{
                marginTop: "25px",
                fontSize: "18px"
              }}
            >
              <strong>Owner:</strong>{" "}
              {device.user_id}
            </div>

            {/* Activity */}
            <div
              style={{
                marginTop: "25px",
                padding: "20px",
                background: "#f8fafc",
                borderRadius: "12px",
                textAlign: "center"
              }}
            >

              <h3>
                User Activity
              </h3>

              {online ? (
                <p
                  style={{
                    color: "#16a34a",
                    fontWeight: "600",
                    fontSize: "18px"
                  }}
                >
                  🟢 Activity detected
                </p>
              ) : (
                <p
                  style={{
                    color: "#64748b",
                    fontWeight: "600",
                    fontSize: "18px"
                  }}
                >
                  🔴 No Activity Data
                </p>
              )}

            </div>

            {/* Status message */}
            <div
              style={{
                marginTop: "25px",
                textAlign: "center",
                color: "#64748b",
                fontSize: "18px"
              }}
            >
              {online
                ? "Device is currently active."
                : "Waiting for telemetry..."}
            </div>

          </div>
        );
      })}

    </div>
  );
}

export default LiveDeviceMonitoring;