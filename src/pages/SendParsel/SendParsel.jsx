import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useLoaderData } from "react-router";

const SendParsel = () => {
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
    let baseCost = data.type === "document" ? 50 : 100;
    if (data.type === "non-document" && data.weight) {
      baseCost += parseFloat(data.weight) * 10;
    }

    toast(
      (t) => (
        <div>
          <p className="font-semibold">
            Estimated Delivery Cost: ৳ {baseCost.toFixed(2)}
          </p>
          <div className="mt-2 flex gap-2">
            <button
              className="btn btn-sm btn-success"
              onClick={() => {
                const parcelInfo = {
                  ...data,
                  creation_date: new Date().toISOString(),
                };
                console.log("Saved Parcel Data:", parcelInfo);
                toast.dismiss(t.id);
                toast.success("Parcel successfully created!");
                reset();
              }}
            >
              Confirm
            </button>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
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
    <div className="max-w-5xl mx-auto px-10 py-10 space-y-6 bg-white my-10 rounded-2xl ">
      <Toaster />
      <h2 className="text-3xl font-bold text-center">Send Your Parcel</h2>
      <p className="text-center text-gray-500">
        Fill the form to schedule your door-to-door delivery
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Parcel Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Parcel Info</h3>

          <div>
            <label className="font-medium mb-2 block">Parcel Type:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  {...register("type", { required: true })}
                  type="radio"
                  value="document"
                  className="radio radio-primary"
                />
                Document
              </label>
              <label className="flex items-center gap-2">
                <input
                  {...register("type", { required: true })}
                  type="radio"
                  value="non-document"
                  className="radio radio-primary"
                />
                Non-Document
              </label>
            </div>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">
                Parcel type is required
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                {...register("title", { required: "Parcel title is required" })}
                type="text"
                placeholder="Parcel Title"
                className="input input-bordered w-full"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            {parcelType === "non-document" && (
              <div>
                <input
                  {...register("weight")}
                  type="number"
                  step="0.1"
                  placeholder="Weight (kg)"
                  className="input input-bordered w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Sender & Receiver Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Sender & Receiver Info</h3>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sender */}
            <div className="flex-1 space-y-4 border rounded-xl p-4 shadow">
              <h4 className="font-semibold mb-2">Sender Info</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    {...register("sender_name", {
                      required: "Sender name is required",
                    })}
                    type="text"
                    placeholder="Sender Name"
                    className="input input-bordered w-full"
                  />
                  {errors.sender_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.sender_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    {...register("sender_contact", {
                      required: "Sender contact is required",
                    })}
                    type="text"
                    placeholder="Sender Contact"
                    className="input input-bordered w-full"
                  />
                  {errors.sender_contact && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.sender_contact.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <select
                    {...register("sender_region", {
                      required: "Select a region",
                    })}
                    className="select select-bordered w-full"
                    onChange={(e) => handleSenderRegion(e.target.value)}
                  >
                    <option value="">Select Region</option>
                    {districts.map((d) => (
                      <option key={d.district} value={d.district}>
                        {d.district}
                      </option>
                    ))}
                  </select>
                  {errors.sender_region && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.sender_region.message}
                    </p>
                  )}
                </div>

                <div>
                  <select
                    {...register("sender_center", {
                      required: "Select a service center",
                    })}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Service Center</option>
                    {senderCenters.map((area, idx) => (
                      <option key={idx} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  {errors.sender_center && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.sender_center.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    {...register("sender_address", {
                      required: "Pickup address is required",
                    })}
                    type="text"
                    placeholder="Pickup Address"
                    className="input input-bordered w-full"
                  />
                  {errors.sender_address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.sender_address.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <textarea
                  {...register("pickup_instruction", {
                    required: "Pickup instruction is required",
                  })}
                  placeholder="Pickup Instruction"
                  className="textarea textarea-bordered w-full"
                ></textarea>
                {errors.pickup_instruction && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.pickup_instruction.message}
                  </p>
                )}
              </div>
            </div>

            {/* Receiver */}
            <div className="flex-1 space-y-4 border rounded-xl p-4 shadow">
              <h4 className="font-semibold mb-2">Receiver Info</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    {...register("receiver_name", {
                      required: "Receiver name is required",
                    })}
                    type="text"
                    placeholder="Receiver Name"
                    className="input input-bordered w-full"
                  />
                  {errors.receiver_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.receiver_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    {...register("receiver_contact", {
                      required: "Receiver contact is required",
                    })}
                    type="text"
                    placeholder="Receiver Contact"
                    className="input input-bordered w-full"
                  />
                  {errors.receiver_contact && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.receiver_contact.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <select
                    {...register("receiver_region", {
                      required: "Select a region",
                    })}
                    className="select select-bordered w-full"
                    onChange={(e) => handleReceiverRegion(e.target.value)}
                  >
                    <option value="">Select Region</option>
                    {districts.map((d) => (
                      <option key={d.district} value={d.district}>
                        {d.district}
                      </option>
                    ))}
                  </select>
                  {errors.receiver_region && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.receiver_region.message}
                    </p>
                  )}
                </div>

                <div>
                  <select
                    {...register("receiver_center", {
                      required: "Select a service center",
                    })}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Service Center</option>
                    {receiverCenters.map((area, idx) => (
                      <option key={idx} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  {errors.receiver_center && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.receiver_center.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    {...register("receiver_address", {
                      required: "Delivery address is required",
                    })}
                    type="text"
                    placeholder="Delivery Address"
                    className="input input-bordered w-full"
                  />
                  {errors.receiver_address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.receiver_address.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <textarea
                  {...register("delivery_instruction", {
                    required: "Delivery instruction is required",
                  })}
                  placeholder="Delivery Instruction"
                  className="textarea textarea-bordered w-full"
                ></textarea>
                {errors.delivery_instruction && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.delivery_instruction.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button className="btn btn-primary px-8">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default SendParsel;
