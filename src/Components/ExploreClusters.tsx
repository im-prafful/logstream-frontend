import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, AlertCircle, Activity, Clock, ArrowLeft, Layers, TrendingUp } from 'lucide-react'

const ExploreClusters = () => {
  const [logsPerCluster, setLogsPerCluster] = useState([])
  const [expandedClusters, setExpandedClusters] = useState(new Set())
  const [clusterLogs, setClusterLogs] = useState({})
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

  // Determine if cluster is anomalous (e.g., if log count > 100)
  const isAnomalous = (logCount) => {
    return parseInt(logCount) > 100
  }

  // Get cloud size based on log count
  const getCloudSize = (logCount) => {
    const count = parseInt(logCount)
    if (count > 200) return 'cloud-xl'
    if (count > 100) return 'cloud-lg'
    if (count > 50) return 'cloud-md'
    return 'cloud-sm'
  }

  // Get random position for clouds
  const getCloudStyle = (index, total) => {
    const positions = [
      { top: '10%', left: '5%' },
      { top: '15%', left: '30%' },
      { top: '8%', left: '60%' },
      { top: '30%', left: '15%' },
      { top: '35%', left: '70%' },
      { top: '50%', left: '10%' },
      { top: '55%', left: '45%' },
      { top: '52%', left: '80%' },
      { top: '70%', left: '25%' },
      { top: '75%', left: '65%' },
      { top: '20%', left: '85%' },
      { top: '65%', left: '5%' },
    ]
    return positions[index % positions.length]
  }

  const totalLogs = logsPerCluster.reduce((sum, cluster) => 
    sum + parseInt(cluster.total_logs_per_cluster), 0
  )

  if (logsPerCluster.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cluster data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-5 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Dashboard</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <Layers className="w-6 h-6 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-800">Cluster Universe</h1>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm">
              <span className="text-gray-500">Total Logs: </span>
              <span className="font-bold text-purple-600 text-lg">{totalLogs}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="font-semibold text-green-700">Normal</span>
              </div>
              <div className="flex items-center gap-2 bg-red-100 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="font-semibold text-red-700">Anomaly</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Cloud Visualization */}
      <div className="relative min-h-[600px] overflow-hidden py-12">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-xl font-bold text-gray-700 mb-8 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Cluster Map - {logsPerCluster.length} Active Clusters
          </h2>
          
          <div className="relative w-full h-[500px]">
            {logsPerCluster.map((cluster, idx) => {
              const style = getCloudStyle(idx, logsPerCluster.length)
              const size = getCloudSize(cluster.total_logs_per_cluster)
              const anomaly = isAnomalous(cluster.total_logs_per_cluster)
              
              return (
                <div
                  key={cluster.cluster_id}
                  className={`absolute cloud ${size} cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10`}
                  style={style}
                  onClick={() => toggleCluster(cluster.cluster_id)}
                >
                  <div className={`cloud-content ${anomaly ? 'cloud-anomaly' : 'cloud-normal'}`}>
                    <div className="text-center">
                      <div className="text-3xl font-black text-gray-700 mb-1">
                        #{cluster.cluster_id}
                      </div>
                      <div className="text-xs font-bold text-gray-500 uppercase">
                        {cluster.total_logs_per_cluster} logs
                      </div>
                      {anomaly && (
                        <div className="mt-2 flex justify-center">
                          <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Detailed List View */}
      <div className="max-w-7xl mx-auto px-8 pb-12">
        <h2 className="text-xl font-bold text-gray-700 mb-6">Detailed Cluster Analysis</h2>
        <div className="space-y-3">
          {logsPerCluster.map((cluster) => {
            const isExpanded = expandedClusters.has(cluster.cluster_id)
            const logs = clusterLogs[cluster.cluster_id] || []
            const isLoadingLogs = loadingLogs[cluster.cluster_id]
            const anomaly = isAnomalous(cluster.total_logs_per_cluster)

            return (
              <div
                key={cluster.cluster_id}
                className={`border-2 rounded-xl overflow-hidden transition-all bg-white ${
                  anomaly ? 'border-red-300 bg-red-50/30' : 'border-green-300 bg-green-50/30'
                }`}
              >
                <div
                  onClick={() => toggleCluster(cluster.cluster_id)}
                  className="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}

                      <div className={`w-4 h-4 rounded-full ${anomaly ? 'bg-red-500' : 'bg-green-500'}`}></div>

                      <span className="font-mono text-lg font-bold text-gray-700">
                        Cluster #{cluster.cluster_id}
                      </span>

                      {anomaly && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          HIGH VOLUME
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="w-4 h-4 text-gray-500" />
                        <span className="font-bold text-gray-700 text-lg">{cluster.total_logs_per_cluster}</span>
                        <span className="text-gray-500">logs today</span>
                      </div>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50/50">
                    {isLoadingLogs ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      </div>
                    ) : (
                      <div className="p-5 space-y-3">
                        {logs.length === 0 ? (
                          <div className="text-center py-4 text-gray-500">
                            Click to load top 10 logs from this cluster
                          </div>
                        ) : (
                          logs.map((log) => (
                            <div
                              key={log.log_id}
                              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="text-xs font-bold uppercase px-2 py-1 rounded"
                                    style={{
                                      color: getLevelColor(log.level),
                                      backgroundColor: getLevelBgColor(log.level)
                                    }}
                                  >
                                    {log.level}
                                  </span>
                                  <span className="text-xs text-gray-500 font-mono">
                                    ID: {log.log_id}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  {formatTimestamp(log.timestamp)}
                                </div>
                              </div>
                              <div className="text-sm text-gray-800 font-mono">
                                {log.message}
                              </div>
                              {log.source && (
                                <div className="mt-2 text-xs text-gray-500">
                                  Source: {log.source}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        .cloud {
          animation: float 6s ease-in-out infinite;
        }

        .cloud-sm {
          width: 120px;
          height: 80px;
        }

        .cloud-md {
          width: 150px;
          height: 100px;
        }

        .cloud-lg {
          width: 180px;
          height: 120px;
        }

        .cloud-xl {
          width: 220px;
          height: 140px;
        }

        .cloud-content {
          width: 100%;
          height: 100%;
          border-radius: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .cloud-normal {
          background: linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%);
          border: 3px solid #bae6fd;
        }

        .cloud-anomaly {
          background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%);
          border: 3px solid #fca5a5;
          animation: pulse-red 2s ease-in-out infinite;
        }

        .cloud:hover .cloud-content {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes pulse-red {
          0%, 100% {
            box-shadow: 0 10px 40px rgba(239, 68, 68, 0.2);
          }
          50% {
            box-shadow: 0 10px 40px rgba(239, 68, 68, 0.4);
          }
        }

        .cloud:nth-child(2n) {
          animation-delay: 1s;
        }

        .cloud:nth-child(3n) {
          animation-delay: 2s;
        }

        .cloud:nth-child(4n) {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  )
}

export default ExploreClusters