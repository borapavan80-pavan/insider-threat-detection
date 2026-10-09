import { useEffect, useState } from "react";
import "./App.css";

import Devices from "./Devices";
import Users from "./Users";
import Sessions from "./Sessions";
import Alerts from "./Alerts";
import Register from "./Register";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [page, setPage] = useState("dashboard");

  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [telemetry, setTelemetry] = useState([]);

  const [backendOnline, setBackendOnline] = useState(false);

  // ==============================
  // GET ARRAY FROM API RESPONSE
  // ==============================

  const getArray = (result) => {
    if (Array.isArray(result)) {
      return result;
    }

    if (result && Array.isArray(result.data)) {
      return result.data;
    }

    return [];
  };

  // ==============================
  // FETCH DEVICES
  // ==============================

  const fetchDevices = async () => {
    try {
      const response = await fetch(`${API_URL}/devices/`);

      if (!response.ok) {
        throw new Error("Devices API error");
      }

      const result = await response.json();

      setDevices(getArray(result));

      setBackendOnline(true);
    } catch (error) {
      console.error("Devices error:", error);
      setBackendOnline(false);
    }
  };

  // ==============================
  // FETCH USERS
  // ==============================

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users/`);

      if (!response.ok) {
        throw new Error("Users API error");
      }

      const result = await response.json();

      setUsers(getArray(result));
    } catch (error) {
      console.error("Users error:", error);
    }
  };

  // ==============================
  // FETCH SESSIONS
  // ==============================

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API_URL}/sessions/`);

      if (!response.ok) {
        throw new Error("Sessions API error");
      }

      const result = await response.json();

      setSessions(getArray(result));
    } catch (error) {
      console.error("Sessions error:", error);
    }
  };

  // ==============================
  // FETCH ALERTS
  // ==============================

  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${API_URL}/alerts/`);

      if (!response.ok) {
        throw new Error("Alerts API error");
      }

      const result = await response.json();

      setAlerts(getArray(result));
    } catch (error) {
      console.error("Alerts error:", error);
    }
  };

  // ==============================
  // FETCH TELEMETRY
  // ==============================

  const fetchTelemetry = async () => {
    try {
      const response = await fetch(`${API_URL}/telemetry/`);

      if (!response.ok) {
        throw new Error("Telemetry API error");
      }

      const result = await response.json();

      setTelemetry(getArray(result));
    } catch (error) {
      console.error("Telemetry error:", error);
    }
  };

  // ==============================
  // REFRESH EVERYTHING
  // ==============================

  const refreshAll = () => {
    fetchDevices();
    fetchUsers();
    fetchSessions();
    fetchAlerts();
    fetchTelemetry();
  };

  // ==============================
  // INITIAL LOAD + LIVE REFRESH
  // ==============================

  useEffect(() => {
    refreshAll();

    const interval = setInterval(() => {
      fetchDevices();
      fetchTelemetry();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ==============================
  // DASHBOARD
  // ==============================

  const Dashboard = () => {
    return (
      <div>

        {/* HEADER */}

        <div className="header">

          <div>
            <h1>Security Dashboard</h1>

            <p>
              AI-Powered Insider Threat Detection
            </p>
          </div>

          <button
            onClick={refreshAll}
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
            🔄 Refresh
          </button>

        </div>


        {/* DASHBOARD CARDS */}

        <section className="cards">

          <div className="card">
            <p>Registered Users</p>

            <h2>
              {users.length}
            </h2>

            <span>
              Authorized users
            </span>
          </div>


          <div className="card">
            <p>Registered Devices</p>

            <h2>
              {devices.length}
            </h2>

            <span>
              Authorized devices
            </span>
          </div>


          <div className="card">
            <p>Active Sessions</p>

            <h2>
              {
                sessions.filter(
                  (session) =>
                    session.is_active === true
                ).length
              }
            </h2>

            <span>
              Currently active
            </span>
          </div>


          <div className="card">
            <p>High Risk Alerts</p>

            <h2>
              {
                alerts.filter(
                  (alert) =>
                    alert.risk_level === "High" ||
                    alert.risk_level === "Critical"
                ).length
              }
            </h2>

            <span>
              Requires attention
            </span>
          </div>


          <div className="card">

            <p>Backend Status</p>

            <h2
              className={
                backendOnline
                  ? "healthy"
                  : ""
              }
            >
              {backendOnline
                ? "Online"
                : "Offline"}
            </h2>

            <span>
              FastAPI server
            </span>

          </div>

        </section>


        {/* LIVE DEVICE MONITORING */}

        <section className="panel">

          <div className="panel-header">

            <div>

              <h2>
                Live Device Monitoring
              </h2>

              <p>
                Current status of registered laptops
              </p>

            </div>

            <span className="status">
              <span
                style={{
                  color: "#16a34a"
                }}
              >
                ● Live
              </span>
            </span>

          </div>


          {devices.length === 0 ? (

            <div className="empty">

              <div>💻</div>

              <h3>
                No registered devices
              </h3>

              <p>
                Register a device to start monitoring.
              </p>

            </div>

          ) : (

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "16px"
              }}
            >

              {devices.map((device) => {

                const deviceTelemetry =
                  telemetry.find(
                    (item) =>
                      item.device_id ===
                      device.device_id
                  );


                // ==============================
                // DEVICE ONLINE / OFFLINE
                // ==============================

                const deviceStatus =
                  deviceTelemetry?.device_status ||
                  "Offline";


                // ==============================
                // USER ACTIVITY
                // ==============================

                const activityState =
                  deviceTelemetry?.activity_state ||
                  "No Activity Data";


                const statusColor =
                  deviceStatus === "Connected"
                    ? "#16a34a"
                    : "#dc2626";


                const activityColor =
                  activityState === "Active"
                    ? "#16a34a"
                    : activityState === "Idle"
                    ? "#ca8a04"
                    : activityState === "Away"
                    ? "#ea580c"
                    : "#64748b";


                return (

                  <div
                    key={device.device_id}
                    style={{
                      padding: "20px",
                      borderRadius: "12px",
                      border:
                        "1px solid #e2e8f0",
                      background: "#ffffff"
                    }}
                  >

                    {/* DEVICE HEADER */}

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        marginBottom:
                          "16px"
                      }}
                    >

                      <div>

                        <h3
                          style={{
                            margin: 0
                          }}
                        >
                          💻{" "}
                          {device.device_name}
                        </h3>

                        <p
                          style={{
                            margin:
                              "5px 0 0",
                            color:
                              "#64748b"
                          }}
                        >
                          {device.device_id}
                        </p>

                      </div>


                      <span
                        style={{
                          color:
                            statusColor,
                          fontWeight:
                            "600"
                        }}
                      >
                        ●{" "}
                        {deviceStatus}
                      </span>

                    </div>


                    {/* OWNER */}

                    <div
                      style={{
                        marginBottom:
                          "12px"
                      }}
                    >

                      <strong>
                        Owner:
                      </strong>{" "}

                      {device.user_id}

                    </div>


                    {/* USER ACTIVITY */}

                    <div
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        background:
                          "#f8fafc",
                        marginBottom:
                          "12px"
                      }}
                    >

                      <strong>
                        User Activity
                      </strong>

                      <div
                        style={{
                          marginTop:
                            "5px",
                          color:
                            activityColor,
                          fontWeight:
                            "600"
                        }}
                      >
                        ●{" "}
                        {activityState}
                      </div>

                    </div>


                    {/* TELEMETRY */}

                    {deviceTelemetry ? (

                      <div>

                        <div
                          style={{
                            display:
                              "grid",
                            gridTemplateColumns:
                              "1fr 1fr",
                            gap: "10px"
                          }}
                        >

                          <div>
                            <small>
                              Typing Speed
                            </small>

                            <strong
                              style={{
                                display:
                                  "block"
                              }}
                            >
                              {
                                deviceTelemetry.typing_speed
                              }{" "}
                              keys/sec
                            </strong>
                          </div>


                          <div>
                            <small>
                              Mouse Speed
                            </small>

                            <strong
                              style={{
                                display:
                                  "block"
                              }}
                            >
                              {
                                deviceTelemetry.mouse_speed
                              }{" "}
                              px/sec
                            </strong>
                          </div>


                          <div>
                            <small>
                              Mouse Movements
                            </small>

                            <strong
                              style={{
                                display:
                                  "block"
                              }}
                            >
                              {
                                deviceTelemetry.mouse_movements
                              }
                            </strong>
                          </div>


                          <div>
                            <small>
                              Idle Time
                            </small>

                            <strong
                              style={{
                                display:
                                  "block"
                              }}
                            >
                              {
                                deviceTelemetry.idle_time
                              }{" "}
                              sec
                            </strong>
                          </div>

                        </div>


                        {/* LAST SEEN */}

                        <div
                          style={{
                            marginTop:
                              "14px",
                            paddingTop:
                              "12px",
                            borderTop:
                              "1px solid #e2e8f0"
                          }}
                        >

                          <small>
                            Last Seen
                          </small>

                          <strong
                            style={{
                              display:
                                "block"
                            }}
                          >

                            {deviceTelemetry.last_seen
                              ? new Date(
                                  deviceTelemetry.last_seen
                                ).toLocaleTimeString()
                              : "Unknown"}

                          </strong>

                        </div>

                      </div>

                    ) : (

                      <div
                        style={{
                          color:
                            "#64748b",
                          padding:
                            "10px 0"
                        }}
                      >
                        Waiting for telemetry...
                      </div>

                    )}

                  </div>

                );
              })}

            </div>

          )}

        </section>


        {/* RECENT ALERTS */}

        <section className="panel">

          <div className="panel-header">

            <div>

              <h2>
                Recent Alerts
              </h2>

              <p>
                Latest security events
              </p>

            </div>

          </div>


          {alerts.length === 0 ? (

            <div className="empty">

              <div>🛡️</div>

              <h3>
                No security alerts
              </h3>

              <p>
                No suspicious activity detected.
              </p>

            </div>

          ) : (

            <div>

              {alerts
                .slice(0, 5)
                .map((alert) => (

                  <div
                    key={
                      alert.id ||
                      alert.alert_id
                    }
                    style={{
                      padding: "12px",
                      marginBottom:
                        "10px",
                      borderRadius:
                        "8px",
                      background:
                        "#f8fafc"
                    }}
                  >

                    <strong>
                      🚨{" "}
                      {alert.alert_type}
                    </strong>

                    <p>
                      {alert.message}
                    </p>

                    <span>
                      Risk:{" "}
                      {alert.risk_level}{" "}
                      (
                      {alert.risk_score}
                      )
                    </span>

                  </div>

                ))}

            </div>

          )}

        </section>

      </div>
    );
  };


  // ==============================
  // MAIN PAGE SWITCH
  // ==============================

  return (

    <div className="app">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="logo">

          <span
            style={{
              fontSize: "25px"
            }}
          >
            🛡️
          </span>

          <span>
            ThreatGuard
          </span>

        </div>


        <nav>

          <button
            className={
              page === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setPage("dashboard")
            }
          >
            📊 Dashboard
          </button>


          <button
            className={
              page === "devices"
                ? "active"
                : ""
            }
            onClick={() =>
              setPage("devices")
            }
          >
            💻 Devices
          </button>


          <button
            className={
              page === "users"
                ? "active"
                : ""
            }
            onClick={() =>
              setPage("users")
            }
          >
            👤 Users
          </button>


          <button
            className={
              page === "sessions"
                ? "active"
                : ""
            }
            onClick={() =>
              setPage("sessions")
            }
          >
            🔐 Sessions
          </button>


          <button
            className={
              page === "alerts"
                ? "active"
                : ""
            }
            onClick={() =>
              setPage("alerts")
            }
          >
            🚨 Alerts
          </button>


          <button
            className={
              page === "register"
                ? "active"
                : ""
            }
            onClick={() =>
              setPage("register")
            }
          >
            📝 Register
          </button>


        </nav>


        {/* SYSTEM STATUS */}

        <div
          style={{
            marginTop: "auto",
            padding: "20px"
          }}
        >

          <p>
            System Status
          </p>

          <span
            style={{
              color: "#16a34a",
              fontWeight: "600"
            }}
          >
            ● Online
          </span>

        </div>

      </aside>


      {/* MAIN */}

      <main className="main">

        {page === "dashboard" && (
          <Dashboard />
        )}

        {page === "devices" && (
          <Devices />
        )}

        {page === "users" && (
          <Users />
        )}

        {page === "sessions" && (
          <Sessions />
        )}

        {page === "alerts" && (
          <Alerts />
        )}

        {page === "register" && (
          <Register
            onRegistered={() => {
              refreshAll();
              setPage("dashboard");
            }}
          />
        )}

      </main>

    </div>
  );
}

export default App;