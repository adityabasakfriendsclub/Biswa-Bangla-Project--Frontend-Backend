//  show report new4
import { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  Phone,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Menu,
  X,
  LogOut,
  Home,
  BarChart3,
  Settings,
  Bell,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Search,
  Filter,
  Ban,
  Trash2,
  Edit,
  Save,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_URL = "http://localhost:3000/api/admin";

const AdminDashboard = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGender, setFilterGender] = useState("all");

  // Demo data
  const [demoLiveStats, setDemoLiveStats] = useState({
    onlineUsers: 0,
    activeCalls: 0,
    onlineHosts: 0,
  });

  // Fetch real data
  useEffect(() => {
    fetchRealData();
  }, []);

  // Demo stats simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setDemoLiveStats({
        onlineUsers: Math.floor(Math.random() * 50) + 10,
        activeCalls: Math.floor(Math.random() * 20),
        onlineHosts: Math.floor(Math.random() * 30) + 5,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchRealData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const [statsRes, usersRes, allUsersRes] = await Promise.all([
        fetch(`${API_URL}/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/users/recent?limit=5`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/users?page=1&limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const allUsersData = await allUsersRes.json();

      if (statsData.success) setStats(statsData.data);
      if (usersData.success) setRecentUsers(usersData.data.users);
      if (allUsersData.success) setAllUsers(allUsersData.data.users);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    setReportsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/reports?status=all&limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setReports(data.data.reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "reports") fetchReports();
  }, [activeTab]);

  const handleUpdateReportStatus = async (reportId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/reports/${reportId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        alert(`Report ${newStatus} successfully!`);
        fetchReports();
      }
    } catch (error) {
      alert("Error updating report");
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isBlocked: !isBlocked }),
      });
      fetchRealData();
      alert(`User ${!isBlocked ? "blocked" : "unblocked"} successfully`);
    } catch (error) {
      alert("Error updating user status");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRealData();
      setShowUserModal(false);
      alert("User deleted successfully");
    } catch (error) {
      alert("Error deleting user");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      onLogout?.();
    }
  };

  const COLORS = ["#6366f1", "#ec4899", "#8b5cf6"];

  const genderData = stats
    ? [
        { name: "Male", value: stats.genderDistribution.male },
        { name: "Female", value: stats.genderDistribution.female },
        { name: "Others", value: stats.genderDistribution.others },
      ]
    : [];

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "verified" && user.isVerified) ||
      (filterStatus === "unverified" && !user.isVerified);
    const matchesGender =
      filterGender === "all" || user.gender === filterGender;
    return matchesSearch && matchesStatus && matchesGender;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-800 transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white p-2 hover:bg-gray-700 rounded-lg"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: "dashboard", icon: Home, label: "Dashboard" },
            { id: "users", icon: Users, label: "Users" },
            {
              id: "monitoring",
              icon: Phone,
              label: "Live Monitoring",
              badge: "DEMO",
            },
            { id: "wallet", icon: DollarSign, label: "Wallet", badge: "DEMO" },
            {
              id: "reports",
              icon: AlertCircle,
              label: "Reports",
              badge: "REAL DATA",
            },
            { id: "analytics", icon: BarChart3, label: "Analytics" },
            { id: "settings", icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        item.badge === "DEMO"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white capitalize">
            {activeTab}
          </h2>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div className="text-white">
                <p className="font-semibold">Admin</p>
                <p className="text-xs text-gray-400">Super Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-400 text-sm">
                  ⚠️ Live stats are demo data. Reports section shows real data.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <DemoStatCard
                  title="Online Users (Demo)"
                  value={demoLiveStats.onlineUsers}
                  icon={<Users size={32} />}
                  color="from-green-600 to-green-700"
                />
                <DemoStatCard
                  title="Active Calls (Demo)"
                  value={demoLiveStats.activeCalls}
                  icon={<Phone size={32} />}
                  color="from-blue-600 to-blue-700"
                />
                <DemoStatCard
                  title="Online Hosts (Demo)"
                  value={demoLiveStats.onlineHosts}
                  icon={<UserCheck size={32} />}
                  color="from-purple-600 to-purple-700"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                  title="Total Users"
                  value={stats?.totalUsers || 0}
                  icon={<Users size={24} />}
                  color="bg-indigo-600"
                  badge="REAL"
                />
                <StatCard
                  title="Verified Users"
                  value={stats?.verifiedUsers || 0}
                  icon={<UserCheck size={24} />}
                  color="bg-green-600"
                  badge="REAL"
                />
                <StatCard
                  title="Unverified"
                  value={stats?.unverifiedUsers || 0}
                  icon={<Clock size={24} />}
                  color="bg-orange-600"
                  badge="REAL"
                />
                <StatCard
                  title="New This Month"
                  value={stats?.newUsers?.month || 0}
                  icon={<TrendingUp size={24} />}
                  color="bg-pink-600"
                  badge="REAL"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Registration Trend (Last 7 Days)
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={stats?.registrationTrend || []}>
                      <defs>
                        <linearGradient
                          id="colorCount"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#6366f1"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#6366f1"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "none",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#6366f1"
                        fillOpacity={1}
                        fill="url(#colorCount)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Gender Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {genderData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "none",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  Recent Users{" "}
                  <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                    REAL DATA
                  </span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400">
                          Phone
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400">
                          Gender
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="border-b border-gray-700 hover:bg-gray-700/50"
                        >
                          <td className="py-3 px-4 text-white">
                            {user.firstName} {user.lastName}
                          </td>
                          <td className="py-3 px-4 text-gray-300">
                            {user.phone}
                          </td>
                          <td className="py-3 px-4 text-gray-300">
                            {user.gender}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs ${
                                user.isVerified
                                  ? "bg-green-600/20 text-green-400"
                                  : "bg-orange-600/20 text-orange-400"
                              }`}
                            >
                              {user.isVerified ? "Verified" : "Unverified"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-300">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* USERS */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative md:col-span-2">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search by name or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  >
                    <option value="all">All Status</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                  </select>
                  <select
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                    className="px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  >
                    <option value="all">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  All Users ({filteredUsers.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400">
                          Phone
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400">
                          Gender
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="border-b border-gray-700 hover:bg-gray-700/50"
                        >
                          <td className="py-3 px-4 text-white">
                            {user.firstName} {user.lastName}
                          </td>
                          <td className="py-3 px-4 text-gray-300">
                            {user.phone}
                          </td>
                          <td className="py-3 px-4 text-gray-300">
                            {user.gender}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs ${
                                user.isVerified
                                  ? "bg-green-600/20 text-green-400"
                                  : "bg-orange-600/20 text-orange-400"
                              }`}
                            >
                              {user.isVerified ? "Verified" : "Unverified"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-300">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowUserModal(true);
                                }}
                                className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  handleBlockUser(user._id, user.isBlocked)
                                }
                                className="p-2 text-orange-400 hover:bg-orange-500/20 rounded-lg"
                              >
                                <Ban size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                              >
                                <Trash2 size={16} />
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
          )}

          {/* REPORTS */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400">
                  ✅ Real data from GrievanceFormPage submissions
                </p>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    User Reports{" "}
                    <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                      {reports.length} REAL REPORTS
                    </span>
                  </h3>
                  <button
                    onClick={fetchReports}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                  >
                    <AlertCircle size={16} /> Refresh
                  </button>
                </div>

                {reportsLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare
                      size={48}
                      className="text-gray-600 mx-auto mb-4"
                    />
                    <p className="text-gray-400">No reports submitted yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div
                        key={report._id}
                        className="bg-gray-700 p-4 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-medium">
                            {report.firstName} {report.lastName}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${
                              report.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : report.status === "reviewed"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : report.status === "resolved"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {report.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">
                          📧 {report.email} • 📱 {report.phone}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {report.complaintTypes.map((type, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-300 text-sm mb-2">
                          {report.description}
                        </p>
                        {report.evidenceFile && (
                          <p className="text-xs text-cyan-400 mb-2">
                            🔎 Evidence:{" "}
                            <a
                              href={`http://localhost:3000${report.evidenceFile}`}
                              target="_blank"
                              className="underline"
                            >
                              View File
                            </a>
                          </p>
                        )}
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() =>
                              handleUpdateReportStatus(report._id, "reviewed")
                            }
                            disabled={report.status === "reviewed"}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                          >
                            <Eye size={14} className="inline mr-1" /> Mark
                            Reviewed
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateReportStatus(report._id, "resolved")
                            }
                            disabled={report.status === "resolved"}
                            className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                          >
                            <CheckCircle size={14} className="inline mr-1" />{" "}
                            Resolve
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateReportStatus(report._id, "rejected")
                            }
                            disabled={report.status === "rejected"}
                            className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
                          >
                            <XCircle size={14} className="inline mr-1" /> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    User Growth
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats?.registrationTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "none",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Verification Status
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Verified",
                            value: stats?.verifiedUsers || 0,
                          },
                          {
                            name: "Unverified",
                            value: stats?.unverifiedUsers || 0,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={100}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "none",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-xl p-6">
                  <h4 className="text-gray-400 text-sm mb-2">
                    Avg Daily Sign-ups
                  </h4>
                  <p className="text-3xl font-bold text-white">
                    {stats?.newUsers?.week
                      ? Math.round(stats.newUsers.week / 7)
                      : 0}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-xl p-6">
                  <h4 className="text-gray-400 text-sm mb-2">
                    Verification Rate
                  </h4>
                  <p className="text-3xl font-bold text-white">
                    {stats?.totalUsers
                      ? Math.round(
                          (stats.verifiedUsers / stats.totalUsers) * 100,
                        )
                      : 0}
                    %
                  </p>
                </div>
                <div className="bg-gray-800 rounded-xl p-6">
                  <h4 className="text-gray-400 text-sm mb-2">
                    Growth This Week
                  </h4>
                  <p className="text-3xl font-bold text-white">
                    +{stats?.newUsers?.week || 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* MONITORING - DEMO */}
          {activeTab === "monitoring" && (
            <div className="space-y-6">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-400">
                  ⚠️ DEMO/PLACEHOLDER data. Real-time features coming soon.
                </p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Active Calls (Demo)
                </h3>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-white font-medium mb-2">
                    Call #1234 (Demo)
                  </p>
                  <p className="text-sm text-gray-400">User: +91 98765 43210</p>
                  <p className="text-sm text-gray-400">Host: Sarah Jones</p>
                  <p className="text-sm text-gray-400">Duration: 5:32</p>
                </div>
              </div>
            </div>
          )}

          {/* WALLET - DEMO */}
          {activeTab === "wallet" && (
            <div className="space-y-6">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-400">
                  ⚠️ DEMO/PLACEHOLDER data. Real wallet tracking coming soon.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
                  <h3 className="text-sm opacity-90 mb-2">
                    Total Earnings (Demo)
                  </h3>
                  <p className="text-4xl font-bold">₹0</p>
                </div>
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                  <h3 className="text-sm opacity-90 mb-2">
                    Total Spending (Demo)
                  </h3>
                  <p className="text-4xl font-bold">₹0</p>
                </div>
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
                  <h3 className="text-sm opacity-90 mb-2">
                    Active Wallets (Demo)
                  </h3>
                  <p className="text-4xl font-bold">0</p>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">
                  Account Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      defaultValue="admin@dating.com"
                      className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Admin Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Super Admin"
                      className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Change Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <Save size={20} /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex justify-between">
              <h3 className="text-2xl font-bold">User Details</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-white hover:bg-white/20 rounded-full p-2"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Full Name</p>
                  <p className="text-white text-lg font-semibold">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Phone</p>
                  <p className="text-white text-lg font-semibold">
                    {selectedUser.phone}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Gender</p>
                  <p className="text-white text-lg font-semibold">
                    {selectedUser.gender}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Status</p>
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm ${
                      selectedUser.isVerified
                        ? "bg-green-600/20 text-green-400"
                        : "bg-orange-600/20 text-orange-400"
                    }`}
                  >
                    {selectedUser.isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Wallet Balance</p>
                  <p className="text-white text-lg font-semibold">
                    ₹{selectedUser.walletBalance || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Registered</p>
                  <p className="text-white text-lg font-semibold">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    handleBlockUser(selectedUser._id, selectedUser.isBlocked)
                  }
                  className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2"
                >
                  <Ban size={20} />{" "}
                  {selectedUser.isBlocked ? "Unblock" : "Block"}
                </button>
                <button
                  onClick={() => handleDeleteUser(selectedUser._id)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <Trash2 size={20} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color, badge }) => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <div className={`${color} p-3 rounded-lg text-white`}>{icon}</div>
      {badge && (
        <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
          {badge}
        </span>
      )}
    </div>
    <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
    <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
  </div>
);

const DemoStatCard = ({ title, value, icon, color }) => (
  <div className={`bg-gradient-to-r ${color} rounded-xl p-4 text-white`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="opacity-80">{icon}</div>
    </div>
    <p className="text-xs mt-2 opacity-75">🟢 Demo Mode</p>
  </div>
);

export default AdminDashboard;

// new2
// new2
// import { useState, useEffect } from "react";
// import {
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// const API_URL = "http://localhost:3000/api/admin";

// // ==================== ICONS ====================
// const Icons = {
//   Menu: () => (
//     <svg
//       className="w-5 h-5"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M4 6h16M4 12h16M4 18h16"
//       />
//     </svg>
//   ),
//   X: () => (
//     <svg
//       className="w-5 h-5"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M6 18L18 6M6 6l12 12"
//       />
//     </svg>
//   ),
//   Home: () => (
//     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//       <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
//     </svg>
//   ),
//   Users: () => (
//     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//       <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
//     </svg>
//   ),
//   Phone: () => (
//     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//       <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
//     </svg>
//   ),
//   DollarSign: () => (
//     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//       <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
//       <path
//         fillRule="evenodd"
//         d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
//         clipRule="evenodd"
//       />
//     </svg>
//   ),
//   AlertCircle: () => (
//     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//       <path
//         fillRule="evenodd"
//         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//         clipRule="evenodd"
//       />
//     </svg>
//   ),
//   BarChart: () => (
//     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//       <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
//     </svg>
//   ),
//   Settings: () => (
//     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//       <path
//         fillRule="evenodd"
//         d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
//         clipRule="evenodd"
//       />
//     </svg>
//   ),
//   LogOut: () => (
//     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//       <path
//         fillRule="evenodd"
//         d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
//         clipRule="evenodd"
//       />
//     </svg>
//   ),
//   Bell: () => (
//     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//       <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
//     </svg>
//   ),
//   Eye: () => (
//     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//       <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//       <path
//         fillRule="evenodd"
//         d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
//         clipRule="evenodd"
//       />
//     </svg>
//   ),
//   CheckCircle: () => (
//     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//       <path
//         fillRule="evenodd"
//         d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//         clipRule="evenodd"
//       />
//     </svg>
//   ),
//   XCircle: () => (
//     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//       <path
//         fillRule="evenodd"
//         d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//         clipRule="evenodd"
//       />
//     </svg>
//   ),
//   RefreshCw: () => (
//     <svg
//       className="w-4 h-4"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//       />
//     </svg>
//   ),
//   Filter: () => (
//     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//       <path
//         fillRule="evenodd"
//         d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
//         clipRule="evenodd"
//       />
//     </svg>
//   ),
// };

// // ==================== DATA BADGE COMPONENT ====================
// const DataBadge = ({ type }) => {
//   const badges = {
//     real: {
//       bg: "bg-green-500/20",
//       text: "text-green-400",
//       label: "✅ REAL DATA",
//     },
//     demo: {
//       bg: "bg-yellow-500/20",
//       text: "text-yellow-400",
//       label: "⚠️ DEMO MODE",
//     },
//   };

//   const badge = badges[type] || badges.demo;

//   return (
//     <span
//       className={`text-xs px-2 py-0.5 ${badge.bg} ${badge.text} rounded-full font-medium`}
//     >
//       {badge.label}
//     </span>
//   );
// };

// // ==================== MAIN COMPONENT ====================
// const AdminDashboard = ({ onLogout }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [loading, setLoading] = useState(true);

//   // Real Data States
//   const [stats, setStats] = useState(null);
//   const [recentUsers, setRecentUsers] = useState([]);
//   const [allUsers, setAllUsers] = useState([]);
//   const [reports, setReports] = useState([]);
//   const [reportsLoading, setReportsLoading] = useState(false);
//   const [reportFilter, setReportFilter] = useState("all");

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   useEffect(() => {
//     if (activeTab === "reports") {
//       fetchReports();
//     }
//   }, [activeTab, reportFilter]);

//   // ==================== FETCH DASHBOARD DATA (REAL) ====================
//   const fetchDashboardData = async () => {
//     try {
//       const token = localStorage.getItem("adminToken");
//       const [statsRes, usersRes, allUsersRes] = await Promise.all([
//         fetch(`${API_URL}/stats`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_URL}/users/recent?limit=5`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${API_URL}/users?page=1&limit=100`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       const [statsData, usersData, allUsersData] = await Promise.all([
//         statsRes.json(),
//         usersRes.json(),
//         allUsersRes.json(),
//       ]);

//       if (statsData.success) setStats(statsData.data);
//       if (usersData.success) setRecentUsers(usersData.data.users);
//       if (allUsersData.success) setAllUsers(allUsersData.data.users);
//     } catch (error) {
//       console.error("❌ Error fetching dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==================== FETCH REPORTS (REAL DATA) ====================
//   const fetchReports = async () => {
//     setReportsLoading(true);
//     try {
//       const token = localStorage.getItem("adminToken");
//       const response = await fetch(
//         `${API_URL}/reports?status=${reportFilter}&limit=50`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       );

//       const data = await response.json();
//       if (data.success) {
//         setReports(data.data.reports);
//         console.log(`✅ Loaded ${data.data.reports.length} reports`);
//       }
//     } catch (error) {
//       console.error("❌ Error fetching reports:", error);
//     } finally {
//       setReportsLoading(false);
//     }
//   };

//   // ==================== UPDATE REPORT STATUS (REAL) ====================
//   const handleUpdateReportStatus = async (reportId, newStatus) => {
//     try {
//       const token = localStorage.getItem("adminToken");
//       const response = await fetch(`${API_URL}/reports/${reportId}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         alert(`✅ Report ${newStatus} successfully!`);
//         fetchReports();
//       }
//     } catch (error) {
//       alert("❌ Error updating report status");
//     }
//   };

//   // ==================== LOGOUT ====================
//   const handleLogout = () => {
//     if (window.confirm("Are you sure you want to logout?")) {
//       localStorage.removeItem("adminToken");
//       localStorage.removeItem("adminData");
//       onLogout?.();
//     }
//   };

//   // ==================== CHART DATA ====================
//   const COLORS = ["#6366f1", "#ec4899", "#8b5cf6"];
//   const genderData = stats
//     ? [
//         { name: "Male", value: stats.genderDistribution.male },
//         { name: "Female", value: stats.genderDistribution.female },
//         { name: "Others", value: stats.genderDistribution.others },
//       ]
//     : [];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 flex">
//       {/* ==================== SIDEBAR ==================== */}
//       <div
//         className={`${sidebarOpen ? "w-64" : "w-20"} bg-gray-800 transition-all duration-300 flex flex-col`}
//       >
//         <div className="p-4 flex items-center justify-between border-b border-gray-700">
//           {sidebarOpen && (
//             <h1 className="text-xl font-bold text-white">Admin Panel</h1>
//           )}
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="text-white p-2 hover:bg-gray-700 rounded-lg"
//           >
//             {sidebarOpen ? <Icons.X /> : <Icons.Menu />}
//           </button>
//         </div>

//         <nav className="flex-1 p-4 space-y-2">
//           {[
//             {
//               id: "dashboard",
//               icon: "Home",
//               label: "Dashboard",
//               dataType: "real",
//             },
//             { id: "users", icon: "Users", label: "Users", dataType: "real" },
//             {
//               id: "monitoring",
//               icon: "Phone",
//               label: "Live Monitoring",
//               dataType: "demo",
//             },
//             {
//               id: "wallet",
//               icon: "DollarSign",
//               label: "Wallet & Earnings",
//               dataType: "demo",
//             },
//             {
//               id: "reports",
//               icon: "AlertCircle",
//               label: "Reports",
//               dataType: "real",
//             },
//             {
//               id: "analytics",
//               icon: "BarChart",
//               label: "Analytics",
//               dataType: "real",
//             },
//             { id: "settings", icon: "Settings", label: "Settings" },
//           ].map((item) => {
//             const IconComponent = Icons[item.icon];
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveTab(item.id)}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                   activeTab === item.id
//                     ? "bg-indigo-600 text-white"
//                     : "text-gray-400 hover:bg-gray-700 hover:text-white"
//                 }`}
//               >
//                 <IconComponent />
//                 {sidebarOpen && (
//                   <div className="flex-1 flex items-center justify-between">
//                     <span>{item.label}</span>
//                     {item.dataType && <DataBadge type={item.dataType} />}
//                   </div>
//                 )}
//               </button>
//             );
//           })}
//         </nav>

//         <div className="p-4 border-t border-gray-700">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-700 rounded-lg"
//           >
//             <Icons.LogOut />
//             {sidebarOpen && <span>Logout</span>}
//           </button>
//         </div>
//       </div>

//       {/* ==================== MAIN CONTENT ==================== */}
//       <div className="flex-1 overflow-auto">
//         {/* Header */}
//         <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
//           <div>
//             <h2 className="text-2xl font-bold text-white capitalize">
//               {activeTab}
//             </h2>
//             <p className="text-sm text-gray-400 mt-1">
//               {activeTab === "reports" &&
//                 "Real-time report submissions from users"}
//               {activeTab === "monitoring" && "Demo mode - Simulated data"}
//               {activeTab === "wallet" && "Demo mode - Placeholder values"}
//             </p>
//           </div>
//           <div className="flex items-center gap-4">
//             <button className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg relative">
//               <Icons.Bell />
//               <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//             </button>
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
//                 A
//               </div>
//               <div className="text-white">
//                 <p className="font-semibold">Admin</p>
//                 <p className="text-xs text-gray-400">Super Admin</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="p-6">
//           {/* ==================== DASHBOARD TAB (REAL DATA) ==================== */}
//           {activeTab === "dashboard" && stats && (
//             <div className="space-y-6">
//               {/* Info Banner */}
//               <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
//                 <p className="text-green-400 font-medium flex items-center gap-2">
//                   <Icons.CheckCircle />
//                   Dashboard displays real-time data from your database
//                 </p>
//               </div>

//               {/* Stats Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-sm opacity-90">Total Users</h3>
//                     <Icons.Users />
//                   </div>
//                   <p className="text-4xl font-bold">{stats.totalUsers}</p>
//                   <p className="text-sm opacity-75 mt-2">
//                     +{stats.newUsers.month} this month
//                   </p>
//                 </div>

//                 <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-sm opacity-90">Verified Users</h3>
//                     <Icons.CheckCircle />
//                   </div>
//                   <p className="text-4xl font-bold">{stats.verifiedUsers}</p>
//                   <p className="text-sm opacity-75 mt-2">
//                     {Math.round((stats.verifiedUsers / stats.totalUsers) * 100)}
//                     % verified
//                   </p>
//                 </div>

//                 <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-sm opacity-90">Pending Verification</h3>
//                     <Icons.AlertCircle />
//                   </div>
//                   <p className="text-4xl font-bold">{stats.unverifiedUsers}</p>
//                   <p className="text-sm opacity-75 mt-2">Require action</p>
//                 </div>

//                 <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-sm opacity-90">New Today</h3>
//                     <Icons.Users />
//                   </div>
//                   <p className="text-4xl font-bold">{stats.newUsers.today}</p>
//                   <p className="text-sm opacity-75 mt-2">
//                     {stats.newUsers.week} this week
//                   </p>
//                 </div>
//               </div>

//               {/* Charts */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Registration Trend */}
//                 <div className="bg-gray-800 rounded-xl p-6">
//                   <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                     Registration Trend (Last 7 Days)
//                     <DataBadge type="real" />
//                   </h3>
//                   <ResponsiveContainer width="100%" height={250}>
//                     <AreaChart data={stats.registrationTrend || []}>
//                       <defs>
//                         <linearGradient
//                           id="colorCount"
//                           x1="0"
//                           y1="0"
//                           x2="0"
//                           y2="1"
//                         >
//                           <stop
//                             offset="5%"
//                             stopColor="#6366f1"
//                             stopOpacity={0.8}
//                           />
//                           <stop
//                             offset="95%"
//                             stopColor="#6366f1"
//                             stopOpacity={0}
//                           />
//                         </linearGradient>
//                       </defs>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                       <XAxis dataKey="date" stroke="#9ca3af" />
//                       <YAxis stroke="#9ca3af" />
//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: "#1f2937",
//                           border: "none",
//                           borderRadius: "8px",
//                         }}
//                       />
//                       <Area
//                         type="monotone"
//                         dataKey="count"
//                         stroke="#6366f1"
//                         fillOpacity={1}
//                         fill="url(#colorCount)"
//                       />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </div>

//                 {/* Gender Distribution */}
//                 <div className="bg-gray-800 rounded-xl p-6">
//                   <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                     Gender Distribution
//                     <DataBadge type="real" />
//                   </h3>
//                   <ResponsiveContainer width="100%" height={250}>
//                     <PieChart>
//                       <Pie
//                         data={genderData}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         label={(entry) => `${entry.name}: ${entry.value}`}
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="value"
//                       >
//                         {genderData.map((entry, index) => (
//                           <Cell
//                             key={`cell-${index}`}
//                             fill={COLORS[index % COLORS.length]}
//                           />
//                         ))}
//                       </Pie>
//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: "#1f2937",
//                           border: "none",
//                           borderRadius: "8px",
//                         }}
//                       />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>

//               {/* Recent Users */}
//               <div className="bg-gray-800 rounded-xl p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold text-white flex items-center gap-2">
//                     Recent Users
//                     <DataBadge type="real" />
//                   </h3>
//                   <button
//                     onClick={() => setActiveTab("users")}
//                     className="text-indigo-400 hover:text-indigo-300 text-sm"
//                   >
//                     View All
//                   </button>
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-gray-700">
//                         <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
//                           Name
//                         </th>
//                         <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
//                           Phone
//                         </th>
//                         <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
//                           Gender
//                         </th>
//                         <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
//                           Status
//                         </th>
//                         <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
//                           Date
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {recentUsers.map((user) => (
//                         <tr
//                           key={user._id}
//                           className="border-b border-gray-700 hover:bg-gray-700/50"
//                         >
//                           <td className="py-3 px-4 text-white">
//                             {user.firstName} {user.lastName}
//                           </td>
//                           <td className="py-3 px-4 text-gray-300">
//                             {user.phone}
//                           </td>
//                           <td className="py-3 px-4 text-gray-300">
//                             {user.gender}
//                           </td>
//                           <td className="py-3 px-4">
//                             <span
//                               className={`px-3 py-1 rounded-full text-xs font-medium ${
//                                 user.isVerified
//                                   ? "bg-green-600/20 text-green-400"
//                                   : "bg-orange-600/20 text-orange-400"
//                               }`}
//                             >
//                               {user.isVerified ? "Verified" : "Unverified"}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4 text-gray-300">
//                             {new Date(user.createdAt).toLocaleDateString()}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ==================== REPORTS TAB (REAL DATA) ==================== */}
//           {activeTab === "reports" && (
//             <div className="space-y-6">
//               {/* Info Banner */}
//               <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Icons.CheckCircle />
//                   <p className="text-green-400 font-medium">
//                     Reports section displays real-time data from user
//                     submissions
//                   </p>
//                 </div>
//                 <DataBadge type="real" />
//               </div>

//               {/* Filters */}
//               <div className="bg-gray-800 rounded-xl p-6">
//                 <div className="flex items-center gap-4">
//                   <Icons.Filter />
//                   <select
//                     value={reportFilter}
//                     onChange={(e) => setReportFilter(e.target.value)}
//                     className="px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
//                   >
//                     <option value="all">All Reports</option>
//                     <option value="pending">Pending</option>
//                     <option value="reviewed">Reviewed</option>
//                     <option value="resolved">Resolved</option>
//                     <option value="rejected">Rejected</option>
//                   </select>
//                   <button
//                     onClick={fetchReports}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
//                   >
//                     <Icons.RefreshCw />
//                     Refresh
//                   </button>
//                   <div className="ml-auto text-gray-400">
//                     Total:{" "}
//                     <span className="font-bold text-white">
//                       {reports.length}
//                     </span>{" "}
//                     reports
//                   </div>
//                 </div>
//               </div>

//               {/* Reports List */}
//               {reportsLoading ? (
//                 <div className="flex items-center justify-center py-20">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-500"></div>
//                 </div>
//               ) : reports.length === 0 ? (
//                 <div className="bg-gray-800 rounded-xl p-12 text-center">
//                   <Icons.AlertCircle />
//                   <p className="text-gray-400 text-lg mt-4">No reports found</p>
//                   <p className="text-gray-500 text-sm mt-2">
//                     {reportFilter === "all"
//                       ? "No reports have been submitted yet"
//                       : `No ${reportFilter} reports found`}
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {reports.map((report) => (
//                     <div
//                       key={report._id}
//                       className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700/50 transition-all"
//                     >
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-3 mb-2">
//                             <h3 className="text-white font-semibold text-lg">
//                               Report #{report._id.slice(-6)}
//                             </h3>
//                             <span
//                               className={`px-3 py-1 rounded-full text-xs font-medium ${
//                                 report.status === "pending"
//                                   ? "bg-yellow-500/20 text-yellow-400"
//                                   : report.status === "reviewed"
//                                     ? "bg-blue-500/20 text-blue-400"
//                                     : report.status === "resolved"
//                                       ? "bg-green-500/20 text-green-400"
//                                       : "bg-red-500/20 text-red-400"
//                               }`}
//                             >
//                               {report.status.toUpperCase()}
//                             </span>
//                           </div>
//                           <div className="text-gray-400 text-sm space-y-1">
//                             <p>
//                               👤{" "}
//                               <span className="font-medium">
//                                 {report.firstName} {report.lastName}
//                               </span>
//                             </p>
//                             <p>📱 {report.phone}</p>
//                             <p>📧 {report.email}</p>
//                             <p>🆔 App User ID: {report.appUserId}</p>
//                           </div>
//                         </div>
//                         <div className="text-right text-sm text-gray-400">
//                           <p>
//                             {new Date(report.createdAt).toLocaleDateString()}
//                           </p>
//                           <p>
//                             {new Date(report.createdAt).toLocaleTimeString()}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Complaint Types */}
//                       <div className="mb-4">
//                         <p className="text-gray-400 text-sm font-medium mb-2">
//                           Complaint Types:
//                         </p>
//                         <div className="flex flex-wrap gap-2">
//                           {report.complaintTypes.map((type, idx) => (
//                             <span
//                               key={idx}
//                               className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs"
//                             >
//                               {type}
//                             </span>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Description */}
//                       <div className="mb-4">
//                         <p className="text-gray-400 text-sm font-medium mb-2">
//                           Description:
//                         </p>
//                         <p className="text-gray-300 text-sm bg-gray-900/50 p-3 rounded-lg">
//                           {report.description}
//                         </p>
//                       </div>

//                       {/* Evidence File */}
//                       {report.evidenceFile && (
//                         <div className="mb-4">
//                           <p className="text-gray-400 text-sm font-medium mb-2">
//                             Evidence:
//                           </p>

//                           <a
//                             href={`http://localhost:3000${report.evidenceFile}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-indigo-400 hover:text-indigo-300 text-sm underline"
//                           >
//                             📎 View Evidence File
//                           </a>
//                         </div>
//                       )}

//                       {/* Actions */}
//                       <div className="flex gap-3 pt-4 border-t border-gray-700">
//                         {report.status === "pending" && (
//                           <>
//                             <button
//                               onClick={() =>
//                                 handleUpdateReportStatus(report._id, "reviewed")
//                               }
//                               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
//                             >
//                               Mark as Reviewed
//                             </button>
//                             <button
//                               onClick={() =>
//                                 handleUpdateReportStatus(report._id, "resolved")
//                               }
//                               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
//                             >
//                               ✅ Resolve
//                             </button>
//                             <button
//                               onClick={() =>
//                                 handleUpdateReportStatus(report._id, "rejected")
//                               }
//                               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
//                             >
//                               ❌ Reject
//                             </button>
//                           </>
//                         )}
//                         {report.status === "reviewed" && (
//                           <>
//                             <button
//                               onClick={() =>
//                                 handleUpdateReportStatus(report._id, "resolved")
//                               }
//                               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
//                             >
//                               ✅ Resolve
//                             </button>
//                             <button
//                               onClick={() =>
//                                 handleUpdateReportStatus(report._id, "rejected")
//                               }
//                               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
//                             >
//                               ❌ Reject
//                             </button>
//                           </>
//                         )}
//                       </div>

//                       {/* Admin Notes */}
//                       {report.adminNotes && (
//                         <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
//                           <p className="text-indigo-400 text-sm font-medium mb-1">
//                             Admin Notes:
//                           </p>
//                           <p className="text-gray-300 text-sm">
//                             {report.adminNotes}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ==================== MONITORING TAB (DEMO MODE) ==================== */}
//           {activeTab === "monitoring" && (
//             <div className="space-y-6">
//               {/* Demo Warning */}
//               <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Icons.AlertCircle />
//                   <p className="text-yellow-400 font-medium">
//                     Demo Mode - This section displays simulated data for preview
//                     purposes
//                   </p>
//                 </div>
//                 <DataBadge type="demo" />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {/* Online Users */}
//                 <div className="bg-gray-800 rounded-xl p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-white font-semibold">Online Users</h3>
//                     <Icons.RefreshCw />
//                   </div>
//                   <div className="text-center">
//                     <p className="text-5xl font-bold text-green-400 mb-2">0</p>
//                     <p className="text-gray-400 text-sm">Currently Active</p>
//                   </div>
//                 </div>

//                 {/* Active Calls */}
//                 <div className="bg-gray-800 rounded-xl p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-white font-semibold">Active Calls</h3>
//                     <Icons.Phone />
//                   </div>
//                   <div className="text-center">
//                     <p className="text-5xl font-bold text-blue-400 mb-2">0</p>
//                     <p className="text-gray-400 text-sm">In Progress</p>
//                   </div>
//                 </div>

//                 {/* Online Hosts */}
//                 <div className="bg-gray-800 rounded-xl p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-white font-semibold">Online Hosts</h3>
//                     <Icons.Users />
//                   </div>
//                   <div className="text-center">
//                     <p className="text-5xl font-bold text-purple-400 mb-2">0</p>
//                     <p className="text-gray-400 text-sm">Available</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-800 rounded-xl p-6">
//                 <p className="text-gray-400 text-center">
//                   📡 Real-time monitoring will be available in a future update
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* ==================== WALLET TAB (DEMO MODE) ==================== */}
//           {activeTab === "wallet" && (
//             <div className="space-y-6">
//               {/* Demo Warning */}
//               <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Icons.AlertCircle />
//                   <p className="text-yellow-400 font-medium">
//                     Demo Mode - Wallet data shown below is placeholder
//                   </p>
//                 </div>
//                 <DataBadge type="demo" />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
//                   <h3 className="text-sm opacity-90 mb-2">Total Earnings</h3>
//                   <p className="text-4xl font-bold">₹0.00</p>
//                   <p className="text-sm opacity-75 mt-2">This month</p>
//                 </div>

//                 <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
//                   <h3 className="text-sm opacity-90 mb-2">User Spending</h3>
//                   <p className="text-4xl font-bold">₹0.00</p>
//                   <p className="text-sm opacity-75 mt-2">This month</p>
//                 </div>

//                 <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
//                   <h3 className="text-sm opacity-90 mb-2">Active Wallets</h3>
//                   <p className="text-4xl font-bold">0</p>
//                   <p className="text-sm opacity-75 mt-2">With balance ₹0</p>
//                 </div>
//               </div>

//               <div className="bg-gray-800 rounded-xl p-6">
//                 <p className="text-gray-400 text-center">
//                   💰 Wallet analytics will be available in a future update
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* ==================== ANALYTICS TAB (REAL DATA) ==================== */}
//           {activeTab === "analytics" && stats && (
//             <div className="space-y-6">
//               {/* Info Banner */}
//               <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Icons.CheckCircle />
//                   <p className="text-green-400 font-medium">
//                     Analytics display real-time calculations from database
//                   </p>
//                 </div>
//                 <DataBadge type="real" />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="bg-gray-800 rounded-xl p-6">
//                   <h4 className="text-gray-400 text-sm mb-2">
//                     Average Daily Sign-ups
//                   </h4>
//                   <p className="text-3xl font-bold text-white">
//                     {stats.newUsers.week
//                       ? Math.round(stats.newUsers.week / 7)
//                       : 0}
//                   </p>
//                 </div>

//                 <div className="bg-gray-800 rounded-xl p-6">
//                   <h4 className="text-gray-400 text-sm mb-2">
//                     Verification Rate
//                   </h4>
//                   <p className="text-3xl font-bold text-white">
//                     {stats.totalUsers
//                       ? Math.round(
//                           (stats.verifiedUsers / stats.totalUsers) * 100,
//                         )
//                       : 0}
//                     %
//                   </p>
//                 </div>

//                 <div className="bg-gray-800 rounded-xl p-6">
//                   <h4 className="text-gray-400 text-sm mb-2">
//                     Growth This Week
//                   </h4>
//                   <p className="text-3xl font-bold text-white">
//                     +{stats.newUsers.week || 0}
//                   </p>
//                 </div>
//               </div>

//               <div className="bg-gray-800 rounded-xl p-6">
//                 <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                   User Growth Over Time
//                   <DataBadge type="real" />
//                 </h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={stats.registrationTrend || []}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                     <XAxis dataKey="date" stroke="#9ca3af" />
//                     <YAxis stroke="#9ca3af" />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: "#1f2937",
//                         border: "none",
//                         borderRadius: "8px",
//                       }}
//                     />
//                     <Bar dataKey="count" fill="#6366f1" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           )}

//           {/* ==================== USERS TAB (REAL DATA) ==================== */}
//           {activeTab === "users" && (
//             <div className="space-y-6">
//               <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Icons.CheckCircle />
//                   <p className="text-green-400 font-medium">
//                     User management displays real database records
//                   </p>
//                 </div>
//                 <DataBadge type="real" />
//               </div>

//               <div className="bg-gray-800 rounded-xl p-6">
//                 <h3 className="text-lg font-semibold text-white mb-4">
//                   All Users ({allUsers.length})
//                 </h3>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-gray-700">
//                         <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
//                           Name
//                         </th>
//                         <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
//                           Phone
//                         </th>
//                         <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
//                           Gender
//                         </th>
//                         <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
//                           Status
//                         </th>
//                         <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
//                           Date
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {allUsers.slice(0, 10).map((user) => (
//                         <tr
//                           key={user._id}
//                           className="border-b border-gray-700 hover:bg-gray-700/50"
//                         >
//                           <td className="py-3 px-4 text-white">
//                             {user.firstName} {user.lastName}
//                           </td>
//                           <td className="py-3 px-4 text-gray-300">
//                             {user.phone}
//                           </td>
//                           <td className="py-3 px-4 text-gray-300">
//                             {user.gender}
//                           </td>
//                           <td className="py-3 px-4">
//                             <span
//                               className={`px-3 py-1 rounded-full text-xs font-medium ${
//                                 user.isVerified
//                                   ? "bg-green-600/20 text-green-400"
//                                   : "bg-orange-600/20 text-orange-400"
//                               }`}
//                             >
//                               {user.isVerified ? "Verified" : "Unverified"}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4 text-gray-300">
//                             {new Date(user.createdAt).toLocaleDateString()}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ==================== SETTINGS TAB ==================== */}
//           {activeTab === "settings" && (
//             <div className="space-y-6">
//               <div className="bg-gray-800 rounded-xl p-6">
//                 <h3 className="text-lg font-semibold text-white mb-6">
//                   Account Settings
//                 </h3>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-gray-400 text-sm mb-2">
//                       Admin Email
//                     </label>
//                     <input
//                       type="email"
//                       defaultValue="admin@dating.com"
//                       className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-gray-400 text-sm mb-2">
//                       Admin Name
//                     </label>
//                     <input
//                       type="text"
//                       defaultValue="Super Admin"
//                       className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500"
//                     />
//                   </div>
//                   <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
