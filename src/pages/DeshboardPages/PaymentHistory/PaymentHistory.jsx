import React from "react";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isPending, data: payments = {} } = useQuery({
    queryKey: ["payments", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email:${user.email}`);
      return res.data;
    },
  });
  console.log(payments);
  if(isPending){
    return "...loading payment data"
  }
  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">🧾 Payment History</h2>

      <table className="table table-zebra w-full">
        <thead className="bg-base-200">
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Parcel ID</th>
            <th>Amount ($)</th>
            <th>Method</th>
            <th>Transaction ID</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={payment._id}>
              <td>{index + 1}</td>
              <td className="text-sm">{payment.email}</td>
              <td className="text-sm">{payment.parcelId}</td>
              <td>${(payment.amount ).toFixed(2)}</td>
              <td>{payment.paymentMethod || "Card"}</td>
              <td className="text-xs break-all">{payment.transectionId}</td>
              <td>{new Date(payment.date_at_string).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
