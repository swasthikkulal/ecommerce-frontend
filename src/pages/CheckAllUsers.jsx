import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const nav = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    authenticateAdmin();
  }, []);

  const authenticateAdmin = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/user/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });
      const data = await response.json();
      if (data.success) {
        nav("/checkallusers");
      } else {
        nav("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/admin/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      const result = await response.json();

      if (result.success) {
        setUsers(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search
  const filteredUsers = users.filter((user) => {
    return (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-500 text-white";
      case "user":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 text-lg font-medium">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto mt-[10%]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            User Management
          </h1>
          <p className="text-gray-700 text-lg">
            Manage and monitor all registered users
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform hover:scale-105 transition duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500 rounded-xl">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-base font-semibold text-gray-700">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {users.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform hover:scale-105 transition duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-red-500 rounded-xl">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-base font-semibold text-gray-700">Admins</p>
                <p className="text-3xl font-bold text-gray-900">
                  {users.filter((user) => user.role === "admin").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform hover:scale-105 transition duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-green-500 rounded-xl">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-base font-semibold text-gray-700">
                  Regular Users
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {users.filter((user) => user.role === "user").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6 p-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Updated At
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-300">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-lg font-semibold text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-base text-gray-700">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span
                        className={`inline-flex px-4 py-2 text-sm font-bold rounded-full capitalize shadow-sm ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-base font-medium text-gray-900">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-base font-medium text-gray-900">
                      {formatDate(user.updatedAt)}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-base font-semibold">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                No users found
              </h3>
              <p className="mt-2 text-lg text-gray-700">
                {searchTerm
                  ? "Try changing your search criteria"
                  : "No users registered yet"}
              </p>
            </div>
          )}
        </div>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    User Details
                  </h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-center mb-6">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                      {selectedUser.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-base font-semibold text-gray-700 block mb-2">
                        Name
                      </label>
                      <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        {selectedUser.name}
                      </p>
                    </div>

                    <div>
                      <label className="text-base font-semibold text-gray-700 block mb-2">
                        Email
                      </label>
                      <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        {selectedUser.email}
                      </p>
                    </div>

                    <div>
                      <label className="text-base font-semibold text-gray-700 block mb-2">
                        Role
                      </label>
                      <p
                        className={`inline-flex px-4 py-2 text-sm font-bold rounded-full capitalize ${getRoleBadgeColor(
                          selectedUser.role
                        )}`}
                      >
                        {selectedUser.role}
                      </p>
                    </div>

                    <div>
                      <label className="text-base font-semibold text-gray-700 block mb-2">
                        User ID
                      </label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono break-all">
                        {selectedUser._id}
                      </p>
                    </div>

                    <div>
                      <label className="text-base font-semibold text-gray-700 block mb-2">
                        Created At
                      </label>
                      <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        {formatDate(selectedUser.createdAt)}
                      </p>
                    </div>

                    <div>
                      <label className="text-base font-semibold text-gray-700 block mb-2">
                        Last Updated
                      </label>
                      <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        {formatDate(selectedUser.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckAllUsers;
