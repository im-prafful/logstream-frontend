import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* Back Button (Top Left — Proper UX) */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 px-5 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg font-medium shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
                ← Back
            </button>

            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-10 left-10 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 max-w-2xl w-full bg-white rounded-2xl border border-gray-200 p-8 shadow-xl text-center">

                {/* Infographic Lock Shield */}
                <div className="mb-8 relative inline-block">
                    <svg width="220" height="220" viewBox="0 0 220 220" className="mx-auto">
                        {/* Rotating dashed ring */}
                        <circle
                            cx="110"
                            cy="110"
                            r="100"
                            stroke="#EF4444"
                            strokeWidth="3"
                            strokeDasharray="8 8"
                            fill="none"
                            className="opacity-30 animate-spin"
                        />

                        {/* Shield */}
                        <path
                            d="M110 40L170 65V115C170 150 145 180 110 190C75 180 50 150 50 115V65L110 40Z"
                            fill="#FEE2E2"
                            stroke="#EF4444"
                            strokeWidth="3"
                        />

                        {/* Lock */}
                        <rect
                            x="85"
                            y="100"
                            width="50"
                            height="45"
                            rx="8"
                            fill="#EF4444"
                        />
                        <path
                            d="M110 100V85C110 75 103 68 95 68C87 68 80 75 80 85V100"
                            stroke="#374151"
                            strokeWidth="6"
                            strokeLinecap="round"
                        />
                        <circle cx="110" cy="120" r="6" fill="#7F1D1D" />
                    </svg>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
                    Access Denied
                </h1>

                <p className="text-red-500 font-mono text-lg mb-6 uppercase tracking-widest font-semibold">
                    403 • Forbidden
                </p>

                <p className="text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto">
                    You do not have sufficient privileges to access this resource.
                    Please contact your administrator if you believe this is an error.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => navigate('/home')}
                        className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg shadow-red-200 active:scale-95 cursor-pointer"
                    >
                        Go to HOME
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;