import React, { useEffect, useState, type ChangeEvent } from "react";
import { ArrowLeft, FilePenLine } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const EditIncidents = () => {
  const navigate = useNavigate();
  const location = useLocation()
  let incid  = location.state.id
  const {token} = useAuth()


  const [formData, setFormData] = useState({
    state: "",
    role: "",
    assigned_to: "",
    message: ""
  })

  useEffect(() => {
    const fetchInc = async () => {
      try {
        const response = await axios.get(
          `https://9swlhzogxj.execute-api.ap-south-1.amazonaws.com/api/v1/incident/${incid}`,
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        );

        const data = response.data;
        console.log(response.data)
        if (!data) {
          // fallback default
          setFormData({
            state: "New",
            role: "Sre",
            assigned_to: "",
            message: "",
          });
        } else {
          // populate from API (adjust fields based on your API)
          setFormData({
            state: data.state || "New",
            role: data.role || "Sre",
            assigned_to: data.assigned_to || "",
            message: data.message || "",
          });
        }
      } catch (e) {
        console.error(e);

        // fallback on error
        setFormData({
          state: "New",
          role: "Sre",
          assigned_to: "",
          message: "",
        });
      }
    };

    if (incid) {
      fetchInc();
    }
  }, []);


  const [disableNewOption, setDisableNewOption] = useState(false);
  const [isIncidentClosed, setIsIncidentClosed] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (isIncidentClosed) return;
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {

    setDisableNewOption(true);//new disabled

    //if resolved is selected as an option
    if (formData.state.toLowerCase() == 'resolved') {
      //automatically become in-progress
      setFormData((prev) => ({
        ...prev,
        state: "Resolved",
      }));
      console.log("Form data:", { ...formData, state: "Resoved" });
    }

    else {
      //automatically become in-progress
      setFormData((prev) => ({
        ...prev,
        state: "Inprogress",
      }));
      console.log("Form data:", { ...formData, state: "Inprogress" });
    }

  }

  const handleResolve = () => {
    setDisableNewOption(true);
    setFormData((prev) => ({
      ...prev,
      state: "Resolved",
    }));
    setIsIncidentClosed(true);
  };



  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,#dbeafe_0%,#f8fafc_45%,#eef2ff_100%)] px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm border border-slate-200 hover:bg-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white/95 p-6 md:p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 p-2.5 text-white shadow">
              <FilePenLine className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Edit Incident</h1>
              <p className="text-sm text-slate-500">Update state, role assignment, and owner details.</p>
            </div>
          </div>

          <form className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="state" className="text-sm font-semibold text-slate-700">
                  Select State
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={isIncidentClosed}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:ring-2 focus:ring-indigo-500"
                >
                  <option disabled={disableNewOption}>New</option>
                  <option>Inprogress</option>
                  <option>Resolved</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="role" className="text-sm font-semibold text-slate-700">
                  Select Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isIncidentClosed}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Sre</option>
                  <option>Dev</option>
                  <option>Qa</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="assigned_to" className="text-sm font-semibold text-slate-700">
                Assigned To
              </label>
              <input
                id="assigned_to"
                name="assigned_to"
                type="text"
                value={formData.assigned_to}
                onChange={handleChange}
                disabled={isIncidentClosed}
                placeholder="Enter assignee name"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="text-sm font-semibold text-slate-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                disabled={isIncidentClosed}
                placeholder="Type any message for the user..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:ring-2 focus:ring-indigo-500 resize-y"
              />
            </div>

            <div className="mt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={isIncidentClosed}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                onClick={handleSave}
              >
                Save Changes
              </button>

              <button
                type="button"
                disabled={isIncidentClosed}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-emerald-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                onClick={handleResolve}
              >
                Resolve
              </button>
            </div>
          </form>
        </div>
      </div>

      <div>
        <h2>View Incident History</h2>

      </div>

    </div>
  );
};

export default EditIncidents;
