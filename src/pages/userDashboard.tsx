import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Activity, Clock, LogOut, List, Zap, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../hooks/useAuth"
import CategoryStats from "../Components/CategoryStats"
import PieChart from "../Components/PieChart"
import BarChart from "../Components/BarChart"

export const UserDisp = () => {
    const [logs, setLogs] = useState([])
    const [categoryLogs, setCategoryLogs] = useState([])
    const [logsPerCategory, setLogsPerCategory] = useState([])
    const [loading, setLoading] = useState(true)
    const [logsPerCluster, setLogsPerCluster] = useState([])
    const [subscribeEmail, setSubscribeEmail] = useState("")
    const [isSubscribing, setIsSubscribing] = useState(false)

    const navigate = useNavigate()
    const {user}=useAuth()
    //console.log(user)

    const [filterParams, setFilterParams] = useState({
        lvl: '',
        timestamp: ''
    })

    const handleFilterChange = (e) => {
        const { name, value } = e.target

        setFilterParams(prev => ({
            ...prev,
            [name]: value
        }))
    }


    const handlefiltersubmit = async () => {
        const token = localStorage.getItem("JWT")

        try {
            if (!filterParams.lvl && !filterParams.timestamp) {
                alert('At least 1 param is required for filtering')
                return
            }
            const payloadToSend = {
                ...filterParams,
                timestamp: filterParams.timestamp
                    ? Number(filterParams.timestamp)
                    : undefined
            }
            console.log(payloadToSend)
            const response = await axios.post(
                'https://9swlhzogxj.execute-api.ap-south-1.amazonaws.com/api/v1/category_logs',
                {
                    payload: payloadToSend
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            )

            console.log(response.data)
            setCategoryLogs(response.data.logs)
        } catch (e) {
            console.error(e)
            alert('Something went wrong')
        }
    }

    const formatTimestamp = (isoString) => {
        if (!isoString) return "-"
        const date = new Date(isoString)
        return date.toLocaleString('en-GB', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hour12: false
        }).replace(',', '')
    }

    const getLevelColor = (level) => {
        const colors = {
            error: '#ef4444',
            warning: '#f59e0b',
            information: '#3b82f6',
            debug: '#8b5cf6'
        }
        return colors[level?.toLowerCase()] || '#6b7280'
    }

    const getLevelBgColor = (level) => {
        const colors = {
            error: '#fee2e2',
            warning: '#fef3c7',
            information: '#dbeafe',
            debug: '#ede9fe'
        }
        return colors[level?.toLowerCase()] || '#f3f4f6'
    }

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!subscribeEmail) return;
        
        setIsSubscribing(true);
        const token = localStorage.getItem("JWT");
        try {
            await axios.post(
                'https://9swlhzogxj.execute-api.ap-south-1.amazonaws.com/subscribe',
                { emailAddress: subscribeEmail },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Subscription request sent! Please check your email to confirm.");
            setSubscribeEmail("");
        } catch (error) {
            console.error("Subscribe Error:", error);
            alert("Failed to subscribe. Please try again.");
        } finally {
            setIsSubscribing(false);
        }
    };

    useEffect(() => {
        const fetchLogsFnc = async () => {
            try {
                const token = localStorage.getItem("JWT")

                const response = await axios.get(
                    "https://9swlhzogxj.execute-api.ap-south-1.amazonaws.com/api/v1/logs",
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                )

                console.log(response.data)
                setLogs(response.data.logs || [])
                setLogsPerCategory(response.data.logs_per_category || [])
                setLogsPerCluster(response.data.logs_per_cluster || [])
                setLoading(false)

            } catch (err) {
                console.error("Fetch Error:", err)
                setLoading(false)
            }
        }

        fetchLogsFnc()
    }, [])

    const handleExploreClick = () => {
        navigate('/clustersExplore', {
            state: {
                logsPerCluster: logsPerCluster  // Pass this data
            }
        })
    }




    const totalLogs = logsPerCategory.reduce((sum, cat) => sum + parseInt(cat.tc), 0)

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100 }
        }
    }

    const cardHoverVariants = {
        rest: { scale: 1, y: 0 },
        hover: {
            scale: 1.02,
            y: -4,
            transition: { type: "spring", stiffness: 400, damping: 10 }
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <motion.div
                className="rounded-full h-10 w-10 border-t-2 border-purple-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </div>
    )

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            {/* Header */}
            <motion.header
                className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
            >
                <div className="flex items-center gap-3">
                    <motion.div
                        className="bg-purple-600 p-2 rounded-lg text-white"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Activity className="w-5 h-5" />
                    </motion.div>
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                        LogAnalytics<span className="text-purple-600">Pro</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    {/* Explore Clusters Button */}
                    <motion.button
                        onClick={handleExploreClick}
                        className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold rounded-lg shadow-lg overflow-hidden cursor-pointer"
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(124, 58, 237, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-white"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                            style={{ opacity: 0.2 }}
                        />
                        <Sparkles className="w-4 h-4" />
                        <span>Explore Clusters</span>
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [1, 0.8, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-2 h-2 bg-yellow-300 rounded-full"
                        />
                    </motion.button>

                    {/*Manage incidents button*/}
                    <motion.button
                        onClick={() => navigate('/incidents')}
                        className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold rounded-lg shadow-lg overflow-hidden cursor-pointer"
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(239, 68, 68, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-white"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                            style={{ opacity: 0.2 }}
                        />
                        <AlertCircle className="w-4 h-4" />
                        <span>Manage Incidents</span>
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [1, 0.6, 1]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-2 h-2 bg-yellow-300 rounded-full"
                        />
                    </motion.button>

                    <motion.button
                        onClick={() => navigate('/about')}
                        className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-bold rounded-lg shadow-lg overflow-hidden cursor-pointer"
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(37, 99, 235, 0.35)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-white"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                            style={{ opacity: 0.2 }}
                        />
                        <span>About</span>
                    </motion.button>



                </div>
            </motion.header>
            <div className="max-w-7xl mx-auto px-6 mt-6">
                <div className="inline-flex items-center gap-4 rounded-2xl border border-indigo-100 bg-white px-4 py-3 shadow-md">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-black text-lg flex items-center justify-center shadow-sm">
                        {(user?.full_name?.[0] || "U").toUpperCase()}
                    </div>

                    <div className="leading-tight">
                        <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Signed in as</p>
                        <p className="font-bold text-slate-900 text-2xl">{user?.full_name || "User"}</p>
                    </div>

                    <span className="ml-1 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                        {user?.role || "guest"}
                    </span>
                </div>
            </div>


            <main className="max-w-7xl mx-auto px-6 mt-8">
                {/* 1. Global Stats */}
                <CategoryStats
                    logsPerCategory={logsPerCategory}
                    totalLogs={totalLogs}
                    getLevelColor={getLevelColor}
                    getLevelBgColor={getLevelBgColor}
                    containerVariants={containerVariants}
                    itemVariants={itemVariants}
                />

                {/* 2. Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    <div className="lg:col-span-1">
                        <PieChart
                            logsPerCategory={logsPerCategory}
                            totalLogs={totalLogs}
                            getLevelColor={getLevelColor}
                            containerVariants={containerVariants}
                            itemVariants={itemVariants}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <BarChart
                            logsPerCategory={logsPerCategory}
                            getLevelColor={getLevelColor}
                        />
                    </div>
                </div>

                {/* 3. Latest Logs Grid (Top 5) */}
                <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" /> Recent Activity
                    </h2>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {logs.slice(0, 5).map((item, idx) => (
                            <motion.div
                                key={idx}
                                className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm cursor-pointer"
                                variants={itemVariants}
                                initial="rest"
                                whileHover="hover"
                                custom={cardHoverVariants}
                                whileHover={{
                                    borderColor: getLevelColor(item.level),
                                    boxShadow: `0 10px 30px ${getLevelColor(item.level)}20`
                                }}
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                                        style={{ color: getLevelColor(item.level), backgroundColor: getLevelBgColor(item.level) }}>
                                        {item.level}
                                    </span>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                        <Clock className="w-3 h-3" /> {formatTimestamp(item.timestamp)}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 font-medium line-clamp-3">{item.message}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* 4. Filter & Main Log Viewer */}
                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white">

                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-50">
                                <List className="w-5 h-5 text-purple-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800 capitalize">
                                Master Log Ledger <span className="text-gray-400 font-medium">(Top 20)</span>
                            </h2>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                            <motion.select
                                name="timestamp"
                                value={filterParams.timestamp}
                                onChange={handleFilterChange}
                                className="min-w-[140px] bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2.5
                                        text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                                        hover:bg-gray-100 transition-all"
                                whileFocus={{ scale: 1.02 }}
                            >
                                <option value="">Time Period</option>
                                <option value="7">Last 7 days</option>
                                <option value="30">Last 30 days</option>
                            </motion.select>


                            <motion.select
                                name="lvl"
                                value={filterParams.lvl}
                                onChange={handleFilterChange}
                                className="min-w-[140px] bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2.5
             text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500
             hover:bg-gray-100 transition-all"
                                whileFocus={{ scale: 1.02 }}
                            >
                                <option value="">Log Level</option>
                                {logsPerCategory.map((item, idx) => (
                                    <option key={idx}>
                                        {item.lvl}
                                    </option>
                                ))}
                            </motion.select>


                            <button
                                className="px-5 py-2.5 rounded-lg bg-purple-600 text-white text-sm font-medium
                 hover:bg-purple-700 active:scale-95 transition-all shadow-sm"
                                onClick={handlefiltersubmit}
                            >
                                Apply filters
                            </button>

                        </div>
                    </div>

                    <div className="w-full">
                        {/* Header */}
                        <div className="hidden md:grid grid-cols-[180px_120px_1fr_160px] gap-4 px-6 py-3 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                            <div>Timestamp</div>
                            <div>Level</div>
                            <div>Message</div>
                            <div>Source</div>
                        </div>

                        {/* Logs */}
                        <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-50">
                            <AnimatePresence>
                                {categoryLogs && categoryLogs.length > 0 ? (
                                    categoryLogs.map((log, idx) => (
                                        <motion.div
                                            key={log.log_id}
                                            className="grid grid-cols-1 md:grid-cols-[180px_120px_1fr_160px] gap-2 md:gap-4 px-6 py-4 items-center cursor-pointer"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: idx * 0.03 }}
                                            whileHover={{
                                                backgroundColor: "rgba(0,0,0,0.02)",
                                                x: 4,
                                            }}
                                        >
                                            {/* Timestamp */}
                                            <div className="text-xs font-mono text-gray-400">
                                                {formatTimestamp(log.timestamp)}
                                            </div>

                                            {/* Level */}
                                            <div>
                                                <span
                                                    className="text-[10px] font-bold uppercase px-2 py-1 rounded-md"
                                                    style={{
                                                        color: getLevelColor(log.level),
                                                        backgroundColor: getLevelBgColor(log.level),
                                                    }}
                                                >
                                                    {log.level}
                                                </span>
                                            </div>

                                            {/* Message */}
                                            <div className="text-sm text-gray-700 font-medium leading-relaxed">
                                                {log.message}
                                            </div>

                                            {/* Source */}
                                            <div>
                                                <span className="inline-block max-w-full truncate rounded-md bg-gray-100 px-2 py-1 text-[10px] font-mono text-gray-600">
                                                    {log.source}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="px-6 py-8 text-center text-gray-400 text-sm"
                                    >
                                        No Logs Found
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>


                </motion.div>
            </main>

            <div className="mt-14">
                <form
                    onSubmit={handleSubscribe}
                    className="w-full max-w-md mx-auto bg-white p-5 rounded-2xl shadow-lg border border-gray-200"
                >
                    {/* Top Text */}
                    <p className="text-sm font-semibold text-gray-700 mb-4 ml-6">
                        Subscribe to receive email-alerts
                    </p>

                    {/* Input + Button Row */}
                    <div className="flex items-center gap-4">
                        <input
                            type="email"
                            value={subscribeEmail}
                            onChange={(e) => setSubscribeEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            required
                        />

                        <button
                            type="submit"
                            disabled={isSubscribing}
                            className={`font-bold px-6 py-2 rounded-lg transition-all shadow-md ${
                                isSubscribing 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 active:scale-95 shadow-blue-200'
                            }`}
                        >
                            {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
