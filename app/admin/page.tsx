"use client";

import { useState, useEffect } from "react";
import { getAllUsers } from "../services/user_service";

//import { useSession } from "next-auth/react";

const AdminPage = () => {
  //   const { data: session } = useSession();

  //   if (!session || session.user.email !== "admin@example.com") {
  //     return <p>You need to be an admin to view this page.</p>;
  //   }

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getAllUsers()
      .then((data) => {
        setUsers(data as User[])
      })
      .catch((error) => console.log(error))
  })

  return (
    <div className="container">
      <h1 className="text-center">Admin Dashboard</h1>

      <section>
        <h3>All Users</h3>
        <div className="overflow-x-scroll">
          <table className="table table-sm table-bordered border-dark">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span>
                      <i className="bi bi-clipboard-data"></i>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
