import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 


                //ADD LOGOUT BUTTON + HANDLE PROTECTED ROUTE SHIT!!
                //CALL API TO FETCH LOGS BASED ON CATEGORY WITH COUNT AND SHOW THEM IN A GRID
                //IMPLEMENT PAGINATION
                
export const UserDisp = () => {
    const navigate = useNavigate();

const handleLogout = () => {
    console.log("Token before removal:", localStorage.getItem("JWT")); // Check before
    localStorage.removeItem("JWT");
    console.log("Token AFTER removal:", localStorage.getItem("JWT"));  // Check after (should be null)
    navigate("/login"); 
}

    const gradientStyle = {
        background: 'linear-gradient(145deg, #7c3aed, #5b21b6)', 
    };

    return (
   
        <div className="relative w-full min-h-screen bg-gray-50">
            
            {/* The Logout Button Container (positioned top-right) */}
            <div className="absolute top-6 right-6 z-10">
                <motion.button
                    onClick={handleLogout}
                    // Tailwind Classes for Button Shape, Text, and Shadow
                    className="
                        px-6 py-3 rounded-xl 
                        text-white text-lg font-bold tracking-wide 
                        shadow-2xl transition-all duration-200 ease-in-out
                        transform 
                    "
                    style={gradientStyle}
                    
                    // Framer Motion for subtle press down animation
                    whileTap={{ scale: 0.95, boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)' }}
                    
                    // Framer Motion for shadow lift on hover
                    whileHover={{ 
                        boxShadow: '0 10px 20px rgba(124, 58, 237, 0.5)', // Enhanced shadow with purple glow
                        y: -2 // Subtly lift the button
                    }}
                >
                    Logout
                </motion.button>
            </div>
            
            {/* The main content area of UserDisp */}
            <div className="pt-20 p-6">
                 {/* Your main user display content goes here */}
                 <h1 className="text-3xl font-light text-gray-800">User Dashboard Content</h1>
            </div>
        </div>
    );
};