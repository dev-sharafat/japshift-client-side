import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import bannerimage1 from '../../assets/banner/banner1.png'
import bannerimage2 from '../../assets/banner/banner2.png'
import bannerimage3 from '../../assets/banner/banner3.png'
import { Carousel } from "react-responsive-carousel";
const Banner = () => {
  return (
    <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false}>
      <div>
        <img src={bannerimage1} />
      </div>
      <div>
        <img src={bannerimage2} />
      </div>
      <div>
        <img src={bannerimage3} />
      </div>
    </Carousel>
  );
};

export default Banner;
