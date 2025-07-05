import React from "react";
import image1 from "../../assets/live-tracking.png";
import image2 from "../../assets/safe-delivery.png";
// import image3 from "../../assets/call-support.png";

const features = [
  {
    id: 1,
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    image: image1,
  },
  {
    id: 2,
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    image: image2,
  },
  {
    id: 3,
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    image: image2,
  },
];

const FeatureSection = () => {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto space-y-6" >
      {features.map((feature) => (
        <div
          key={feature.id}
          className="flex flex-col md:flex-row items-center bg-base-100 rounded-xl shadow-md p-6 md:p-10 gap-6 md:gap-10"
        >
          {/* Image Part */}
          <div className="flex flex-col md:flex-row items-center md:items-start"  data-aos="fade-right" data-aos-duration="1500">
            <img
              src={feature.image}
              alt={feature.title}
              className="w-[200px] h-[200px] object-contain"
            />

            {/* Divider */}
            <div className="hidden md:block border-l-2 border-dashed border-gray-400 h-[220px] mx-6"></div>
          </div>

          {/* Text Part */}
          <div className="text-center md:text-left" data-aos="fade-left" data-aos-duration="1500">
            <h3 className="text-xl md:text-2xl font-bold  text-[Colors/Blue/blue-10] mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-500 max-w-xl">{feature.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default FeatureSection;
