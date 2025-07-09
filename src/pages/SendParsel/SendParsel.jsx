import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useLoaderData } from "react-router";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
// import axios from "axios";

const SendParsel = () => {
  const {user} = useAuth()
  const axiosSecure = useAxiosSecure()
  const districts = useLoaderData();
  const [senderCenters, setSenderCenters] = useState([]);
  const [receiverCenters, setReceiverCenters] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const withinSameDistrict = data.sender_region === data.receiver_region;
    let baseCost = 0;
    const weight = parseFloat(data.weight) || 0;
    let baseCostText = "";
    let extraCharges = 0;
    let extraDetails = "None";

    if (data.type === "document") {
      baseCost = withinSameDistrict ? 60 : 80;
      baseCostText = withinSameDistrict ? "৳60 (Within Same District)" : "৳80 (Outside District)";
    } else if (data.type === "non-document") {
      if (weight <= 3) {
        baseCost = withinSameDistrict ? 110 : 150;
        baseCostText = withinSameDistrict ? "৳110 (Up to 3kg, Within Same District)" : "৳150 (Up to 3kg, Outside District)";
      } else {
        const extraKg = weight - 3;
        extraCharges = extraKg * 40;
        if (withinSameDistrict) {
          baseCost = 110 + extraCharges;
          baseCostText = "৳110 (First 3kg, Within Same District)";
          extraDetails = `৳${extraCharges.toFixed(2)} for ${extraKg.toFixed(2)}kg extra`;
        } else {
          baseCost = 150 + extraCharges + 40;
          baseCostText = "৳150 (First 3kg, Outside District)";
          extraDetails = `৳${extraCharges.toFixed(2)} for ${extraKg.toFixed(2)}kg extra + ৳40 Cross-District Fee`;
          extraCharges += 40;
        }
      }
    }

    Swal.fire({
      title: 'Confirm Your Parcel',
      html: `
        <div style="text-align: left; line-height: 1.8;">
          <b>Parcel Type:</b> ${data.type === "document" ? "Document" : "Non-Document"} <br>
          <b>Weight:</b> ${parcelType === "document" ? "N/A" : `${weight} kg`} <br>
          <b>Delivery Zone:</b> ${withinSameDistrict ? "Within Same District" : "Outside District"} <br>
          <hr style="margin: 10px 0;">
          <b>Base Cost:</b> ${baseCostText} <br>
          <b>Extra Charges:</b> ${extraDetails} <br>
          <b style="font-size: 18px; color: green;">Total Cost: ৳ ${baseCost.toFixed(2)}</b>
        </div>
        <br>Do you want to proceed to payment?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Proceed to Payment',
      cancelButtonText: 'Go Back & Edit',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        const parcelInfo = {
          ...data,
          delivery_cost: baseCost,
          created_by: user?.email,
          creation_date: new Date().toISOString(),
          tracking_id: `TRK${Date.now()}`,
          delivery_status: "not-collected",
          payment_status: "unpaid"
        };
        console.log("Saved Parcel Data:", parcelInfo);

        axiosSecure.post('/parcels', parcelInfo)
        // axios.post('http://localhost:5000/parcels', parcelInfo)
        .then(res =>{
          console.log(res.data);
          Swal.fire('Success!', 'Parcel successfully created! Proceed to payment.', 'success');
          reset();
          
        })
        .catch(error => {
          Swal.fire(error.message)
        })
      }
    });
  };

  const parcelType = watch("type");

  const handleSenderRegion = (region) => {
    const selected = districts.find((d) => d.district === region);
    setSenderCenters(selected?.covered_area || []);
    setValue("sender_center", "");
  };

  const handleReceiverRegion = (region) => {
    const selected = districts.find((d) => d.district === region);
    setReceiverCenters(selected?.covered_area || []);
    setValue("receiver_center", "");
  };

  return (
    <div className="max-w-5xl mx-auto px-10 py-10 space-y-6 bg-white my-10 rounded-2xl">
      <h2 className="text-3xl font-bold text-center">Send Your Parcel</h2>
      <p className="text-center text-gray-500">Fill the form to schedule your door-to-door delivery</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Parcel Info</h3>

          <div>
            <label className="font-medium mb-2 block">Parcel Type:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input {...register("type", { required: true })} type="radio" value="document" className="radio radio-primary" /> Document
              </label>
              <label className="flex items-center gap-2">
                <input {...register("type", { required: true })} type="radio" value="non-document" className="radio radio-primary" /> Non-Document
              </label>
            </div>
            {errors.type && <p className="text-red-500 text-sm mt-1">Parcel type is required</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input {...register("title", { required: "Parcel title is required" })} type="text" placeholder="Parcel Title" className="input input-bordered w-full" />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>
            {parcelType === "non-document" && (
              <div>
                <input {...register("weight", { required: "Weight is required for Non-Document parcels", min: { value: 0.1, message: "Weight must be positive" } })} type="number" step="0.1" placeholder="Weight (kg)" className="input input-bordered w-full" />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Sender & Receiver Info</h3>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-4 border rounded-xl p-4 shadow">
              <h4 className="font-semibold mb-2">Sender Info</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input {...register("sender_name", { required: "Sender name is required" })} type="text" placeholder="Sender Name" className="input input-bordered w-full" />
                  {errors.sender_name && <p className="text-red-500 text-sm mt-1">{errors.sender_name.message}</p>}
                </div>
                <div>
                  <input {...register("sender_contact", { required: "Sender contact is required" })} type="text" placeholder="Sender Contact" className="input input-bordered w-full" />
                  {errors.sender_contact && <p className="text-red-500 text-sm mt-1">{errors.sender_contact.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <select {...register("sender_region", { required: "Select a region" })} className="select select-bordered w-full" onChange={(e) => handleSenderRegion(e.target.value)}>
                    <option value="">Select Region</option>
                    {districts.map((d) => (<option key={d.district} value={d.district}>{d.district}</option>))}
                  </select>
                  {errors.sender_region && <p className="text-red-500 text-sm mt-1">{errors.sender_region.message}</p>}
                </div>
                <div>
                  <select {...register("sender_center", { required: "Select a service center" })} className="select select-bordered w-full">
                    <option value="">Select Service Center</option>
                    {senderCenters.map((area, idx) => (<option key={idx} value={area}>{area}</option>))}
                  </select>
                  {errors.sender_center && <p className="text-red-500 text-sm mt-1">{errors.sender_center.message}</p>}
                </div>
              </div>

              <input {...register("sender_address", { required: "Pickup address is required" })} type="text" placeholder="Pickup Address" className="input input-bordered w-full mt-4" />
              {errors.sender_address && <p className="text-red-500 text-sm mt-1">{errors.sender_address.message}</p>}

              <textarea {...register("pickup_instruction", { required: "Pickup instruction is required" })} placeholder="Pickup Instruction" className="textarea textarea-bordered w-full mt-4"></textarea>
              {errors.pickup_instruction && <p className="text-red-500 text-sm mt-1">{errors.pickup_instruction.message}</p>}
            </div>

            <div className="flex-1 space-y-4 border rounded-xl p-4 shadow">
              <h4 className="font-semibold mb-2">Receiver Info</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input {...register("receiver_name", { required: "Receiver name is required" })} type="text" placeholder="Receiver Name" className="input input-bordered w-full" />
                  {errors.receiver_name && <p className="text-red-500 text-sm mt-1">{errors.receiver_name.message}</p>}
                </div>
                <div>
                  <input {...register("receiver_contact", { required: "Receiver contact is required" })} type="text" placeholder="Receiver Contact" className="input input-bordered w-full" />
                  {errors.receiver_contact && <p className="text-red-500 text-sm mt-1">{errors.receiver_contact.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <select {...register("receiver_region", { required: "Select a region" })} className="select select-bordered w-full" onChange={(e) => handleReceiverRegion(e.target.value)}>
                    <option value="">Select Region</option>
                    {districts.map((d) => (<option key={d.district} value={d.district}>{d.district}</option>))}
                  </select>
                  {errors.receiver_region && <p className="text-red-500 text-sm mt-1">{errors.receiver_region.message}</p>}
                </div>
                <div>
                  <select {...register("receiver_center", { required: "Select a service center" })} className="select select-bordered w-full">
                    <option value="">Select Service Center</option>
                    {receiverCenters.map((area, idx) => (<option key={idx} value={area}>{area}</option>))}
                  </select>
                  {errors.receiver_center && <p className="text-red-500 text-sm mt-1">{errors.receiver_center.message}</p>}
                </div>
              </div>

              <input {...register("receiver_address", { required: "Delivery address is required" })} type="text" placeholder="Delivery Address" className="input input-bordered w-full mt-4" />
              {errors.receiver_address && <p className="text-red-500 text-sm mt-1">{errors.receiver_address.message}</p>}

              <textarea {...register("delivery_instruction", { required: "Delivery instruction is required" })} placeholder="Delivery Instruction" className="textarea textarea-bordered w-full mt-4"></textarea>
              {errors.delivery_instruction && <p className="text-red-500 text-sm mt-1">{errors.delivery_instruction.message}</p>}
            </div>
          </div>
        </div>

        <div className="text-center">
          <button className="btn btn-primary px-8">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default SendParsel;