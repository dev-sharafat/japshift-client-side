import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosInstant from "../../Hooks/useAxiosInstant";

const Login = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const { register, handleSubmit } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosInstent = useAxiosInstant()
  const from = location.state?.from || "/";
  const onSubmit = (data) => {
    console.log(data);
    signIn(data.email, data.password)
      .then(async(result) => {
        const user = result?.user
        const userInfo = {
          email: user?.email,
          role: "user",
          created_at: new Date().toISOString(), // ✅ parentheses added
          last_login_at: new Date().toISOString(), // ✅ parentheses added
        };

        const userRes = await axiosInstent.post("/users", userInfo);
        console.log(userRes);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "You are Successfully Login",result,
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(from);
      })
      .then((error) => {
        console.log(error);
      });
    
  };
  const handleLogin = () =>{
    signInWithGoogle()
      .then(async(result) => {
        const user = result?.user
         const userInfo = {
          email: user?.email,
          role: "user",
          created_at: new Date().toISOString(), // ✅ parentheses added
          last_login_at: new Date().toISOString(), // ✅ parentheses added
        };

        const userRes = await axiosInstent.post("/users", userInfo);
        console.log(userRes);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "You are Successfully Login",result,
          showConfirmButton: false,
          timer: 1500,
        });
        
        navigate(from)
      })
      .catch((error) => {
        Swal.fire(error.message);
      });
  }
  return (
    <div>
      <div className="space-y-2 mb-5">
        <h1 className="lg:text-5xl text-3xl font-extrabold">Welcome Back</h1>
        <p className="font-semibold">Login with JapSheft</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          <label className="label font-bold text-lg">Email</label>
          <input
            type="email"
            className="input w-full"
            placeholder="Email"
            {...register("email")}
          />
          <label className="label font-bold text-lg">Password</label>
          <input
            {...register("password")}
            type="password"
            className="input w-full"
            placeholder="Password"
          />
          <div>
            <Link className="link link-hover text-lg">Forgot password?</Link>
          </div>
          <button className="btn bg-[#CAEB66] mt-4">Login</button>
          <p className="text-lg font-bold">
            Don’t have any account?
            <Link to="/signin" className="btn btn-link text-lg">
              Register
            </Link>
          </p>
        </fieldset>
        <div className="text-center">
          <p className="text-lg mb-2">Or</p>
          <button onClick={handleLogin} className="btn bg-white text-black btn-block border-[#e5e5e5]">
            <svg
              aria-label="Google logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path
                  fill="#4285f4"
                  d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                ></path>
                <path
                  fill="#fbbc02"
                  d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                ></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
            Login with Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
