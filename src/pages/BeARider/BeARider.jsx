import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import useAuth from "../../Hooks/useAuth";
import riderImg from "../../assets/agent-pending.png";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const BeARider = () => {
  const { user } = useAuth();
  const serviceCenters = useLoaderData();
  const axiosSecure = useAxiosSecure();
  const [districts, setDistricts] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Handle region selection
  const handleRegionChange = (region) => {
    const selected = serviceCenters.find((d) => d.district === region);
    setDistricts(selected?.covered_area || []);
    setValue("district", "");
  };

  // Submit rider application
  const onSubmit = (data) => {
    const riderData = {
      ...data,
      name: user?.displayName || "Anonymous",
      email: user?.email || "No Email",
      application_status: "pending",
      created_at: new Date().toISOString(),
    };

    axiosSecure.post("/riders", riderData).then((res) => {
      if  (res.data?.success === "successfully added") {
        Swal.fire({
          title: "Application Submitted!",
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Confirm & Submit",
          cancelButtonText: "Edit",
        }).then((result) => {
          if (result.isConfirmed) {
            console.log("Rider Application Saved:", riderData);
            Swal.fire(
              "Submitted!",
              "Your rider application has been sent.",
              "success"
            );
            reset();
          }
        });
      }
    });

    // Show SweetAlert with confirmation
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-10 my-10">
      <h2 className="text-3xl font-bold text-center mb-8">Be A Rider</h2>

      <div className="flex flex-col lg:flex-row gap-10 items-center justify-center">
        {/* Left: Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-4">
          {/* Name & Email */}
          <div className="flex gap-4">
            <input
              type="text"
              value={user?.displayName || ""}
              readOnly
              {...register("name")}
              className="input input-bordered w-full bg-gray-100"
            />
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              {...register("email")}
              className="input input-bordered w-full bg-gray-100"
            />
          </div>

          {/* Age & Phone */}
          <div className="flex gap-4">
            <input
              type="number"
              {...register("age", { required: "Age is required" })}
              placeholder="Age"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              {...register("phone", { required: "Phone number is required" })}
              placeholder="Phone Number"
              className="input input-bordered w-full"
            />
          </div>
          {errors.age && (
            <p className="text-red-500 text-sm">{errors.age.message}</p>
          )}
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}

          {/* Region & District */}
          <div className="flex gap-4">
            <select
              {...register("region", { required: "Select a region" })}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">Select Region</option>
              {serviceCenters.map((region) => (
                <option key={region.district} value={region.district}>
                  {region.district}
                </option>
              ))}
            </select>
            <select
              {...register("district", { required: "Select a district" })}
              className="select select-bordered w-full"
            >
              <option value="">Select District</option>
              {districts.map((d, idx) => (
                <option key={idx} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          {errors.region && (
            <p className="text-red-500 text-sm">{errors.region.message}</p>
          )}
          {errors.district && (
            <p className="text-red-500 text-sm">{errors.district.message}</p>
          )}

          {/* National ID & Bike Brand */}
          <div className="flex gap-4">
            <input
              type="text"
              {...register("nid", { required: "National ID is required" })}
              placeholder="National ID Number"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              {...register("bike_brand", {
                required: "Bike brand is required",
              })}
              placeholder="Bike Brand"
              className="input input-bordered w-full"
            />
          </div>
          {errors.nid && (
            <p className="text-red-500 text-sm">{errors.nid.message}</p>
          )}
          {errors.bike_brand && (
            <p className="text-red-500 text-sm">{errors.bike_brand.message}</p>
          )}

          {/* Bike Registration */}
          <input
            type="text"
            {...register("bike_registration", {
              required: "Bike registration number is required",
            })}
            placeholder="Bike Registration Number"
            className="input input-bordered w-full"
          />
          {errors.bike_registration && (
            <p className="text-red-500 text-sm">
              {errors.bike_registration.message}
            </p>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <button type="submit" className="btn btn-primary px-8">
              Submit Application
            </button>
          </div>
        </form>

        {/* Right: Image */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src={riderImg}
            alt="Be a Rider"
            className="max-h-96 object-cover rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default BeARider;
