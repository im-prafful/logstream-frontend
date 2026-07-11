import React, { useEffect, useState, type ChangeEvent } from "react";
import { ArrowLeft, FilePenLine, History, Clock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const EditIncidents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const incid = location.state?.id;
  const { token } = useAuth();


  const [formData, setFormData] = useState({
    state: "",
    role: "",
    assigned_to: "",
    message: ""
  });

  const [disableNewOption, setDisableNewOption] = useState(false);
  const [isIncidentClosed, setIsIncidentClosed] = useState(false);
  const [oldState, setOldState] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const rawUserData = localStorage.getItem("USER_DATA");
const storedUserData = rawUserData ? JSON.parse(rawUserData) : null;
const userId = storedUserData?.user_id || "";
 
  useEffect(() => {
    if (!incid) {
      alert("Incident ID not found.");
      navigate(-1);
      return;
    }

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

        const data = response.data?.incident;
        console.log(response.data);
        
        if (!data) {
          alert("Could not fetch incident details.");
          return;
        }

        const normalizedStatus = String(data.status || "")
          .toLowerCase()
          .replaceAll("_", "");

        const mappedState =
          normalizedStatus === "inprogress"
            ? "Inprogress"
            : normalizedStatus === "resolved"
              ? "Resolved"
              : "New";

        setFormData({
          state: mappedState,
          role: String(data.assigned_role || "").toLowerCase() === "dev"
            ? "Dev"
            : String(data.assigned_role || "").toLowerCase() === "qa"
              ? "Qa"
              : "Sre",
          assigned_to: data.assigned_to || "",
          message: data.message || "",
        });
        setSearchQuery(data.assigned_user_name || data.assigned_to || "");

        if (normalizedStatus === "inprogress") {
          setDisableNewOption(true);
        }

        if (normalizedStatus === "resolved") {
          setDisableNewOption(true);
          setIsIncidentClosed(true);
        }
        setOldState(mappedState);
      } catch (e) {
        console.error(e);
        alert("Could not fetch incident details.");
      }
    };

    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `https://9swlhzogxj.execute-api.ap-south-1.amazonaws.com/api/v1/incident/history/${incid}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setHistory(response.data?.history || []);
      } catch (e) {
        console.error("Could not fetch incident history.", e);
      }
    };

    fetchInc();
    fetchHistory();
  }, [incid, navigate, token]);

  useEffect(() => {
    if (!showDropdown) return;
    
    const handler = setTimeout(async () => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await axios.get(
          `https://9swlhzogxj.execute-api.ap-south-1.amazonaws.com/api/v1/users/search?q=${encodeURIComponent(searchQuery)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSearchResults(res.data.users || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, formData.role, showDropdown, token]);


  const handleChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (isIncidentClosed) return;
    const { name, value } = e.target;

    if (name === "state" && disableNewOption && value === "New") {
      return;
    }

    if (name === "state" && formData.state === "Resolved" && value !== "Resolved") {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (searchQuery.trim() !== "" && formData.assigned_to === "") {
      alert("Error: The assigned user is not present in the database. Please select a valid user from the dropdown or leave it blank.");
      return;
    }

    const nextState =
      formData.state.toLowerCase() === "resolved" ? "Resolved" : "Inprogress";

    try {

      //SAVE TO INCIDENT TABLE
      await axios.put(
        `https://9swlhzogxj.execute-api.ap-south-1.amazonaws.com/api/v1/incident/${incid}`,
        {
          status: nextState,
          assigned_role: formData.role.toUpperCase(),
          assigned_to: formData.assigned_to,
          message: formData.message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      //APPEND TO INCIDENT HISTORY TABLE
      await axios.post(`https://9swlhzogxj.execute-api.ap-south-1.amazonaws.com/api/v1/incident/history`,
      {
         incident_id:incid,
         user_id:userId,
         comment:formData.message,
         old_value:oldState,
         new_value:nextState
      },
      {
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      })

      setDisableNewOption(true);
      setFormData((prev) => ({
        ...prev,
        state: nextState,
      }));
      setOldState(nextState);

      // Re-fetch history to update the UI immediately
      const historyResponse = await axios.get(
        `https://9swlhzogxj.execute-api.ap-south-1.amazonaws.com/api/v1/incident/history/${incid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory(historyResponse.data?.history || []);

      if (nextState === "Resolved") {
        setIsIncidentClosed(true);
      }

      alert("Incident updated successfully.");
    } catch (e) {
      console.error(e);
      alert("Failed to update incident.");
    }
  };

  const handleResolve = async () => {
    if (searchQuery.trim() !== "" && formData.assigned_to === "") {
      alert("Error: The assigned user is not present in the database. Please select a valid user from the dropdown or leave it blank.");
      return;
    }

    try {
      await axios.put(
        `https://9swlhzogxj.execute-api.ap-south-1.amazonaws.com/api/v1/incident/${incid}`,
        {
          status: "Resolved",
          assigned_role: formData.role.toUpperCase(),
          assigned_to: formData.assigned_to,
          message: formData.message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      //APPEND TO INCIDENT HISTORY TABLE
      await axios.post(
        `https://9swlhzogxj.execute-api.ap-south-1.amazonaws.com/api/v1/incident/history`,
        {
          incident_id: incid,
          user_id: userId,
          comment: formData.message,
          old_value: oldState,
          new_value: "RESOLVED",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setDisableNewOption(true);
      setFormData((prev) => ({
        ...prev,
        state: "Resolved",
      }));
      setOldState("Resolved");
      setIsIncidentClosed(true);

      // Re-fetch history to update the UI immediately
      const historyResponse = await axios.get(
        `https://9swlhzogxj.execute-api.ap-south-1.amazonaws.com/api/v1/incident/history/${incid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory(historyResponse.data?.history || []);
      alert("Incident resolved successfully.");
    } catch (e) {
      console.error(e);
      alert("Failed to resolve incident.");
    }
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
                  <option value="New" disabled={disableNewOption}>New</option>
                  <option value="Inprogress" disabled={isIncidentClosed}>Inprogress</option>
                  <option value="Resolved">Resolved</option>
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

            <div className="space-y-1.5 relative">
              <label htmlFor="assigned_to" className="text-sm font-semibold text-slate-700">
                Assigned To
              </label>
              <input
                id="assigned_to"
                name="assigned_to"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                  if (e.target.value.trim() === "") {
                     setFormData(prev => ({ ...prev, assigned_to: "" }));
                  } else {
                     setFormData(prev => ({ ...prev, assigned_to: "" })); // invalidate ID until selected
                  }
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                disabled={isIncidentClosed}
                placeholder="Search assignee name or email..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:ring-2 focus:ring-indigo-500"
                autoComplete="off"
              />
              {showDropdown && (searchQuery.trim() !== "" || searchResults.length > 0) && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                  {isSearching ? (
                    <div className="p-3 text-sm text-slate-500 text-center">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <ul className="max-h-60 overflow-y-auto">
                      {searchResults.map((user) => (
                        <li 
                          key={user.user_id}
                          className="px-4 py-2 hover:bg-indigo-50 cursor-pointer flex flex-col"
                          onMouseDown={() => {
                            setSearchQuery(user.full_name);
                            
                            // Format role from DB (e.g., 'dev') to UI dropdown format (e.g., 'Dev')
                            const formattedRole = user.role 
                              ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
                              : formData.role;

                            setFormData(prev => ({ 
                              ...prev, 
                              assigned_to: user.user_id,
                              role: formattedRole
                            }));
                            setShowDropdown(false);
                          }}
                        >
                          <span className="font-semibold text-slate-800 text-sm">{user.full_name}</span>
                          <span className="text-xs text-slate-500">{user.email}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-3 text-sm text-slate-500 text-center">No users found.</div>
                  )}
                </div>
              )}
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



      {/* History Section */}
      <div className="mx-auto w-full max-w-2xl mt-8">
        <div className="rounded-2xl border border-slate-200 bg-white/95 p-6 md:p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 p-2.5 text-white shadow">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Incident History</h2>
              <p className="text-sm text-slate-500">
                Timeline of updates. Currently assigned to: <span className="font-semibold text-indigo-600">{searchQuery || 'Unassigned'}</span>
              </p>
            </div>
          </div>

          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div key={index} className="flex flex-col gap-3 p-5 rounded-lg border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold text-base">
                        {String(item.user_name || item.user_id).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="block font-bold text-slate-900 text-base">{item.user_name || item.user_id}</span>
                        <span className="block text-xs text-slate-500 mt-0.5">Updated the incident</span>
                      </div>
                    </div>
                    <time className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {new Date(item.updated_at).toLocaleString()}
                    </time>
                  </div>
                  
                  {item.comment && (
                    <div className="text-base text-slate-800 bg-slate-50 p-4 rounded-md border border-slate-200 whitespace-pre-wrap">
                      {item.comment}
                    </div>
                  )}

                  <div className="text-sm flex items-center gap-2 mt-1">
                    <span className="font-medium text-slate-500">State Change:</span>
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">{item.old_value}</span>
                    <span className="text-slate-400">→</span>
                    <span className="font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded">{item.new_value}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">No history available for this incident.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default EditIncidents;
