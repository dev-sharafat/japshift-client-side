import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);

  // Fetch active riders (approved)
  const {
    data: riders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/approved");
      return res.data;
    },
  });

  // Handle deactivate rider
  const handleDeactivate = async (rider) => {
    const confirm = await Swal.fire({
      title: "Deactivate Rider?",
      text: `Are you sure you want to deactivate ${rider.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Deactivate",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoadingAction(rider._id);
      await axiosSecure.patch(`/riders/${rider._id}`, {
        application_status: "inactive",
      });
      Swal.fire("Deactivated!", `${rider.name}'s account is now inactive.`, "success");
      refetch();
    } catch (error) {
      Swal.fire("Error", "Failed to deactivate rider.", error);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center sm:text-left">Active Riders</h2>

      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : riders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Region</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider) => (
                <tr key={rider._id} className="hover:bg-gray-50">
                  <td>{rider.name}</td>
                  <td>{rider.email}</td>
                  <td>{rider.phone}</td>
                  <td>{rider.region}</td>
                  <td>
                    <span className="badge badge-success">
                      {rider.application_status === "approved" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => setSelectedRider(rider)}
                      className="btn btn-sm btn-info w-full sm:w-auto"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeactivate(rider)}
                      disabled={loadingAction === rider._id}
                      className="btn btn-sm btn-warning w-full sm:w-auto"
                    >
                      {loadingAction === rider._id ? "Processing..." : "Deactivate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No active riders found</p>
      )}

      {/* Modal for Rider Details */}
      {selectedRider && (
        <dialog open className="modal">
          <div className="modal-box w-full max-w-[95%] sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
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
              <p>
                <strong>Status:</strong>{" "}
                <span className="badge badge-success">
                  {selectedRider.application_status === "approved" ? "Active" : "Inactive"}
                </span>
              </p>
              <p>
                <strong>Approved On:</strong>{" "}
                {new Date(selectedRider.created_at).toLocaleString()}
              </p>
            </div>
            <div className="modal-action flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => handleDeactivate(selectedRider)}
                className="btn btn-warning w-full sm:w-auto"
              >
                Deactivate
              </button>
              <button
                onClick={() => setSelectedRider(null)}
                className="btn btn-ghost w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ActiveRiders;
