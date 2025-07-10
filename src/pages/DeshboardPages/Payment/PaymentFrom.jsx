import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";

const PaymentFrom = () => {
  const stripe = useStripe();
  const {user} = useAuth()
  const navigate = useNavigate()
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const [error, setError] = useState("");
  const { parcelId } = useParams();
  console.log(parcelId);
  const { data: parcelInfo = {}, isPending } = useQuery({
    queryKey: ["myparcel", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/myparcels/${parcelId}`);
      return res.data;
    },
  });
  if (isPending) {
    return "...loading";
  }
  console.log(parcelInfo);
  const amount = parcelInfo.delivery_cost;
  const amountInCents = amount * 100;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (card == null) {
      return;
    }
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (error) {
      console.log("Error is ", error);

      setError(error.message);
    } else {
      setError("");
      console.log("Payment Method is: ", paymentMethod);

      // card intent

      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        parcelId,
      });
      console.log(" res from intent", res);

      const clientSecret = res.data.clientSecret;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: "Jenny Rosen",
          },
        },
      });
      if (result.error) {
        console.log(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          console.log("Payment succeeded!");
          console.log(result);
          const paymentsDatas = {
            parcelId:parcelId,
            email: user.email,
            amount:amount,
            paymentMethod: result?.paymentIntent?.payment_method_types,
            transectionId:result?.paymentIntent?.id
          }
          const paymentsRes = await axiosSecure.post("/payments",paymentsDatas)
          console.log(paymentsRes);
          if(paymentsRes?.data?.id){
            Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: `Transaction ID: ${result.paymentIntent.id}`,
            confirmButtonText: "Go to My Parcels",
          }).then(() => {
            navigate("/myPercel");
          });
          }
        }
      }
    }
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-10 mx-auto max-w-md p-4 space-y-4 shadow-lg rounded-md bg-white"
      >
        <CardElement className="p-2 border rounded"></CardElement>
        <button
          type="submit"
          disabled={!stripe}
          className="btn btn-primary w-full mt-4"
        >
          Pay ${amount}
        </button>
        {error && <p className="text-red-800">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentFrom;
