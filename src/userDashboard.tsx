import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, TrendingUp, Layers, Activity, Clock, LogOut, List, Zap, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const UserDisp = () => {
    const [logs, setLogs] = useState([])
    const [categoryLogs, setCategoryLogs] = useState([])
    const [logsPerCategory, setLogsPerCategory] = useState([])
    const [category, setCategory] = useState('error')
    const [loading, setLoading] = useState(true)
     const [logsPerCluster, setLogsPerCluster] = useState([]) 
    
    const navigate=useNavigate()

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

    useEffect(() => {
        const fetchLogsFnc = async () => {
            try {
                const token = localStorage.getItem("JWT") || "demo-token"
                const response = await fetch(
                    "https://9swlhzogxj.execute-api.ap-south-1.amazonaws.com/api/v1/logs",
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ level: category })
                    }
                )
                
                const data = await response.json()
                console.log(data)
                setLogs(data.logs || [])
                setCategoryLogs(data.rows || [])
                setLogsPerCategory(data.logs_per_category || [])
                setLogsPerCluster(data.logs_per_cluster || []) // ADD THIS
                setLoading(false)
            } catch (err) {
                console.error("Fetch Error:", err)
                setLoading(false)
            }
        }

        fetchLogsFnc()
    }, [category])

          const handleExploreClick = () => {
        navigate('/clustersExplore', { 
            state: { 
                logsPerCluster: logsPerCluster  // Pass this data
            } 
        })
    }


    const handleLogout = () => {
        localStorage.removeItem("JWT")
        window.location.href = "/login"
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

    // --- SUB-COMPONENTS ---

    const CategoryStats = () => (
        <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {logsPerCategory.map((cat, idx) => {
                const percentage = ((parseInt(cat.tc) / totalLogs) * 100).toFixed(1)
                return (
                    <motion.div 
                        key={idx} 
                        className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                                  style={{ color: getLevelColor(cat.lvl), backgroundColor: getLevelBgColor(cat.lvl) }}>
                                {cat.lvl}
                            </span>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <Activity className="w-4 h-4" style={{ color: getLevelColor(cat.lvl) }} />
                            </motion.div>
                        </div>
                        <motion.div 
                            className="text-3xl font-bold text-gray-800"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: idx * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                        >
                            {cat.tc}
                        </motion.div>
                        <div className="text-xs text-gray-400 mt-1">{percentage}% of total volume</div>
                    </motion.div>
                )
            })}
        </motion.div>
    )

    const PieChart = () => {
        let cumulativePercent = 0
        const gradientSlices = logsPerCategory.map(cat => {
            const percent = (parseInt(cat.tc) / totalLogs) * 100
            const start = cumulativePercent
            cumulativePercent += percent
            return `${getLevelColor(cat.lvl)} ${start}% ${cumulativePercent}%`
        }).join(', ')

        return (
            <motion.div 
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600" /> Distribution
                </h3>
                <div className="flex flex-col items-center">
                    <motion.div 
                        className="relative w-48 h-48 rounded-full shadow-inner mb-8"
                        style={{ background: `conic-gradient(${gradientSlices})` }}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 1, type: "spring" }}
                    >
                        <div className="absolute inset-8 bg-white rounded-full flex flex-col items-center justify-center shadow-lg">
                            <motion.span 
                                className="text-2xl font-black text-gray-800"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                {totalLogs}
                            </motion.span>
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Total Logs</span>
                        </div>
                    </motion.div>
                    <motion.div 
                        className="w-full grid grid-cols-2 gap-2"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {logsPerCategory.map((cat, idx) => (
                            <motion.div 
                                key={idx} 
                                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                                variants={itemVariants}
                                whileHover={{ backgroundColor: "#f3f4f6", scale: 1.05 }}
                            >
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getLevelColor(cat.lvl) }} />
                                <span className="text-xs font-medium text-gray-600 capitalize">{cat.lvl}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        )
    }

    const BarChart = () => {
        const maxCount = Math.max(...logsPerCategory.map(cat => parseInt(cat.tc)))
        return (
            <motion.div 
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" /> Comparison
                </h3>
                <div className="space-y-5">
                    {logsPerCategory.map((cat, idx) => (
                        <motion.div 
                            key={idx} 
                            className="space-y-1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <div className="flex justify-between text-xs font-bold text-gray-600 uppercase">
                                <span>{cat.lvl}</span>
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.1 + 0.3 }}
                                >
                                    {cat.tc}
                                </motion.span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full"
                                    style={{ backgroundColor: getLevelColor(cat.lvl) }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(parseInt(cat.tc) / maxCount) * 100}%` }}
                                    transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        )
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
                        className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold rounded-lg shadow-lg overflow-hidden"
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

                    <motion.button 
                        onClick={handleLogout} 
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-red-500 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </motion.button>
                </div>
            </motion.header>

            <main className="max-w-7xl mx-auto px-6 mt-8">
                {/* 1. Global Stats */}
                <CategoryStats />

                {/* 2. Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    <div className="lg:col-span-1"><PieChart /></div>
                    <div className="lg:col-span-2"><BarChart /></div>
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
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <List className="w-5 h-5 text-purple-600" />
                            <h2 className="text-lg font-bold text-gray-800 capitalize">{category} History (Top 30)</h2>
                        </div>
                        <motion.select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                            whileFocus={{ scale: 1.02 }}
                        >
                            {logsPerCategory.map((cat, idx) => (
                                <option key={idx} value={cat.lvl}>{cat.lvl.toUpperCase()}</option>
                            ))}
                        </motion.select>
                    </div>

                    <div className="w-full">
                        <div className="hidden md:grid grid-cols-[180px_120px_1fr] gap-4 px-6 py-3 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                            <div>Timestamp</div>
                            <div>Level</div>
                            <div>Message</div>
                        </div>
                        
                        <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-50">
                            <AnimatePresence>
                                {categoryLogs.map((log, idx) => (
                                    <motion.div 
                                        key={log.log_id} 
                                        className="grid grid-cols-1 md:grid-cols-[180px_120px_1fr] gap-2 md:gap-4 px-6 py-4 items-center cursor-pointer"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: idx * 0.03 }}
                                        whileHover={{ 
                                            backgroundColor: "rgba(0,0,0,0.02)",
                                            x: 4
                                        }}
                                    >
                                        <div className="text-xs font-mono text-gray-400">
                                            {formatTimestamp(log.timestamp)}
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md"
                                                  style={{ color: getLevelColor(log.level), backgroundColor: getLevelBgColor(log.level) }}>
                                                {log.level}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-700 font-medium leading-relaxed">
                                            {log.message}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}