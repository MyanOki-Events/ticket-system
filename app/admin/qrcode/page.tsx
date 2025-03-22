"use client";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Ticket from "@/app/dao/ticket";
import { updateTicketByIds } from "@/app/services/ticket_service";
import { convertDate } from "@/app/utils/date_utils/date_format";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

enum TickeStatus {
    NONE, // init state and read data from database
    FAIL, // no data record at database
    ALREADY_USED, // already used ticket
    NOT_USED // usable ticket
}

export default function QRScanner() {
    const [scannedData, setScannedData] = useState<string | null>("");
    const [scanQRShow, setScanQRShow] = useState(true);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const [ticketData, setTicketData] = useState<Ticket | null>()
    const [ticketModal, setTicketModal] = useState<null | any>();
    const [confirmBtnGuard, setConfirmBtnGuard] = useState(false)
    const [scanDataIsValid, setScannedDataIsValid] = useState(true) // is recommanded data structure?
    const [tickeStatus, setTickeStatus] = useState<TickeStatus>(TickeStatus.NONE)

    // Import Bootstrap JS on client-side
    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);

    useEffect(() => {
        // Import Bootstrap dynamically (client-side only)
        import("bootstrap").then(({ Modal }) => {
            if (modalRef.current) {
                const myModal = new Modal(modalRef.current);
                setTicketModal(myModal)
            }
        });
    }, []);

    const openModal = () => {
        ticketModal?.show(); // Open modal
    };

    const closeModal = () => {
        ticketModal?.hide(); // Close modal

        // open scanner again
        // startScanner()
        // clean ticket data
        setTicketData(null)
        setTickeStatus(TickeStatus.NONE)
    };

    const confirmTicket = async () => {
        // disable confirm button for double fire safety
        setConfirmBtnGuard(true)

        // update ticket state
        const data: string[] = scannedData?.split("/") ?? []
        await updateTicketByIds(String(data.at(-2)), String(data.at(-1)), { "isUsed": true })

        // close modal
        closeModal()
        setConfirmBtnGuard(false)
    }

    const startScanner = async () => {
        // clear previous state
        setScannedData("");
        setScanQRShow(false);

        const scanner = new Html5QrcodeScanner("reader", {
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
            qrbox: {
                width: 250,
                height: 250
            },
            fps: 10
        }, true)

        scanner.render(
            (decodedText) => {
                setScannedData(decodedText);
                setScanQRShow(true);
                scanner.clear(); // stop scanning after detecting a QR code
            },
            (error) => {
                console.log(error); // logs scan errors
            }
        );

        return () => scanner.clear();
    }

    // listen scannedData update
    useEffect(() => {
        // get ticket & its information form firebase database by using qrcode scan data as parameter
        const getTickeInfo = async () => {
            try {
                const data: string[] = scannedData?.split("/") ?? []
                if (data && data.length >= 2) {
                    setScannedDataIsValid(true)
                    openModal()

                    // add delay for showing loading(validation process)
                    setTimeout(async () => {
                        const result = await fetch('/api/confirm-ticket', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                paramOne: String(data.at(-2)),
                                paramTwo: String(data.at(-1))
                            }),
                        });

                        const responseData = await result.json()
                        if (responseData?.data) {
                            // setTicketData(responseData.data)
                            // openModal()
                            console.log(responseData.data)
                            if (responseData.data.isUsed) {
                                setTickeStatus(TickeStatus.ALREADY_USED)
                            } else {
                                setTickeStatus(TickeStatus.NOT_USED)
                            }
                        } else {
                            // openModal()
                            setTickeStatus(TickeStatus.FAIL)
                        }
                    }, 500)
                } else {
                    setScannedDataIsValid(false)
                    openModal()
                }
            } catch (error) {
                console.log(error)
            }
        }

        if (scannedData) {
            getTickeInfo()
        }
    }, [scannedData])

    return (
        <>
            <Header />
            <div className="container" style={{ padding: '20px' }}>
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <h2 className="mb-3" style={{ paddingTop: '60px', color: '#2a9d8f' }}>QR Code Scanner</h2>
                    <div id="reader" className="col-12 col-sm-11 col-md-8"></div>
                    {
                        scanQRShow && <button className="btn btn-primary" type="button" onClick={() => startScanner()}>Scan QR Code</button>
                    }
                </div>
            </div>

            <div className="modal fade" ref={modalRef} id="confirmTicketModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        {
                            scanDataIsValid ?
                                <>
                                    {
                                        tickeStatus === TickeStatus.NONE ?
                                            <div className="d-flex flex-column justify-content-center align-items-center gap-4 position-relative py-5">
                                                <span className="qr-model-close text-warning" onClick={closeModal}>
                                                    <i className="bi bi-x-lg"></i>
                                                </span>

                                                <div className="ticket-loader mt-3"></div>
                                                <span className="fs-6 text-warning font-monospace">
                                                    Validating Ticket...
                                                </span>
                                            </div> :
                                            tickeStatus === TickeStatus.FAIL ?
                                                <div className="d-flex flex-column p-3 justify-content-center align-items-center position-relative py-5">
                                                    <span className="qr-model-close text-danger" onClick={closeModal}>
                                                        <i className="bi bi-x-lg"></i>
                                                    </span>

                                                    <span className="fs-3 text-danger font-monospace">Sorry</span>
                                                    <span className="fs-6 text-danger font-monospace">Your Ticket(QR-Code) is Invalid!</span>
                                                </div> :
                                                tickeStatus === TickeStatus.ALREADY_USED ?
                                                    <div className="d-flex flex-column p-3 justify-content-center align-items-center position-relative py-5">
                                                        <span className="qr-model-close text-danger" onClick={closeModal}>
                                                            <i className="bi bi-x-lg"></i>
                                                        </span>

                                                        <span className="fs-3 text-danger font-monospace">Sorry</span>
                                                        <span className="fs-6 text-danger font-monospace">Your Ticket(QR-Code) is already used!</span>
                                                    </div> :
                                                    <div className="d-flex flex-column p-3 justify-content-center align-items-center position-relative py-5">
                                                        <span className="qr-model-close text-success" onClick={confirmTicket}>
                                                            <i className="bi bi-x-lg"></i>
                                                        </span>

                                                        <span className="fs-3 text-success font-monospace">Thank You</span>
                                                        <span className="fs-6 text-success font-monospace">for attending our event!</span>
                                                    </div>
                                    }
                                </> :
                                <div className="d-flex flex-column p-3 justify-content-center align-items-center position-relative py-5">
                                    <span className="qr-model-close text-danger" onClick={closeModal}>
                                        <i className="bi bi-x-lg"></i>
                                    </span>

                                    <span className="fs-3 text-danger font-monospace">Sorry</span>
                                    <span className="fs-6 text-danger font-monospace">Your Ticket(QR-Code) is Invalid!</span>
                                </div>
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
