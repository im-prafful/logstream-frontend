import React, { useEffect, useState } from 'react'
import { Eye, Plus, ArrowLeft, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'

type ActiveTab = 'view' | 'create'
type IncidentStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'open' | 'in_progress' | 'resolved'

interface Incident {
  incident_id: string
  cluster_id: number
  status: IncidentStatus
  assigned_role: string
  assigned_to: string
  created_at: string
  updated_at: string
  resolved_at: string | null
}

const View_Incidents = () => {
  const navigate = useNavigate()
  const { token, user } = useAuth()

  const [activeTab, setActiveTab] = useState<ActiveTab>('view')
  const [showMyIncidents, setShowMyIncidents] = useState(false)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [isViewing, setIsViewing] = useState(false)
  const [viewError, setViewError] = useState('')
  const [createError, setCreateError] = useState('')
  const [createSuccess, setCreateSuccess] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const [createForm, setCreateForm] = useState({
    cid: -1,
    role: 'sre',
    assigned_to: ''
  })

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setCreateForm(prev => ({
      ...prev,
      [name]: name === 'cid' ? Number(value) : value
    }))
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError('')
    setCreateSuccess('')

    if (!token) {
      setCreateError('Authentication token missing. Please login again.')
      return
    }

    if (!Number.isFinite(createForm.cid) || createForm.cid <= 0) {
      setCreateError('Enter a valid cluster ID.')
      return
    }

    const assignedRole = createForm.role.trim().toLowerCase() || 'sre'
    const assignedTo = createForm.assigned_to.trim()

    try {
      setIsCreating(true)
      const payload = {
        cluster_id: createForm.cid,
        assigned_role: assignedRole,
        assigned_to: assignedTo || null
      }

      const response = await axios.post(
        'https://9swlhzogxj.execute-api.ap-south-1.amazonaws.com/api/v1/incidents',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const created = response?.data?.data ?? response?.data
      if (created && created.incident_id) {
        setIncidents(prev => [created as Incident, ...prev])
      }

      setCreateSuccess('Incident created successfully.')
      setCreateForm({
        cid: -1,
        role: 'sre',
        assigned_to: ''
      })
    } catch (e: any) {
      setCreateError(
        e?.response?.data?.message || 'Failed to create incident. Please try again.'
      )
    } finally {
      setIsCreating(false)
    }

  }

  const handleViewInc = async () => {
    if (!token) {
      setViewError('Authentication token missing. Please login again.')
      return
    }

    try {
      setIsViewing(true)
      setViewError('')

      // role is embedded in JWT, so only Bearer token is required
      const response = await axios.get(
        'https://9swlhzogxj.execute-api.ap-south-1.amazonaws.com/api/v1/incidents',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log(response.data)

      
      const rows =
        response?.data?.incidents ??
        response?.data?.data ??
        response?.data ??
        []
      const mappedIncidents: Incident[] = Array.isArray(rows)
        ? rows.map((row: any) => ({
            incident_id: String(row?.incident_id ?? ''),
            cluster_id: Number(row?.cluster_id ?? 0),
            status: (row?.status ?? 'NEW') as IncidentStatus,
            assigned_role: String(row?.assigned_role ?? ''),
            assigned_to: String(row?.assigned_to ?? ''),
            created_at: String(row?.created_at ?? ''),
            updated_at: row?.updated_at ? String(row.updated_at) : '',
            resolved_at: row?.resolved_at ? String(row.resolved_at) : null
          }))
        : []

      setIncidents(mappedIncidents)
    } catch (e: any) {
      setViewError(
        e?.response?.data?.message || 'Failed to fetch incidents. Please try again.'
      )
    } finally {
      setIsViewing(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'view') {
      handleViewInc()
      const sessionStorageData=JSON.parse(sessionStorage.getItem('Current Incident'))
      setSelectedIncident(sessionStorageData)
    }
  }, [activeTab, token])

  const getStatusPillClasses = (status: string) => {
    const normalized = status.toLowerCase()
    if (normalized === 'new' || normalized === 'open') {
      return 'bg-amber-100 text-amber-800 border border-amber-200'
    }
    if (normalized === 'in_progress') {
      return 'bg-blue-100 text-blue-800 border border-blue-200'
    }
    if (normalized === 'resolved') {
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200'
    }
    return 'bg-gray-100 text-gray-700 border border-gray-200'
  }

  const formatDateTime = (value: string | null) => {
    if (!value) return 'Not available'
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return value
    return parsed.toLocaleString()
  }

  const displayedIncidents = showMyIncidents 
    ? incidents.filter(inc => inc.assigned_to === user?.user_id)
    : incidents;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,#e0f2fe_0%,#f8fafc_40%,#eef2ff_100%)] pb-20">

      {/* Header */}
      <header className="backdrop-blur-md bg-white/80 border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/userDashboard')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 text-white">
            <AlertCircle className="w-5 h-5" />
          </div>

          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Incident<span className="text-red-500">Hub</span>
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8">

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 p-1.5 bg-white/80 border border-gray-200 shadow-sm rounded-xl">

            <button
              onClick={() => setActiveTab('view')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'view'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'
                }`}
            >
              <Eye className="w-4 h-4" />
              View Incidents
            </button>

            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'
                }`}
            >
              <Plus className="w-4 h-4" />
              Create Incident
            </button>

          </div>
        </div>



        {/* View Tab */}
        {activeTab === 'view' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 bg-white border rounded-xl shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Incident List</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">My Incidents Only</span>
                  <button 
                    onClick={() => setShowMyIncidents(!showMyIncidents)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${showMyIncidents ? 'bg-blue-600' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showMyIncidents ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              {isViewing && (
                <p className="text-sm text-gray-500 mb-4">Loading incidents...</p>
              )}

              {viewError && (
                <p className="text-sm text-red-600 mb-4">{viewError}</p>
              )}

              {!isViewing && displayedIncidents.length === 0 ? (
                <p className="text-gray-400 py-10 text-center">
                  No incidents found.
                </p>
              ) : (
                <div className="space-y-3">
                  {displayedIncidents.map((incident) => (
                    <div
                      key={incident.incident_id}
                      className="rounded-xl p-4 md:p-5 flex items-center justify-between gap-4 border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
                    >
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Incident ID</p>
                        <p className="font-semibold text-gray-900 truncate text-xl">{incident.incident_id}</p>
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-gray-600 font-medium">Cluster #{incident.cluster_id}</span>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusPillClasses(incident.status)}`}>
                            {incident.status}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedIncident(incident)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold cursor-pointer transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Incident Details</h2>

              {!selectedIncident ? (
                <p className="text-gray-400 py-10 text-center">Select an incident to view details.</p>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Incident ID</p>
                    <p className="font-semibold text-slate-900 break-all">{selectedIncident.incident_id}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <p><span className="font-semibold text-gray-700">Cluster ID:</span> {selectedIncident.cluster_id}</p>
                    <p>
                      <span className="font-semibold text-gray-700">Status:</span>{' '}
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusPillClasses(selectedIncident.status)}`}>
                        {selectedIncident.status}
                      </span>
                    </p>
                    <p><span className="font-semibold text-gray-700">Assigned Role:</span> {selectedIncident.assigned_role || 'N/A'}</p>
                    <p><span className="font-semibold text-gray-700">Assigned To:</span> {selectedIncident.assigned_to || 'Unassigned'}</p>
                    <p><span className="font-semibold text-gray-700">Created At:</span> {formatDateTime(selectedIncident.created_at)}</p>
                    <p><span className="font-semibold text-gray-700">Updated At:</span> {formatDateTime(selectedIncident.updated_at)}</p>
                    <p><span className="font-semibold text-gray-700">Resolved At:</span> {formatDateTime(selectedIncident.resolved_at)}</p>
                  </div>
                  <button
                    onClick={() => { 
                      sessionStorage.setItem('Current Incident',JSON.stringify(selectedIncident))
                      console.log(`${selectedIncident.incident_id}`)
                      navigate('/editInc',{state:{id:selectedIncident.incident_id}}) 

                    }}
                    className="mt-2 w-full inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg active:scale-[0.98] cursor-pointer"
                  >
                    Edit Incident
                  </button>
                </div>
                
              )}
            </section>
          </div>
        )}




        {/* Create Tab */}
        {activeTab === 'create' && (
          <div className="flex justify-center">
            <form
              onSubmit={handleCreateSubmit}
              className="flex flex-col gap-5 w-full max-w-md bg-white p-6 rounded-xl shadow-sm border"
            >

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">
                  Anomalous Cluster ID
                </label>
                <input
                  type="number"
                  name="cid"
                  required
                  value={createForm.cid}
                  onChange={handleCreateChange}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">
                  Assignment Group
                </label>
                <input
                  type="text"
                  name="role"
                  required
                  value={createForm.role}
                  onChange={handleCreateChange}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">
                  Assigned To
                </label>
                <input
                  type="text"
                  name="assigned_to"
                  value={createForm.assigned_to}
                  onChange={handleCreateChange}
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="mt-2 bg-green-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2 rounded-lg transition-all cursor-pointer"
              >
                {isCreating ? 'Creating...' : 'Create Incident'}
              </button>

              {createError && (
                <p className="text-sm text-red-600">{createError}</p>
              )}

              {createSuccess && (
                <p className="text-sm text-emerald-700">{createSuccess}</p>
              )}

            </form>
          </div>
        )}

      </main>
    </div>
  )
}

export default View_Incidents
