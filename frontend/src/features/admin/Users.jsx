import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Cancel01Icon,  RefreshIcon, Search01Icon,  UserBlock01Icon, UserCheck01Icon, UserRemove01Icon } from "hugeicons-react";
import { deleteUser,  fetchUserStats, refreshUsers, resetSearchedUsers, searchUsers, toggleBanUser, verifyUser } from "../../app/slices/userSlice";
import { formatDateInfo } from "../../utils/formatDate";

const UserMangement = () => {
  const { users, stats, searchedUsers } = useSelector((state) => state.users);

  const dispatch = useDispatch();

  // Fetch statistics if not already loaded
  useEffect(() => {
    if (!stats || Object.keys(stats).length === 0) {
      dispatch(fetchUserStats());
    }
  }, [dispatch, stats]);

  const onVerify = (id) => {
    if (window.confirm("Are you sure you want to Verify this User?")) {
      dispatch(verifyUser(id));
    }
  };

  const onBan = (id) => {
    if (window.confirm("Are you sure you want to Ban/Unban this User?")) {
      dispatch(toggleBanUser(id));
    }
  };

  const onDelete = (id) => {
    if (window.confirm("Are you sure you want to Delete this User?")) {
      dispatch(deleteUser(id));
    }
  };

  const [searchType, setSearchType] = useState("id");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");

  const handleSearch = () => {
    dispatch(searchUsers({ [searchType]: searchTerm, status }));
  };

  const handleClear = () => {
    setSearchTerm("");
    setStatus("");
    dispatch(resetSearchedUsers())
  };

  const handleRefresh = () => {
    dispatch(refreshUsers());
  }


  return (
    <>
      <div className="flex items-center justify-between bg-white mb-4 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-700 p-4">
        <h3 className="text-xl font-medium dark:text-gray-200">Users</h3>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 px-3 py-1.5 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-950 transition"

        >
          <RefreshIcon size={14} />
          Refresh
        </button>

      </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="p-4 bg-white dark:bg-zinc-950  border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Users</h3>
            <p className="text-2xl font-bold text-purple-500">{stats.totalUsers}</p>
          </div>

          <div className="p-4 bg-white dark:bg-zinc-950  border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Verified Users</h3>
            <p className="text-2xl font-bold text-green-500">{stats.verifiedUsers}</p>
          </div>

          <div className="p-4 bg-white dark:bg-zinc-950  border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Unverified Users</h3>
            <p className="text-2xl font-bold text-red-500">{stats.unverifiedUsers}</p>
          </div>

          <div className="p-4 bg-white dark:bg-zinc-950  border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">New Users <span className="text-xs text-zinc-500">Last 30 days</span></h3>
            <p className="text-2xl font-bold text-blue-500">{stats.newUsers}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-950  border border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Banned Users</h3>
            <p className="text-2xl font-bold text-yellow-500">{stats.bannedUsers}</p>
          </div>

        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-700 p-4 mb-6">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-purple-500"
          >
            <option value="id">Search by ID</option>
            <option value="name">Search by Name</option>
            <option value="email">Search by Email</option>
          </select>

          <input
            type="text"
            placeholder={`Enter ${searchType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-600 bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Status</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>

          <div className="flex gap-2 items-center">
            <button
              onClick={handleSearch}
              className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Search01Icon size={18} />
              Search
            </button>
            <button
              onClick={handleClear}
              className="border border-purple-500 hover:bg-purple-600 hover:text-white dark:text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Cancel01Icon size={18} />
              Clear
            </button>
          </div>
        </div>
        
      <div className="w-full scrollbar-base overflow-x-auto  bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-700 p-4 shadow-sm">

        <div className="">
          <table className="min-w-full bg-white dark:bg-zinc-950 border dark:border-zinc-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-zinc-900 dark:text-gray-300 border-b dark:border-zinc-700">
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">#</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Id</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Email</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Verified</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Accound Created</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Last Login</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="dark:text-zinc-400">
              {(searchedUsers.length > 0 ? searchedUsers : users)?.map((user, index) => (
                <tr
                  key={user._id}
                  className={`cursor-pointer transition hover:bg-gray-50 dark:hover:bg-zinc-950 dark:border-zinc-700 border-b border-zinc-200}`}
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{user._id}</td>
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.isVerified ? "Yes" : "No"}</td>
                  <td className="py-3 px-4">{formatDateInfo(user.createdAt).exactTime }</td>
                  <td className="py-3 px-4">{user.lastLogin}</td>


                  <td className="py-3 px-4 flex items-center gap-2">
                    {/* Verify User */}
                    {!user.isVerified && (
                      <button
                        title="Verify"
                        className="p-1.5 rounded-md border dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 hover:bg-gray-100 dark:hover:bg-zinc-700 text-green-500"
                        onClick={() => onVerify(user._id)}
                      >
                        <UserCheck01Icon size={18} />
                      </button>
                    )}

                    {/* Ban/Unban User */}
                    <button
                      title={user.isBanned ? "Unban" : "Ban"}
                      className={`p-1.5 rounded-md border dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 hover:bg-gray-100 dark:hover:bg-zinc-700 ${user.isBanned ? "text-yellow-500" : "text-red-500"
                        }`}
                      onClick={() => onBan(user._id)}
                    >
                      <UserBlock01Icon size={18} />
                    </button>

                    {/* 🗑️ Delete User */}
                    <button
                      title="Delete"
                      className="p-1.5 rounded-md border dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 hover:bg-gray-100 dark:hover:bg-zinc-700 text-red-500"
                      onClick={() => onDelete(user._id)}
                    >
                      <UserRemove01Icon size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users?.length === 0 && <p className="py-2 text-center text-gray-400">No users found</p>}
      </div>
    </>
  );
};

export default UserMangement;