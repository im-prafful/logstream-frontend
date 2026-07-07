import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, AlertCircle, Activity, Clock, ArrowLeft, Layers, TrendingUp, Server } from 'lucide-react'
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts'

const ExploreClusters = () => {
  const [logsPerCluster, setLogsPerCluster] = useState([])
  const [expandedClusters, setExpandedClusters] = useState(new Set())
  const [clusterLogs, setClusterLogs] = useState({})
  const [clusterChartData, setClusterChartData] = useState({})
  const [loadingLogs, setLoadingLogs] = useState({})

  useEffect(() => {
    // Get data from navigation state
    const state = window.history.state?.usr
    if (state?.logsPerCluster) {
      console.log('Received cluster data:', state.logsPerCluster)
      setLogsPerCluster(state.logsPerCluster)
    }
  }, [])

  const formatTimestamp = (isoString) => {
    if (!isoString) return "-"
    const date = new Date(isoString)
    return date.toLocaleString('en-GB', { 
      year: 'numeric', month: '2-digit', day: '2-digit', 
      hour: '2-digit', minute: '2-digit', hour12: false 
    }).replace(',', '')
  }

  const fetchClusterLogs = async (clusterId) => {
    if (clusterLogs[clusterId]) return

    setLoadingLogs(prev => ({ ...prev, [clusterId]: true }))

    try {
      const token = localStorage.getItem("JWT")
      const response = await fetch(
        `https://9swlhzogxj.execute-api.ap-south-1.amazonaws.com/api/v1/clusters/${clusterId}/logs`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const data = await response.json()
      setClusterLogs(prev => ({
        ...prev,
        [clusterId]: data.logs || []
      }))
      setClusterChartData(prev => ({
        ...prev,
        [clusterId]: data.chartData || []
      }))
    } catch (err) {
      console.error(`Error fetching logs for cluster ${clusterId}:`, err)
    } finally {
      setLoadingLogs(prev => ({ ...prev, [clusterId]: false }))
    }
  }

  const toggleCluster = (clusterId) => {
    const newExpanded = new Set(expandedClusters)
    
    if (newExpanded.has(clusterId)) {
      newExpanded.delete(clusterId)
    } else {
      newExpanded.add(clusterId)
      fetchClusterLogs(clusterId)
    }
    
    setExpandedClusters(newExpanded)
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

  const isAnomalous = (logCount) => parseInt(logCount) > 100

  const totalLogs = logsPerCluster.reduce((sum, cluster) => 
    sum + parseInt(cluster.total_logs_per_cluster), 0
  )

  const processedClusters = logsPerCluster.filter(c => c.cluster_id !== null)
  const unprocessedData = logsPerCluster.find(c => c.cluster_id === null)
  const unprocessedCount = unprocessedData ? parseInt(unprocessedData.total_logs_per_cluster) : 0

  if (logsPerCluster.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading cluster data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Clean, Professional Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-5 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold text-sm">Dashboard</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">Explore Clusters</h1>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-700">
              Total Analyzed: <span className="font-bold text-blue-600 ml-1">{totalLogs}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-8 py-10">

        {/* Warning Banner for Unprocessed Logs */}
        {unprocessedCount > 0 && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-yellow-100 rounded-lg shrink-0 mt-1">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-yellow-800 mb-1">
                Processing Pipeline Active
              </h3>
              <p className="text-yellow-700 font-medium">
                <span className="font-bold text-yellow-900">{unprocessedCount} logs</span> are currently pending ML processing. The machine learning model runs in batches, so this graph is subject to change once they are processed.
              </p>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-10">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-400" />
            Cluster Details
          </h2>
          
          <div className="space-y-4">
            {processedClusters.map((cluster) => {
              const isExpanded = expandedClusters.has(cluster.cluster_id)
              const logs = clusterLogs[cluster.cluster_id] || []
              const chartData = clusterChartData[cluster.cluster_id] || []
              const isLoadingLogs = loadingLogs[cluster.cluster_id]
              const anomaly = isAnomalous(cluster.total_logs_per_cluster)

              return (
                <div
                  key={cluster.cluster_id}
                  className={`border rounded-xl overflow-hidden transition-all bg-white ${
                    anomaly ? 'border-red-200' : 'border-gray-200'
                  }`}
                >
                  <div
                    onClick={() => toggleCluster(cluster.cluster_id)}
                    className="p-5 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-gray-400">
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </div>
                      
                      <div className={`w-3 h-3 rounded-full ${anomaly ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-blue-500'}`}></div>
                      
                      <span className="font-semibold text-gray-800">
                        Cluster #{cluster.cluster_id}
                      </span>
                    </div>

                    <div className="text-sm font-medium text-gray-500">
                      <span className={anomaly ? 'text-red-600 font-bold' : 'text-gray-800 font-bold'}>
                        {cluster.total_logs_per_cluster}
                      </span> logs
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50 p-6">
                      {isLoadingLogs ? (
                        <div className="flex items-center justify-center py-6">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          
                          {/* Mini Line Chart */}
                          {chartData.length > 0 && (
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-48 mb-6">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                  <XAxis 
                                    dataKey="date" 
                                    hide={false} 
                                    tickFormatter={(val) => {
                                      const d = new Date(val);
                                      return `${d.getMonth()+1}/${d.getDate()}`;
                                    }}
                                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                                    axisLine={false}
                                    tickLine={false}
                                  />
                                  <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                                  />
                                  <Line 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke={anomaly ? '#ef4444' : '#3b82f6'} 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: anomaly ? '#ef4444' : '#3b82f6', strokeWidth: 0 }} 
                                    activeDot={{ r: 6 }} 
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          )}

                          <div className="space-y-3">
                          {logs.length === 0 ? (
                            <div className="text-center py-4 text-gray-400 text-sm">
                              No recent logs found in this cluster.
                            </div>
                          ) : (
                            logs.map((log) => (
                              <div
                                key={log.log_id}
                                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:border-blue-200 transition-colors"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className="text-[10px] font-bold uppercase px-2 py-1 rounded"
                                      style={{
                                        color: getLevelColor(log.level),
                                        backgroundColor: getLevelBgColor(log.level)
                                      }}
                                    >
                                      {log.level}
                                    </span>
                                    <span className="text-xs text-gray-400 font-mono">
                                      {log.log_id}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                    <Clock className="w-3 h-3" />
                                    {formatTimestamp(log.timestamp)}
                                  </div>
                                </div>
                                <div className="text-sm text-gray-700 font-mono leading-relaxed">
                                  {log.message}
                                </div>
                                {log.source && (
                                  <div className="mt-3 text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-md inline-block">
                                    SOURCE: {log.source}
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </main>
    </div>
  )
}

export default ExploreClusters