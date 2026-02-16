import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from './hooks/useAuth';

export const Home = () => {

    const { user } = useAuth();
    const name = user?.full_name;
    const email = user?.email;

    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/userDashboard')
    }
    // --- Framer Motion Animation Variants (Non-business logic, only styling) ---

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring" as const, stiffness: 100 }
        }
    };

    // --- Render Component ---

    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* --- Welcome Card --- */}
            <motion.div
                className="bg-white p-10 md:p-12 rounded-2xl shadow-2xl w-full max-w-lg text-center"
                variants={itemVariants}
            >
                {/* 1. Main Welcome Message (Bigger, Bolder) */}
                <motion.h1
                    className="text-4xl font-extrabold text-indigo-600 mb-2"
                    variants={itemVariants}
                >
                    Welcome Back,
                </motion.h1>

                {/* 2. User Name */}
                <motion.div
                    className="text-5xl font-extrabold text-gray-900 mb-6"
                    variants={itemVariants}
                >
                    {name || 'Guest!'}
                </motion.div>

                {/* 3. Divider Line */}
                <motion.hr
                    className="border-gray-200 mb-6 w-1/3 mx-auto"
                    variants={itemVariants}
                />

                {/* 4. User Email */}
                <motion.div
                    className="text-lg text-gray-500 mb-8"
                    variants={itemVariants}
                >
                    <p className="font-semibold text-gray-600">Authenticated Email:</p>
                    {/* BUSINESS LOGIC: Displays the authenticated user's email address. */}
                    <p>{email || 'N/A'}</p>
                </motion.div>

                {/* 5. Call to Action Button */}
                <motion.button
                    className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 cursor-pointer"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClick}
                >
                    View Your Dashboard
                </motion.button>

            </motion.div>

            {/* Optional: Footer or Disclaimer */}
            <motion.p
                className="mt-8 text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                This session is securely authenticated.
            </motion.p>

        </motion.div>
    );
};