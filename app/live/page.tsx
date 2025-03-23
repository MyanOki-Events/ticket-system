"use client"

import Ticket from "@/app/dao/ticket";
import liveStyle from "@/app/live.module.css"
import { useEffect, useState } from "react";

const LiveStreaming = () => {
    const [attendUsers, setAttendUsers] = useState<Ticket[]>([]);
    const [attendUsersCount, setAttendUsersCount] = useState(0);

    useEffect(() => {
        const eventSource = new EventSource("/api/live");

        eventSource.onmessage = (event) => {
            const rawData = JSON.parse(event.data)
            const userIds = Object.keys(rawData)
            userIds.forEach((userId) => {
                const tickets = rawData[userId].tickets
                const ticketIds = Object.keys(tickets)
                ticketIds.forEach((ticketId) => {
                    let ticket = tickets[ticketId] as Ticket
                    ticket.ticketId = ticketId
                    ticket.userId = userId

                    if (ticket && ticket.isUsed) {
                        setAttendUsers((previousData) => {
                            if (previousData && previousData.some((item) => item.ticketId === ticket.ticketId)) {
                                return [...previousData]
                            }
                            else {
                                return [...previousData, ticket]
                            }
                        })
                    }
                })
            })
        };

        return () => eventSource.close();
    }, []);

    useEffect(() => {
        if (attendUsers) {
            setAttendUsersCount(attendUsers.length)
        }
    }, [attendUsers])

    return (
        <div className="p-3">
            <h1 className="font-monospace text-center text-success">Attended Users</h1>
            <div className="d-flex flex-column gap-1">
                {
                    attendUsers.sort((a, b) => b.updated - a.updated).map((obj) => (
                        <div key={obj.ticketId} className="border p-2 text-primary fw-bolder">
                            <span>{obj.ticketNo || obj.ticketTmpNo}</span>
                        </div>
                    ))
                }
            </div>

            <div className={`${liveStyle.attendUserCountWrapper}`}>
                <div className={`${liveStyle.attendUserCount} font-monospace fw-bolder border border-light`}>
                    <span className="font-monospace text-success">{attendUsersCount}</span>
                </div>
            </div>
        </div>
    );
}

export default LiveStreaming