import { useEffect, useState } from "react";

function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDevices = () => {
    setLoading(true);
    setError("");

    fetch("http://127.0.0.1:8000/devices/")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        console.log("Devices API response:", data);

        // Backend response:
        // {
        //   success: true,
        //   data: [...]
        // }

        if (Array.isArray(data)) {
          setDevices(data);
        } else if (Array.isArray(data.data)) {
          setDevices(data.data);
        } else {
          setDevices([]);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching devices:", error);
        setError("Unable to load devices.");
        setDevices([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <div>

      {/* Page Header */}
      <div className="header">
        <div>
          <h1>Devices</h1>
          <p>Registered and authorized devices</p>
        </div>

        <button
          onClick={fetchDevices}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          🔄 IBM
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "12px",
            marginBottom: "20px",
            color: "#dc2626"
          }}
        >
          {error}
        </div>
      )}

      {/* Device Summary */}
      <section className="cards">

        <div className="card">
          <p>Total Devices</p>
          <h2>{devices.length}</h2>
          <span>Registered devices</span>
        </div>

        <div className="card">
          <p>Authorized</p>
          <h2>
            {
              devices.filter(
                (device) => device.is_authorized
              ).length
            }
          </h2>
          <span>Trusted devices</span>
        </div>

        <div className="card">
          <p>Pending</p>
          <h2>
            {
              devices.filter(
                (device) => !device.is_authorized
              ).length
            }
          </h2>
          <span>Awaiting authorization</span>
        </div>

        <div className="card">
          <p>System</p>
          <h2 className="healthy">Online</h2>
          <span>Device monitoring active</span>
        </div>

      </section>

      {/* Device List */}
      <section className="panel">

        <div className="panel-header">
          <div>
            <h2>Registered Devices</h2>
            <p>Devices connected to the security system</p>
          </div>
        </div>

        {loading ? (
          <div className="empty">
            <h3>Loading devices...</h3>
          </div>
        ) : devices.length === 0 ? (
          <div className="empty">
            <div>💻</div>

            <h3>No devices registered</h3>

            <p>
              Register a device through the API to see it here.
            </p>
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
              marginTop: "20px"
            }}
          >

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse"
              }}
            >

              <thead>
                <tr style={{ textAlign: "left" }}>

                  <th style={{ padding: "14px" }}>
                    Device
                  </th>

                  <th style={{ padding: "14px" }}>
                    Device ID
                  </th>

                  <th style={{ padding: "14px" }}>
                    User ID
                  </th>

                  <th style={{ padding: "14px" }}>
                    IP Address
                  </th>

                  <th style={{ padding: "14px" }}>
                    Status
                  </th>

                  <th style={{ padding: "14px" }}>
                    Trust
                  </th>

                </tr>
              </thead>

              <tbody>

                {devices.map((device) => (
                  <tr
                    key={device.device_id}
                  >

                    <td style={{ padding: "14px" }}>
                      💻 {device.device_name}
                    </td>

                    <td style={{ padding: "14px" }}>
                      {device.device_id}
                    </td>

                    <td style={{ padding: "14px" }}>
                      {device.user_id}
                    </td>

                    <td style={{ padding: "14px" }}>
                      {device.ip_address}
                    </td>

                    <td style={{ padding: "14px" }}>

                      <span
                        style={{
                          color: device.is_authorized
                            ? "#16a34a"
                            : "#d97706",
                          fontWeight: "600"
                        }}
                      >
                        ●{" "}
                        {device.is_authorized
                          ? "Authorized"
                          : "Pending"}
                      </span>

                    </td>

                    <td style={{ padding: "14px" }}>
                      {device.trust_status}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>

    </div>
  );
}

export default Devices;
