import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccessDenied: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-10 left-10 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 max-w-2xl w-full bg-white rounded-2xl border border-gray-200 p-8 shadow-xl text-center">

                {/* Infographic / Illustration */}
                <div className="mb-8 relative inline-block">
                    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                        <circle cx="100" cy="100" r="90" stroke="#EF4444" strokeWidth="4" strokeDasharray="10 10" className="opacity-20 animate-spin-slow" />
                        <circle cx="100" cy="100" r="70" className="fill-white stroke-red-500" strokeWidth="2" />

                        {/* Lock Body */}
                        <path d="M70 90H130C135.523 90 140 94.4772 140 100V150C140 155.523 135.523 160 130 160H70C64.4772 160 60 155.523 60 150V100C60 94.4772 64.4772 90 70 90Z" fill="#EF4444" className="drop-shadow-md" />

                        {/* Shackle */}
                        <path d="M100 90V65C100 56.7157 93.2843 50 85 50C76.7157 50 70 56.7157 70 65V90" stroke="#475569" strokeWidth="8" strokeLinecap="round" className="-z-10" />
                        <path d="M130 90V65C130 48.4315 116.569 35 100 35C83.4315 35 70 48.4315 70 65V90" stroke="#64748B" strokeWidth="8" strokeLinecap="round" className="-z-10" />

                        {/* Keyhole */}
                        <circle cx="100" cy="115" r="8" fill="#7F1D1D" />
                        <path d="M100 115L95 140H105L100 115Z" fill="#7F1D1D" />

                        {/* Cross Mark */}
                        <path d="M140 40L160 60M160 40L140 60" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" className="animate-bounce" />
                    </svg>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
                    Access Denied
                </h1>
                <p className="text-red-500 font-mono text-lg mb-6 uppercase tracking-widest font-semibold">
                    Code 403: Forbidden
                </p>

                <p className="text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto">
                    Your clearance level is insufficient for this area.
                    This incident has been logged and reported to the Site Reliability Engineering team.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => navigate('/home')}
                        className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg shadow-red-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Return to Base
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        Back to Landing
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;
