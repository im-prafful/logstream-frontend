import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccessDenied: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white px-4">
            <div className="max-w-md w-full text-center">
                {/* Cool modern SVG illustration for Access Denied */}
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-32 h-32 mx-auto mb-8 text-red-500 animate-pulse"
                >
                    <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M15 9L9 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M9 9L15 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-600">
                    403 Forbidden
                </h1>

                <p className="text-xl text-gray-300 mb-8">
                    Halt! You don't have permission to access this area.
                    <br />
                    Resetting security protocols...
                </p>

                <div className="flex flex-col gap-4 justify-center">
                    <button
                        onClick={() => navigate('/home')}
                        className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-red-500/50 cursor-pointer"
                    >
                        Return to Safety
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                        Back to Landing
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;
