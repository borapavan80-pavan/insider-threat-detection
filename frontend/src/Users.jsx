import { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);

    fetch("http://127.0.0.1:8000/users/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        return response.json();
      })
      .then((data) => {
        setUsers(data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setUsers([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>

      {/* Page Header */}
      <div className="header">
        <div>
          <h1>Users</h1>
          <p>Registered and authorized users</p>
        </div>

        <button
          onClick={fetchUsers}
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

      {/* User Summary */}
      <section className="cards">

        <div className="card">
          <p>Total Users</p>
          <h2>{users.length}</h2>
          <span>Registered users</span>
        </div>

        <div className="card">
          <p>Authorized</p>

          <h2>
            {users.filter(
              (user) => user.is_authorized
            ).length}
          </h2>

          <span>Trusted users</span>
        </div>

        <div className="card">
          <p>Pending</p>

          <h2>
            {users.filter(
              (user) => !user.is_authorized
            ).length}
          </h2>

          <span>Awaiting authorization</span>
        </div>

        <div className="card">
          <p>System</p>

          <h2 className="healthy">
            Online
          </h2>

          <span>User monitoring active</span>
        </div>

      </section>

      {/* User List */}
      <section className="panel">

        <div className="panel-header">

          <div>
            <h2>Registered Users</h2>
            <p>
              Users connected to the security system
            </p>
          </div>

        </div>

        {/* Loading */}
        {loading ? (

          <div className="empty">
            <h3>Loading users...</h3>
          </div>

        ) : users.length === 0 ? (

          /* No Users */
          <div className="empty">

            <div>👤</div>

            <h3>No users registered</h3>

            <p>
              Register a user through the API to
              see it here.
            </p>

          </div>

        ) : (

          /* Users Table */
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
                    User
                  </th>

                  <th style={{ padding: "14px" }}>
                    User ID
                  </th>

                  <th style={{ padding: "14px" }}>
                    Email
                  </th>

                  <th style={{ padding: "14px" }}>
                    Device ID
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

                {users.map((user) => (

                  <tr key={user.user_id}>

                    <td style={{ padding: "14px" }}>
                      👤 {user.name}
                    </td>

                    <td style={{ padding: "14px" }}>
                      {user.user_id}
                    </td>

                    <td style={{ padding: "14px" }}>
                      {user.email}
                    </td>

                    <td style={{ padding: "14px" }}>
                      {user.device_id}
                    </td>

                    <td style={{ padding: "14px" }}>

                      <span
                        style={{
                          color: user.is_authorized
                            ? "#16a34a"
                            : "#d97706",
                          fontWeight: "600"
                        }}
                      >
                        ●{" "}
                        {user.is_authorized
                          ? "Authorized"
                          : "Pending"}
                      </span>

                    </td>

                    <td style={{ padding: "14px" }}>
                      {user.trust_status}
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

export default Users;