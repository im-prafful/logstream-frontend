import React, { useState } from 'react'
import { Eye, Plus, Trash2, ArrowLeft, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type ActiveTab = 'view' | 'create' | 'delete'

const View_Incidents = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<ActiveTab>('view')

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">

      {/* ── Header ── */}
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

        {/* ── Action Tabs ── */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 p-1.5 bg-gray-100/80 rounded-xl">

            <button
              onClick={() => setActiveTab('view')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${activeTab === 'view'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'
                }`}
            >
              <Eye className="w-4 h-4" />
              View Incidents
            </button>

            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${activeTab === 'create'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'
                }`}
            >
              <Plus className="w-4 h-4" />
              Create Incident
            </button>

            <button
              onClick={() => setActiveTab('delete')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${activeTab === 'delete'
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'
                }`}
            >
              <Trash2 className="w-4 h-4" />
              Delete Incident
            </button>

          </div>
        </div>

        {/* ── Tab Content ── */}

        {activeTab === 'view' && (
          <div>
            {/* Your view / list logic goes here */}
            <p className="text-center text-gray-400 py-20">View panel — add your logic here</p>
          </div>
        )}

        {activeTab === 'create' && (
          <div>
            {/* Your create form logic goes here */}
            <p className="text-center text-gray-400 py-20">Create panel — add your logic here</p>
          </div>
        )}

        {activeTab === 'delete' && (
          <div>
            {/* Your delete logic goes here */}
            <p className="text-center text-gray-400 py-20">Delete panel — add your logic here</p>
          </div>
        )}

      </main>
    </div>
  )
}

export default View_Incidents
