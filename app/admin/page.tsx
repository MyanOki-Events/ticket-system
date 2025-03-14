"use client";

import { useState, useEffect } from "react";
import { getAllUsers } from "../services/user_service";
import Link from "next/link";
// import { addNewTickets } from "../services/ticket_service";
import { User } from "../dao/user";
import { useSession } from "next-auth/react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { useAuth } from "../contexts/AuthContext";
import LoadingLayout from "../components/LoadingLayout";

const AdminPage = () => {
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
            <h1 className="text-center text-dark" style={{ paddingTop: '60px' }}>Admin Dashboard</h1>

            <section>
              <div className="d-flex justify-content-center gap-2">
                <Link href={`admin/member`} className="btn btn-secondary p-3">
                  All Members
                </Link>
                <Link href={`admin/ticket`} className="btn btn-secondary p-3">
                  All Tickets
                </Link>
                <Link href={`admin/qrcode`} className="btn btn-secondary p-3">
                  QR-Code Reader
                </Link>
              </div>
            </section>
          </div>
      }

      <Footer />
    </>
  );
};

export default AdminPage;
