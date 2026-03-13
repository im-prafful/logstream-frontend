import React, { useState } from 'react'
import { Eye, Plus, Trash2, ArrowLeft, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'

type ActiveTab = 'view' | 'create' | 'delete'
type IncidentStatus = 'open' | 'in_progress' | 'resolved'

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
  const { token } = useAuth()

  const [activeTab, setActiveTab] = useState<ActiveTab>('view')
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [deleteIncidentId, setDeleteIncidentId] = useState('')
  const [deleteError, setDeleteError] = useState('')
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

  const handleDeleteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDeleteError('')

    const normalizedId = deleteIncidentId.trim()
    if (!normalizedId) {
      setDeleteError('Incident ID is required.')
      return
    }

    const exists = incidents.some(incident => incident.incident_id === normalizedId)
    if (!exists) {
      setDeleteError('Incident not found.')
      return
    }

    setIncidents(prev => prev.filter(incident => incident.incident_id !== normalizedId))
    if (selectedIncident?.incident_id === normalizedId) {
      setSelectedIncident(null)
    }
    setDeleteIncidentId('')
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
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
          <div className="flex items-center gap-2 p-1.5 bg-gray-100/80 rounded-xl">

            <button
              onClick={() => setActiveTab('view')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'view'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
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

            <button
              onClick={() => setActiveTab('delete')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'delete'
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'
                }`}
            >
              <Trash2 className="w-4 h-4" />
              Delete Incident
            </button>

          </div>
        </div>

        {/* View Tab */}
        {activeTab === 'view' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 bg-white border rounded-xl shadow-sm p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Incident List</h2>

              {incidents.length === 0 ? (
                <p className="text-gray-400 py-10 text-center">
                  No incidents found.
                </p>
              ) : (
                <div className="space-y-3">
                  {incidents.map((incident) => (
                    <div
                      key={incident.incident_id}
                      className="border rounded-lg p-4 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-gray-500">Incident ID</p>
                        <p className="font-semibold text-gray-800 truncate">{incident.incident_id}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Cluster #{incident.cluster_id} � Status: {incident.status}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedIncident(incident)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white border rounded-xl shadow-sm p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Incident Details</h2>

              {!selectedIncident ? (
                <p className="text-gray-400 py-10 text-center">Select an incident to view details.</p>
              ) : (
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold text-gray-700">Incident ID:</span> {selectedIncident.incident_id}</p>
                  <p><span className="font-semibold text-gray-700">Cluster ID:</span> {selectedIncident.cluster_id}</p>
                  <p><span className="font-semibold text-gray-700">Status:</span> {selectedIncident.status}</p>
                  <p><span className="font-semibold text-gray-700">Assigned Role:</span> {selectedIncident.assigned_role}</p>
                  <p><span className="font-semibold text-gray-700">Assigned To:</span> {selectedIncident.assigned_to || 'Unassigned'}</p>
                  <p><span className="font-semibold text-gray-700">Created At:</span> {selectedIncident.created_at}</p>
                  <p><span className="font-semibold text-gray-700">Updated At:</span> {selectedIncident.updated_at}</p>
                  <p><span className="font-semibold text-gray-700">Resolved At:</span> {selectedIncident.resolved_at || 'Not resolved'}</p>
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

        {/* Delete Tab */}
        {activeTab === 'delete' && (
          <div className="flex justify-center">
            <form
              onSubmit={handleDeleteSubmit}
              className="flex flex-col gap-4 w-full max-w-md bg-white p-6 rounded-xl shadow-sm border"
            >
              <h2 className="text-lg font-semibold text-gray-800">Delete Incident</h2>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">
                  Incident ID
                </label>
                <input
                  type="text"
                  value={deleteIncidentId}
                  onChange={(e) => setDeleteIncidentId(e.target.value)}
                  placeholder="Enter incident UUID"
                  className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {deleteError && (
                <p className="text-sm text-red-600">{deleteError}</p>
              )}

              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-all cursor-pointer"
              >
                Delete Incident
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  )
}

export default View_Incidents
