"use client"

import Event from "@/app/dao/event";
import { updateEventById } from "@/app/services/event_services";
import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../contexts/AuthContext";
import LoadingLayout from "./LoadingLayout";
const EventEditFormLayout = ({ eventInfo }: { eventInfo: Event }) => {
    const initEvent: Event = eventInfo
    const [eventData, setEventData] = useState(initEvent);
    const [updateStatus, setUpdateStatus] = useState(false);
    const { loading } = useAuth()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await updateEventById(eventData)
        setUpdateStatus(true)
        setTimeout(() => {
            setUpdateStatus(false)
        }, 3000);
    }

    const exitCurrentPage = () => {
        window.history.back()
    }

    return (
        <>
            <Header />
            {
                loading ?
                    <LoadingLayout /> :
                    <div className="container">
                        {/* Page Title */}
                        <h3 className="text-center" style={{ paddingTop: '60px', color: '#2a9d8f' }}>Edit Event</h3>

                        <div className="d-flex flex-column align-items-center justify-content-center">
                            <div style={{ display: updateStatus ? "block" : "none" }} className="col col-sm-10 col-md-8 bg-success p-2 my-3">
                                Successfully Updated.
                            </div>

                            <form className="col col-sm-10 col-md-8" onSubmit={handleFormSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="eventTitle" className="mb-1">Event Title</label>
                                    <input type="text" name="eventTitle" value={eventData.eventTitle} onChange={handleChange} className="form-control" id="eventTitle" placeholder="Enter Event Title" required />
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="eventDate" className="mb-1">Event Date</label>
                                    <input type="date" name="eventDate" value={eventData.eventDate} onChange={handleChange} className="form-control" id="eventDate" placeholder="Enter Event Date" />
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="eventTime" className="mb-1">Event Time</label>
                                    <input type="text" name="eventTime" value={eventData.eventTime} onChange={handleChange} className="form-control" id="eventTime" placeholder="00:00 AM - 00:00 PM" />
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="eventPlace" className="mb-1">Event Place</label>
                                    <input type="text" name="eventPlace" value={eventData.eventPlace} onChange={handleChange} className="form-control" id="eventPlace" placeholder="Enter Place like event hall" />
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="eventLocation" className="mb-1">Location</label>
                                    <input type="text" name="location" value={eventData.location} onChange={handleChange} className="form-control" id="eventLocation" placeholder="Enter Location" />
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="ticketPrice" className="mb-1">Price</label>
                                    <input type="text" name="price" value={eventData.price} onChange={handleChange} className="form-control" id="ticketPrice" placeholder="Enter Price" />
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="eventCode" className="mb-1">Event Code</label>
                                    <input type="text" name="eventCode" value={eventData.eventCode} onChange={handleChange} className="form-control" id="eventCode" placeholder="OMA_" required />
                                </div>

                                <div className="form-group mb-3 d-flex gap-1">
                                    <button onClick={() => exitCurrentPage()} type="button" className="btn btn-danger form-control">Exist</button>
                                    <button type="submit" className="btn btn-primary form-control">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
            }
            <Footer />
        </>
    )
}

export default EventEditFormLayout