import React from "react";
import { Link, NavLink } from "react-router";
import JapSheftLogo from "../JapSheftLogo";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";

const NavBar = () => {
  const { user } = useAuth();
  const { logOut } = useAuth();
  const navlinks = (
    <>
      <li>
        <NavLink>Services</NavLink>
      </li>
      <li>
        <NavLink to="/coverage">Coverage</NavLink>
      </li>

      <li>
        <NavLink to="/sendParel">Pricing</NavLink>
      </li>
      <li>
        <NavLink to="/beArider">Be a Rider</NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink to="/deshboard">Deshboard</NavLink>
          </li>
        </>
      )}

      <li>
        <NavLink>About Us</NavLink>
      </li>
    </>
  );
  const handleLogOut = () => {
    logOut().then((result) => {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "You are Successfully Logout",result,
        showConfirmButton: false,
        timer: 1500,
      });
    });
  };
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <JapSheftLogo></JapSheftLogo>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {navlinks}
          </ul>
        </div>
        <div className="lg:block hidden">
          <JapSheftLogo></JapSheftLogo>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navlinks}</ul>
      </div>
      <div className="navbar-end">
        {
          user? <Link className="btn btn-primary" onClick={handleLogOut}>Logut</Link>:<Link className="btn btn-primary" to="/login">Login</Link>
        }
      </div>
    </div>
  );
};

export default NavBar;
