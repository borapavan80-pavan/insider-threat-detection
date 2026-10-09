import { useEffect, useState } from "react";

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = () => {
    setLoading(true);

    fetch("http://127.0.0.1:8000/sessions/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }

        return response.json();
      })
      .then((data) => {
        setSessions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
        setSessions([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div>

      {/* Page Header */}
      <div className="header">
        <div>
          <h1>Sessions</h1>
          <p>Monitor active and previous user sessions</p>
        </div>

        <button
          onClick={fetchSessions}
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

      {/* Session Summary */}
      <section className="cards">

        <div className="card">
          <p>Total Sessions</p>
          <h2>{sessions.length}</h2>
          <span>Recorded sessions</span>
        </div>

        <div className="card">
          <p>Active Sessions</p>
          <h2>
            {sessions.filter(
              (session) => session.is_active
            ).length}
          </h2>
          <span>Currently active</span>
        </div>

        <div className="card">
          <p>High Risk</p>
          <h2>
            {
              sessions.filter(
                (session) =>
                  session.risk_level === "High" ||
                  session.risk_level === "Critical"
              ).length
            }
          </h2>
          <span>Requires attention</span>
        </div>

        <div className="card">
          <p>System</p>
          <h2 className="healthy">Online</h2>
          <span>Session monitoring active</span>
        </div>

      </section>

      {/* Sessions Table */}
      <section className="panel">

        <div className="panel-header">
          <div>
            <h2>Session Records</h2>
            <p>
              User login and security session information
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (

          <div className="empty">
            <h3>Loading sessions...</h3>
          </div>

        ) : sessions.length === 0 ? (

          /* No Sessions */
          <div className="empty">

            <div>🔐</div>

            <h3>No sessions recorded</h3>

            <p>
              Create a session through the API to see it here.
            </p>

          </div>

        ) : (

          /* Sessions Table */
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
                    Session ID
                  </th>

                  <th style={{ padding: "14px" }}>
                    User ID
                  </th>

                  <th style={{ padding: "14px" }}>
                    Device ID
                  </th>

                  <th style={{ padding: "14px" }}>
                    Login Time
                  </th>

                  <th style={{ padding: "14px" }}>
                    Status
                  </th>

                  <th style={{ padding: "14px" }}>
                    Risk Score
                  </th>

                  <th style={{ padding: "14px" }}>
                    Risk Level
                  </th>

                </tr>

              </thead>

              <tbody>

                {sessions.map((session) => (

                  <tr
                    key={session.session_id}
                  >

                    <td style={{ padding: "14px" }}>
                      🔐 {session.session_id}
                    </td>

                    <td style={{ padding: "14px" }}>
                      {session.user_id}
                    </td>

                    <td style={{ padding: "14px" }}>
                      {session.device_id}
                    </td>

                    <td style={{ padding: "14px" }}>
                      {session.login_time}
                    </td>

                    <td style={{ padding: "14px" }}>

                      <span
                        style={{
                          color: session.is_active
                            ? "#16a34a"
                            : "#64748b",
                          fontWeight: "600"
                        }}
                      >

                        ●{" "}

                        {session.is_active
                          ? "Active"
                          : "Closed"}

                      </span>

                    </td>

                    <td style={{ padding: "14px" }}>
                      {session.risk_score}
                    </td>

                    <td style={{ padding: "14px" }}>

                      <span
                        style={{
                          color:
                            session.risk_level === "Critical"
                              ? "#dc2626"
                              : session.risk_level === "High"
                              ? "#ea580c"
                              : session.risk_level === "Medium"
                              ? "#d97706"
                              : "#16a34a",
                          fontWeight: "600"
                        }}
                      >

                        {session.risk_level}

                      </span>

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

export default Sessions;