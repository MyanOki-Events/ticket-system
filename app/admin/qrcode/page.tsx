"use client";
import Ticket from "@/app/dao/ticket";
import { updateTicketByIds } from "@/app/services/ticket_service";
import { convertDate } from "@/app/utils/date_utils/date_format";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

export default function QRScanner() {
    const [scannedData, setScannedData] = useState("");
    const [scanQRShow, setScanQRShow] = useState(true);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const [ticketData, setTicketData] = useState<Ticket | null>()
    const [ticketModal, setTicketModal] = useState<null | any>();
    const [confirmBtnGuard, setConfirmBtnGuard] = useState(false)

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
    };

    const confirmTicket = async () => {
        // disable confirm button for double fire safety
        setConfirmBtnGuard(true)

        // update ticket state
        const data: string[] = scannedData.split("/")
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
                const data: string[] = scannedData.split("/")
                if (data && data.length >= 2) {
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
                        setTicketData(responseData.data)
                        openModal()
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }

        getTickeInfo()
    }, [scannedData])

    return (
        <>
            <div className="container">
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <h2 className="mb-3">QR Code Scanner</h2>
                    <div id="reader" className="col-12 col-sm-11 col-md-8"></div>
                    {
                        scanQRShow && <button className="btn btn-primary" type="button" onClick={() => startScanner()}>Scan QR Code</button>
                    }
                </div>
            </div>

            {/* Bootstrap Modal */}
            <div className="modal fade" ref={modalRef} id="myModal" tabIndex={-1} aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalLabel">Ticket No : {ticketData?.ticketNo || ticketData?.ticketTmpNo}</h5>
                            <button type="button" className="btn-close" onClick={closeModal}></button>
                        </div>
                        <div className="modal-body">
                            <p className="fs-6">Booking Date : {convertDate(ticketData?.created)}</p>
                            <p className="fs-6">Charged Date : {convertDate(ticketData?.updated)}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                Close
                            </button>
                            {ticketData && !ticketData?.isUsed &&
                                <button type="button" className="btn btn-success" onClick={confirmTicket} disabled={confirmBtnGuard}>
                                    Confirm
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
