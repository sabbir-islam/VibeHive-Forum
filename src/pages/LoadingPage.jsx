import React from 'react';

const LoadingPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-100">
            <div className="text-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 text-xl font-medium">Loading<span className="dots">...</span></p>
            </div>
        </div>
    );
};

export default LoadingPage;