"use client"

const LoadingLayout = () => {
    return (
        <>
            <div className="bg-image d-flex justify-content-center align-items-center"
                style={{ height: '100vh' }}>
                <div className="loader-container d-flex flex-column justify-content-center align-items-center p-3 rounded">
                    <div className="loader"></div>
                    <div className="mt-3">
                        <span className="text-white">Page Loading</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoadingLayout