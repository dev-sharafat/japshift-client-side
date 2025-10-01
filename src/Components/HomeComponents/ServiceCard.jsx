import React from "react";

const ServiceCard = ({ service}) => {
    const {title,description,icon:Icon} = service
  return (
    <div className="bg-base-100 shadow-lg rounded-2xl p-5 text-center hover:bg-[rgb(202,235,102)] transition duration-300 cursor-pointer group">
      <div className="text-4xl text-primary mx-auto mb-4 flex justify-center">
        <Icon />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default ServiceCard;
