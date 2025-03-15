"use client"

import Header from "@/app/components/Header";
import LoadingLayout from "@/app/components/LoadingLayout";
import { useAuth } from "@/app/contexts/AuthContext";
import Event from "@/app/dao/event";
import { addNewEvent } from "@/app/services/event_services";
import { useState } from "react";
const EventAddFormLayout = () => {
    const initEvent: Event = new Event("", "", "", "","","", 0, "", "", "")
    const [eventData, setEventData] = useState(initEvent);
    const [addStatus, setAddStatus] = useState(false);
    const { loading } = useAuth()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formRef = e.currentTarget
        const res: string = await addNewEvent(eventData)
        if (res && res != "") {
            setAddStatus(true)
            setEventData(initEvent)
            formRef.reset()
            setTimeout(() => {
                setAddStatus(false)
            }, 3000);
        }
    }
    return (
        <>
            <Header />

            {
                loading ?
                    <LoadingLayout /> :
                    <div className="container">
                        {/* Page Title */}
                        <h3 className="text-center" style={{ paddingTop: '60px', color: '#2a9d8f' }}>Add New Event</h3>

                        <div className="d-flex flex-column align-items-center justify-content-center">
                            <div style={{ display: addStatus ? "block" : "none" }} className="col col-sm-10 col-md-8 bg-success p-2 my-3">
                                Successfully Added New Event.
                            </div>

                            <form className="col col-sm-10 col-md-8" onSubmit={handleFormSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="eventTitle" className="mb-1">Event Title</label>
                                    <input type="text" name="eventTitle" onChange={handleChange} className="form-control" id="eventTitle" placeholder="Enter Event Title" required />
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="eventDate" className="mb-1">Event Date</label>
                                    <input type="date" name="eventDate" onChange={handleChange} className="form-control" id="eventDate" placeholder="Enter Event Date" />
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="eventTime" className="mb-1">Event Time</label>
                                    <input type="text" name="eventTime" onChange={handleChange} className="form-control" id="eventTime" placeholder="00:00 AM - 00:00 PM" />
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="eventPlace" className="mb-1">Event Place</label>
                                    <input type="text" name="eventPlace" value={eventData.eventPlace} onChange={handleChange} className="form-control" id="eventPlace" placeholder="Enter Place like event hall" />
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="eventLocation" className="mb-1">Location</label>
                                    <input type="text" name="location" onChange={handleChange} className="form-control" id="eventLocation" placeholder="Enter Location" />
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="ticketPrice" className="mb-1">Price</label>
                                    <input type="text" name="price" onChange={handleChange} className="form-control" id="ticketPrice" placeholder="Enter Price" />
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="eventCode" className="mb-1">Event Code</label>
                                    <input type="text" name="eventCode" onChange={handleChange} className="form-control" id="eventCode" placeholder="OMA_" required />
                                </div>

                                <div className="form-group mb-3 d-flex gap-1">
                                    <button type="reset" className="btn btn-danger form-control">Reset</button>
                                    <button type="submit" className="btn btn-primary form-control">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
            }
        </>
    )
}

export default EventAddFormLayout