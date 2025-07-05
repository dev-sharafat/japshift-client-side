import React from "react";
import Marquee from "react-fast-marquee";
import logo1 from '../../assets/brands/amazon.png'
import logo2 from '../../assets/brands/amazon_vector.png'
import logo3 from '../../assets/brands/casio.png'
import logo4 from '../../assets/brands/moonstar.png'
import logo5 from '../../assets/brands/randstad.png'
import logo6 from '../../assets/brands/start-people 1.png'
import logo7 from '../../assets/brands/start.png'
const logos = [logo1,logo2,logo3,logo4,logo5,logo6,logo7];

const ClientSlider = () => {
  return (
    <section className="py-12 bg-base-200">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Trusted by Leading Companies</h2>

      <Marquee speed={50} gradient={false} direction="left">
        {logos.map((logo, index) => (
          <div key={index} className="mx-24 flex justify-center items-center gap-5 ">
            <img src={logo} alt={`Client ${index + 1}`} className="h-6 object-contain" />
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default ClientSlider;
