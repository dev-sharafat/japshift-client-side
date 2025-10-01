import React from "react";
import JapSheftLogo from "../../ShearComponents/JapSheftLogo";
import { Outlet } from "react-router";
import authImage from "../../assets/authImage.png"
const AuthLayOut = () => {
  return (
      <div className="  lg:flex justify-between min-h-screen bg-[#ECEEEF]">
        <div className=" lg:w-[50%] ">
          <div>
            <JapSheftLogo />
          </div>
          <div className="lg:p-[100px] px-4 py-10">
            <Outlet />
          </div>
        </div>
        <div className="bg-[#FAFDF0] lg:w-[50%] lg:py-[100px]"  >
            <img src={authImage} alt="" data-aos="flip-right" data-aos-duration="1500"/>
        </div>
      </div>
  );
};

export default AuthLayOut;
