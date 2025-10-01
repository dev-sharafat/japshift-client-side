import React, { useState } from "react";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const ManageAdmins = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchEmail, setSearchEmail] = useState("");

  // Fetch users based on search email
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["searchUsers", searchEmail],
    queryFn: async () => {
      if (!searchEmail.trim()) return [];
      const res = await axiosSecure.get(`/users/search?email=${searchEmail}`);
      return res.data;
    },
    enabled: !!searchEmail.trim(), // Only fetch when there's an email
  });

  // Mutation to make user admin
  const makeAdminMutation = useMutation({
    mutationFn: async (userId) =>
      axiosSecure.patch(`/users/${userId}`, { role: "admin" }),
    onSuccess: () => {
      Swal.fire("Success", "User is now an admin.", "success");
      queryClient.invalidateQueries(["searchUsers", searchEmail]); // Refresh search
    },
    onError: () => Swal.fire("Error", "Failed to make user admin.", "error"),
  });

  // Mutation to remove admin
  const removeAdminMutation = useMutation({
    mutationFn: async (userId) =>
      axiosSecure.patch(`/users/${userId}`, { role: "user" }),
    onSuccess: () => {
      Swal.fire("Success", "Admin role removed.", "success");
      queryClient.invalidateQueries(["searchUsers", searchEmail]); // Refresh search
    },
    onError: () => Swal.fire("Error", "Failed to remove admin.", "error"),
  });

  // Confirm before making user admin
  const handleMakeAdmin = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to make this user an Admin?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Make Admin",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        makeAdminMutation.mutate(userId);
      }
    });
  };

  // Confirm before removing admin
  const handleRemoveAdmin = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove Admin privileges from this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove Admin",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        removeAdminMutation.mutate(userId);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Manage Admins</h2>

      {/* Search Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="input input-bordered flex-1"
        />
      </div>

      {/* Loading State */}
      {isLoading && <p className="text-center">Searching...</p>}

      {/* Results Table */}
      {!isLoading && users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Email</th>
                <th>Created At</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === "admin" ? "badge-success" : "badge-neutral"
                      }`}
                    >
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="flex gap-2">
                    {user.role === "admin" ? (
                      <button
                        onClick={() => handleRemoveAdmin(user._id)}
                        className="btn btn-sm btn-error"
                        disabled={removeAdminMutation.isLoading}
                      >
                        Remove Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMakeAdmin(user._id)}
                        className="btn btn-sm btn-success"
                        disabled={makeAdminMutation.isLoading}
                      >
                        Make Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No Results */}
      {!isLoading && users.length === 0 && searchEmail && (
        <p className="text-center mt-4">No users found.</p>
      )}
    </div>
  );
};

export default ManageAdmins;
