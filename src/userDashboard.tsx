import React, { useEffect, useState } from "react"
import { AlertCircle, TrendingUp, Layers, Activity, Clock, LogOut, List, Zap } from "lucide-react"

export const UserDisp = () => {
    const [logs, setLogs] = useState([])
    const [categoryLogs, setCategoryLogs] = useState([])
    const [logsPerCategory, setLogsPerCategory] = useState([])
    const [category, setCategory] = useState('error')
    const [loading, setLoading] = useState(true)

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
                setLogs(data.logs || [])
                setCategoryLogs(data.rows || [])
                setLogsPerCategory(data.logs_per_category || [])
                setLoading(false)
            } catch (err) {
                console.error("Fetch Error:", err)
                setLoading(false)
            }
        }

        fetchLogsFnc()
    }, [category])

    const handleLogout = () => {
        localStorage.removeItem("JWT")
        window.location.href = "/login"
    }

    const totalLogs = logsPerCategory.reduce((sum, cat) => sum + parseInt(cat.tc), 0)

    // --- SUB-COMPONENTS ---

    const CategoryStats = () => (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {logsPerCategory.map((cat, idx) => {
                const percentage = ((parseInt(cat.tc) / totalLogs) * 100).toFixed(1)
                return (
                    <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                                  style={{ color: getLevelColor(cat.lvl), backgroundColor: getLevelBgColor(cat.lvl) }}>
                                {cat.lvl}
                            </span>
                            <Activity className="w-4 h-4" style={{ color: getLevelColor(cat.lvl) }} />
                        </div>
                        <div className="text-3xl font-bold text-gray-800">{cat.tc}</div>
                        <div className="text-xs text-gray-400 mt-1">{percentage}% of total volume</div>
                    </div>
                )
            })}
        </div>
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
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600" /> Distribution
                </h3>
                <div className="flex flex-col items-center">
                    <div className="relative w-48 h-48 rounded-full shadow-inner mb-8"
                         style={{ background: `conic-gradient(${gradientSlices})` }}>
                        <div className="absolute inset-8 bg-white rounded-full flex flex-col items-center justify-center shadow-lg">
                            <span className="text-2xl font-black text-gray-800">{totalLogs}</span>
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Total Logs</span>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-2">
                        {logsPerCategory.map((cat, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getLevelColor(cat.lvl) }} />
                                <span className="text-xs font-medium text-gray-600 capitalize">{cat.lvl}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    const BarChart = () => {
        const maxCount = Math.max(...logsPerCategory.map(cat => parseInt(cat.tc)))
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" /> Comparison
                </h3>
                <div className="space-y-5">
                    {logsPerCategory.map((cat, idx) => (
                        <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-gray-600 uppercase">
                                <span>{cat.lvl}</span>
                                <span>{cat.tc}</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full transition-all duration-1000"
                                     style={{ width: `${(parseInt(cat.tc) / maxCount) * 100}%`, backgroundColor: getLevelColor(cat.lvl) }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-purple-600"></div>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-600 p-2 rounded-lg text-white"><Activity className="w-5 h-5" /></div>
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">LogAnalytics<span className="text-purple-600">Pro</span></h1>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-red-500 transition-colors">
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </header>

            <main className="max-w-7xl mx-auto px-6 mt-8">
                {/* 1. Global Stats */}
                <CategoryStats />

                {/* 2. Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    <div className="lg:col-span-1"><PieChart /></div>
                    <div className="lg:col-span-2"><BarChart /></div>
                </div>

                {/* 3. Latest Logs Grid (Top 3) */}
                <div className="mb-10">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" /> Recent Activity
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {logs.slice(0, 5).map((item, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:border-purple-200 transition-colors">
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
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Filter & Main Log Viewer (Grid Alternative to Table) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <List className="w-5 h-5 text-purple-600" />
                            <h2 className="text-lg font-bold text-gray-800 capitalize">{category} History (Top 30)</h2>
                        </div>
                        <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                            {logsPerCategory.map((cat, idx) => (
                                <option key={idx} value={cat.lvl}>{cat.lvl.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full">
                        {/* Custom Header */}
                        <div className="hidden md:grid grid-cols-[180px_120px_1fr] gap-4 px-6 py-3 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                            <div>Timestamp</div>
                            <div>Level</div>
                            <div>Message</div>
                        </div>
                        
                        {/* Main Feed Rows */}
                        <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-50">
                            {categoryLogs.map((log) => (
                                <div key={log.log_id} className="grid grid-cols-1 md:grid-cols-[180px_120px_1fr] gap-2 md:gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors">
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
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}