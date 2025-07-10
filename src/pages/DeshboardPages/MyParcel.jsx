import React from "react";
import useAuth from "../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const MyParcel = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate()
//   const queryClient = useQueryClient();

  const { data: parcels = [], isLoading ,refetch } = useQuery({
    queryKey: ["my-parcels", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/myparcels?email=${user.email}`);
      return res.data;
    },
  });

  const handleView = (id) => {
    const parcel = parcels.find((p) => p._id === id);
    if (parcel) {
      Swal.fire({
        title: `Parcel Info`,
        html: `
          <p><strong>Title:</strong> ${parcel.title}</p>
          <p><strong>Sender:</strong> ${parcel.sender_name}</p>
          <p><strong>Receiver:</strong> ${parcel.receiver_name}</p>
          <p><strong>Type:</strong> ${parcel.type}</p>
          <p><strong>Cost:</strong> ৳${parcel.delivery_cost}</p>
        `,
        icon: "info",
      });
    }
  };

  const handlePay = (id) => {
    console.log("Proceed to payment for", id);
    navigate(`/deshboard/payment/${id}`)
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This parcel will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/myparcel/${id}`);
        Swal.fire("Deleted!", "Parcel has been removed.", "success");
        // queryClient.invalidateQueries(["my-parcels", user.email]);
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error", "Failed to delete the parcel.", "error",1500);
      }
    }
    refetch()
  };

  const formatDate = (iso) => {
    return new Date(iso).toLocaleString();
  };

  if (isLoading) return <div className="p-4">Loading parcels...</div>;

  return (
    <div className="overflow-x-auto shadow-md rounded-xl">
      <table className="table table-zebra w-full">
        <thead className="bg-base-200 text-base font-semibold">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Type</th>
            <th>Created At</th>
            <th>Cost</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((parcel, index) => (
            <tr key={parcel._id}>
              <td>{index + 1}</td>
              <td className="max-w-[180px] truncate">{parcel.title}</td>
              <td className="capitalize">{parcel.type}</td>
              <td>{formatDate(parcel.creation_date)}</td>
              <td>৳{parcel.delivery_cost}</td>
              <td>
                <span
                  className={`badge ${
                    parcel.payment_status === "paid"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {parcel.payment_status}
                </span>
              </td>
              <td className="space-x-2">
                <button
                  onClick={() => handleView(parcel._id)}
                  className="btn btn-xs btn-outline"
                >
                  View
                </button>
                {parcel.payment_status === "unpaid" && (
                  <button
                    onClick={() => handlePay(parcel._id)}
                    className="btn btn-xs btn-primary text-black"
                  >
                    Pay
                  </button>
                )}
                <button
                  onClick={() => handleDelete(parcel._id)}
                  className="btn btn-xs btn-error"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {parcels.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center text-gray-500 py-6">
                No parcels found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyParcel;
