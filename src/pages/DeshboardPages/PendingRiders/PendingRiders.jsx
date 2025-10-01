import React, { useState } from "react";
import Swal from "sweetalert2";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedRider, setSelectedRider] = useState(null);

  // Fetch pending riders
  const { data: riders = [], isLoading } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  // Approve rider (no useMutation)
  const handleApprove = async (rider) => {
    // const email = rider.email
    const confirm = await Swal.fire({
      title: "Approve Rider?",
      text: `Are you sure you want to approve ${rider.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/riders/${rider._id}`, {
        application_status: "approved",
        email:rider?.email
      });
      Swal.fire("Approved!", "Rider has been approved.", "success");
      queryClient.invalidateQueries(["pendingRiders"]);
      setSelectedRider(null);
    } catch (err) {
      Swal.fire("Error", "Failed to approve rider.",err);
    }
  };

  // Cancel rider (no useMutation)
  const handleCancel = async (rider) => {
  const confirm = await Swal.fire({
    title: "Reject Application?",
    text: `Are you sure you want to reject ${rider.name}'s application?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Reject",
    cancelButtonText: "No",
  });

  if (!confirm.isConfirmed) return;

  try {
    // Change from delete to patch
    await axiosSecure.patch(`/riders/${rider._id}`, {
      application_status: "rejected",
    });
    Swal.fire("Rejected!", "Rider application has been rejected.", "error");
    queryClient.invalidateQueries(["pendingRiders"]);
    setSelectedRider(null);
  } catch (err) {
    Swal.fire("Error", "Failed to reject rider.", err);
  }
};


  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6">Pending Riders</h2>

      {/* Loading State */}
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Region</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {riders.length > 0 ? (
                riders.map((rider) => (
                  <tr key={rider._id}>
                    <td>{rider.name}</td>
                    <td>{rider.email}</td>
                    <td>{rider.region}</td>
                    <td>
                      <span className="badge badge-warning">
                        {rider.application_status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedRider(rider)}
                        className="btn btn-sm btn-info"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No pending riders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Rider Details */}
      {selectedRider && (
        <dialog open className="modal">
          <div className="modal-box max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Rider Details</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedRider.name}</p>
              <p><strong>Email:</strong> {selectedRider.email}</p>
              <p><strong>Phone:</strong> {selectedRider.phone}</p>
              <p><strong>Age:</strong> {selectedRider.age}</p>
              <p><strong>Region:</strong> {selectedRider.region}</p>
              <p><strong>District:</strong> {selectedRider.district}</p>
              <p><strong>National ID:</strong> {selectedRider.nid}</p>
              <p><strong>Bike Brand:</strong> {selectedRider.bike_brand}</p>
              <p><strong>Bike Registration:</strong> {selectedRider.bike_registration}</p>
              <p><strong>Applied On:</strong> {new Date(selectedRider.created_at).toLocaleString()}</p>
            </div>
            <div className="modal-action">
              <button onClick={() => handleApprove(selectedRider)} className="btn btn-success">
                Approve
              </button>
              <button onClick={() => handleCancel(selectedRider)} className="btn btn-error">
                Rejected
              </button>
              <button onClick={() => setSelectedRider(null)} className="btn btn-ghost">
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default PendingRiders;
