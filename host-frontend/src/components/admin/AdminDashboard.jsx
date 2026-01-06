import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Search, Eye, CheckCircle, XCircle } from "lucide-react";
import { adminAPI } from "../../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [hosts, setHosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [hostsRes, statsRes] = await Promise.all([
        adminAPI.getAllHosts(),
        adminAPI.getStats(),
      ]);

      if (hostsRes.data.success) {
        setHosts(hostsRes.data.hosts);
      }

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    } catch (error) {
      console.error("❌ Load dashboard error:", error);
      alert("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await adminAPI.searchHosts(search);
      if (response.data.success) {
        setHosts(response.data.hosts);
      }
    } catch (error) {
      console.error("❌ Search error:", error);
    }
  };

  const handleApproveKYC = async (hostId) => {
    if (!confirm("Approve this host's KYC?")) return;

    try {
      const response = await adminAPI.approveKYC(hostId);
      if (response.data.success) {
        alert("KYC approved!");
        loadDashboard();
      }
    } catch (error) {
      console.error("❌ Approve KYC error:", error);
      alert("Failed to approve KYC");
    }
  };

  const handleRejectKYC = async (hostId) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      const response = await adminAPI.rejectKYC(hostId, reason);
      if (response.data.success) {
        alert("KYC rejected");
        loadDashboard();
      }
    } catch (error) {
      console.error("❌ Reject KYC error:", error);
      alert("Failed to reject KYC");
    }
  };

  const handleDeleteHost = async (hostId) => {
    if (
      !confirm(
        "Are you sure you want to delete this host? This action cannot be undone."
      )
    )
      return;

    try {
      const response = await adminAPI.deleteHost(hostId);
      if (response.data.success) {
        alert("Host deleted successfully");
        loadDashboard();
      }
    } catch (error) {
      console.error("❌ Delete host error:", error);
      alert("Failed to delete host");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminData");
    navigate("/host-login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Manage hosts and verify KYC</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">
              Total Hosts
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats.totalHosts}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">
              Active Hosts
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {stats.activeHosts}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">
              Pending KYC
            </h3>
            <p className="text-3xl font-bold text-yellow-600">
              {stats.pendingKYC}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">
              Total Calls
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats.totalCalls}
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or Host ID..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>
      </div>

      {/* Hosts Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pink-300">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">DOB</th>
                <th className="px-6 py-4 text-left font-semibold">Phone</th>
                <th className="px-6 py-4 text-left font-semibold">
                  Total Points
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  Total Call Time
                </th>
                <th className="px-6 py-4 text-left font-semibold">Bank</th>
                <th className="px-6 py-4 text-left font-semibold">KYC</th>
                <th className="px-6 py-4 text-left font-semibold">Host ID</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hosts.map((host) => (
                <tr key={host._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {host.firstName} {host.lastName}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(host.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{host.phone}</td>
                  <td className="px-6 py-4">{host.earningPoints || 0}</td>
                  <td className="px-6 py-4">{host.totalCallTime || 0} mins</td>
                  <td className="px-6 py-4">
                    {host.bankDetails?.accountNumber ? "✅" : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        host.kyc?.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : host.kyc?.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {host.kyc?.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-pink-600 font-mono text-sm">
                      {host._id.slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleApproveKYC(host._id)}
                        className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                        disabled={host.kyc?.status === "approved"}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectKYC(host._id)}
                        className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleDeleteHost(host._id)}
                        className="px-4 py-2 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
