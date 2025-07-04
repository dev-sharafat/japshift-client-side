import React from 'react';
import logo from '../assets/logo.png'
const JapSheftLogo = () => {
    return (
        <div className='flex items-end'>
          <img className='mb-2' src={logo} alt="" />
          <p className='text-3xl -ml-4 font-extrabold'>JapSheft</p>
        </div>
    );
};

export default JapSheftLogo;