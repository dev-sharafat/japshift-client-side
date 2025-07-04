import React from 'react';
import { Outlet } from 'react-router';
import NavBar from '../../ShearComponents/ForHome/NavBar';
import Footer from '../../ShearComponents/ForHome/Footer';

const RootLayout = () => {
    return (
        <div>
            <NavBar/>
            <Outlet/>
            <Footer/>
        </div>
    );
};

export default RootLayout;