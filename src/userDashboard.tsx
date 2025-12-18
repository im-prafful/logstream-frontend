import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export const UserDisp = () => {
    const navigate = useNavigate()
    const [logs, setLogs] = useState([])

    // Format ISO timestamp → YYYY-MM-DD HH:MM
    const formatTimestamp = (isoString: string | number | Date) => {
        if (!isoString) return "-"

        const date = new Date(isoString)

        const yyyy = date.getFullYear()
        const mm = String(date.getMonth() + 1).padStart(2, "0")
        const dd = String(date.getDate()).padStart(2, "0")
        const hh = String(date.getHours()).padStart(2, "0")
        const min = String(date.getMinutes()).padStart(2, "0")

        return `${yyyy}-${mm}-${dd} ${hh}:${min}`
    }

    useEffect(() => {
        const fetchLogsFnc = async () => {
            try {
                const token = localStorage.getItem("JWT")

                const response = await axios.get(
                    "https://9swlhzogxj.execute-api.ap-south-1.amazonaws.com/api/v1/logs",
                    {
                        headers: {
                            authorization: `Bearer ${token}`
                        }
                    }
                )

                setLogs(response.data.logs)
            } catch (err) {
                console.error(err)

            }
        }

        fetchLogsFnc()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("JWT")
        navigate("/login")
    }

    const gradientStyle = {
        background: "linear-gradient(145deg, #7c3aed, #5b21b6)"
    }

    return (
        <div className="relative w-full min-h-screen bg-gray-50">
            {/* Logout Button */}
            <div className="absolute top-6 right-6 z-10 cursor-pointer">
                <motion.button
                    onClick={handleLogout}
                    className="px-6 py-3 rounded-xl text-white text-lg font-bold shadow-2xl"
                    style={gradientStyle}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ y: -2 }}
                >
                    Logout
                </motion.button>
            </div>

            {/* Content */}
            <div className="pt-20 p-6 max-w-6xl mx-auto">
                <h1 className="text-3xl font-light text-gray-800 mb-6">
                    Latest Logs
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {logs.map((item, idx) => (
                        <motion.div
                            key={item.log_id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.03, y: -4 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="
    bg-white rounded-xl shadow-md p-5 h-full
    cursor-pointer
  "
                        >

                            {/* Header */}
                            <div className="flex justify-between items-center mb-2">
                                <span
                                    className={`text-xs font-bold uppercase ${item.level === "error"
                                            ? "text-red-600"
                                            : item.level === "warn"
                                                ? "text-yellow-600"
                                                : "text-blue-600"
                                        }`}
                                >
                                    {item.level}
                                </span>

                                <span className="text-xs text-gray-400">
                                    {formatTimestamp(item.timestamp)}
                                </span>
                            </div>

                            {/* Message */}
                            <div className="text-gray-800 font-medium mb-3">
                                {item.message}
                            </div>


                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
