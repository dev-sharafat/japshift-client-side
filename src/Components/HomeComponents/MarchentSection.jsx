import React from "react";
import location from "../../assets/location-merchant.png";
const MarchentSection = () => {
  return (
    <div className="lg:p-12 bg-[#03373D] rounded-2xl mx-4 mb-10 bg-[url('assets/be-a-merchant-bg.png')] bg-no-repeat ">
      <div className="hero-content flex-col lg:flex-row-reverse gap-[100px] ">
        <img src={location} className="max-w-sm rounded-lg shadow-2xl" />
        <div>
          <h1 className="lg:text-4xl text-2xl font-bold text-white">
            Merchant and Customer Satisfaction <br /> is Our First Priority
          </h1>
          <p className="py-6 text-gray-400 lg:w-[673px]">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>
          <div className="flex flex-col lg:flex-row gap-5">
            <button className="btn btn-outline rounded-full text-[#CAEB66] hover:text-black hover:bg-[#CAEB66]">
              Become a Merchant
            </button>
            <button className="btn btn-outline  rounded-full text-[#CAEB66] hover:text-black hover:bg-[#CAEB66] ">
              Earn with Profast Courier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarchentSection;
