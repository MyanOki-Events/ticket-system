"use client";

import { useState, useEffect } from "react";
import { getAllUsers } from "../services/user_service";
import Link from "next/link";
import { addNewTickets } from "../services/ticket_service";
import { User } from "../dao/user";
// import { addRealTimeData } from "../utils/firebase/if/firebase_realtime_db_if";

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

const AdminPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!session || session.user?.email !== "myanmarokinawaevents@gmail.com") {
      router.push('/');
    } else {
      console.log('Admin is using');
      router.push('/admin');
    }
    getAllUsers()
      .then((data) => {
        setUsers(data)
      })
      .catch((error) => console.log(error))
  }, [session]);

  const handleClick = async (userId: string) => {
    // addRealTimeData(userId)
    await addNewTickets(userId)
  }

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
                <tr key={user.userId} onClick={async () => await handleClick(user.userId)}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Link href={"admin/member?userId=" + user.userId}>
                      <i className="bi bi-clipboard-data"></i>
                    </Link>
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
