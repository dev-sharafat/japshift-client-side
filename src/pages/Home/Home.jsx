import React from 'react';
import Banner from '../../Components/HomeComponents/Banner';
import Service from '../../Components/HomeComponents/Service';
import ClientSlider from '../../Components/HomeComponents/ClientSlider';
import FeatureSection from '../../Components/HomeComponents/FeatureSection';
import MarchentSection from '../../Components/HomeComponents/MarchentSection';

const Home = () => {
    return (
        <div>
            <Banner/>
            <Service/>
            <ClientSlider/>
            <FeatureSection/>
            <MarchentSection/>
        </div>
    );
};

export default Home;