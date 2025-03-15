"use client"

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import LoadingLayout from "@/app/components/LoadingLayout";
import { useAuth } from "@/app/contexts/AuthContext";
import Event from "@/app/dao/event";
import { deleteEventById, getAllEvent } from "@/app/services/event_services";
import { useEffect, useState } from "react";

const EventPage = () => {
    const [eventList, setEventList] = useState<Event[]>([]);
    const { loading } = useAuth()
    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
        getAllEvent()
            .then((data) => {
                setEventList((old) => old = data)
            })
            .catch((error) => console.log(error))
    }, [eventList])

    const deleteEvent = async (eventId: string) => {
        await deleteEventById(eventId)
    }

    return (
        <>
            <Header />

            {
                loading ?
                    <LoadingLayout /> :
                    <div className="container">
                        {/* Page Title */}
                        <h3 className="text-center" style={{ paddingTop: '60px', color: '#2a9d8f' }}>All Events</h3>

                        {/* Show All Events */}
                        <div className="d-flex flex-column align-items-center justify-content-center">
                            <div className="col col-sm-10 col-md-8 m-2">
                                <a href="/admin/event/add_new" className="d-inline-flex align-items-center gap-1 border border-primary rounded px-2">
                                    <span>Add New Event</span>
                                    <i className="bi bi-plus-lg" style={{ fontSize: '1.25rem' }}></i>
                                </a>
                            </div>

                            <div className="accordion col col-sm-10 col-md-8" id="accordionExample">
                                {
                                    eventList ?
                                        eventList.map((event) => (
                                            <div className="accordion-item" key={event.eventId}>
                                                <h2 className="accordion-header">
                                                    <button className="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target={"#" + event.eventId} aria-expanded="false" aria-controls={event.eventId}>
                                                        {event.eventTitle}
                                                    </button>
                                                </h2>
                                                <div id={event.eventId} className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                                    <div className="accordion-body">
                                                        <div className="d-flex align-items-center">
                                                            <i className="bi bi-calendar-event text-primary me-3" style={{ fontSize: '24px' }}></i>
                                                            <span>{event.eventDate}</span>
                                                        </div>

                                                        <div className="d-flex align-items-center">
                                                            <i className="bi bi-clock text-warning me-3" style={{ fontSize: '24px' }}></i>
                                                            <span>{event.eventTime}</span>
                                                        </div>

                                                        <div className="d-flex align-items-center">
                                                            <i className="bi bi-house text-success me-3" style={{ fontSize: '24px' }}></i>
                                                            <span>{event.eventPlace}</span>
                                                        </div>

                                                        <div className="d-flex align-items-center">
                                                            <i className="bi bi-geo-alt text-success me-3" style={{ fontSize: '24px' }}></i>
                                                            <span>{event.location}</span>
                                                        </div>

                                                        <div className="d-flex align-items-center">
                                                            <i className="bi bi-currency-yen me-3" style={{ fontSize: '24px' }}></i>
                                                            <span>{event.price}</span>
                                                        </div>

                                                        <hr />
                                                        <div className="d-flex align-items-center gap-1">
                                                            <a href={'/admin/event/edit_old/' + event.eventId} className="form-control btn btn-primary">Edit</a>
                                                            <button onClick={() => deleteEvent(event.eventId)} className="form-control btn btn-danger">Delete</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <div>
                                            <h6>There is not events...</h6>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
            }

            <Footer />
        </>
    )
}


export default EventPage;