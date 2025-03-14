"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { getAllUsers } from "@/app/services/user_service";
import { User } from "@/app/dao/user";
import { useAuth } from "@/app/contexts/AuthContext";
import LoadingLayout from "@/app/components/LoadingLayout";

const AllMembersPage = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const { loading } = useAuth()

  useEffect(() => {
    getAllUsers()
      .then((data) => {
        setUsers(data)
      })
      .catch((error) => console.log(error))
  }, [session]);

  // TODO: Remove After First Step(first release)
  const handleClick = async (userId: string) => {
    // await addNewTickets(userId)
  }

  return (
    <>
      <Header />

      {
        loading ?
          <LoadingLayout /> :
          <div className="container" style={{ padding: '20px' }}>
            <h1 className="text-center text-dark" style={{ paddingTop: '60px' }}>All Members</h1>

            <section>
              {/* <h3 className="text-dark">All Users</h3> */}
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
                          <Link href={`member/${user.userId}`}>
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
      }

      <Footer />
    </>
  );
};

export default AllMembersPage;
