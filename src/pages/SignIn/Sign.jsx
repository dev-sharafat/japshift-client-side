import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../Hooks/useAuth";
import axios from "axios";
import Swal from "sweetalert2";
import useAxiosInstant from "../../Hooks/useAxiosInstant";

const Sign = () => {
  const { createUser, updateUserInfo } = useAuth();
  const [uploadImage, setUploadeImage] = useState("");
  const axiosInstent = useAxiosInstant();
  const location = useLocation()
  const navigate = useNavigate();
  const from = location.state?.from || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    createUser(data.email, data.password)
      .then(async (result) => {
        console.log(result);
        const userInfo = {
          email: data?.email,
          role: "user",
          created_at: new Date().toISOString(), // ✅ parentheses added
          last_login_at: new Date().toISOString(), // ✅ parentheses added
        };

        const userRes = await axiosInstent.post("/users", userInfo);
        console.log(userRes);
        const updateInfo = {
          displayName: data.name,
          photoURL: uploadImage,
        };
        updateUserInfo(updateInfo)
          .then(() => {
            console.log("profile name is update");
            navigate(from);
          })
          .catch((error) => {
            Swal.fire(error.message);
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleImageUploading = async (e) => {
    const photo = e.target.files[0];
    console.log(photo);
    const formData = new FormData();
    formData.append("image", photo);
    const photoUpdateUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_uploadImage_key
    }`;
    const res = await axios.post(photoUpdateUrl, formData);
    setUploadeImage(res.data.data.url);
  };
  return (
    <div className="card  w-full shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-5xl font-bold">Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            {/* email field */}
            <label className="label">Name</label>
            <input
              type="text"
              required
              {...register("name", { required: true })}
              className="input"
              placeholder="Your Name"
            />

            <label className="label">Image</label>
            <input
              type="file"
              required
              onChange={handleImageUploading}
              name="photo"
              className="input"
              placeholder="Enter Your Profile Image"
            />

            <label className="label">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input"
              placeholder="Email"
            />
            {errors.email?.type === "required" && (
              <p className="text-red-500">Email is required</p>
            )}

            <label className="label">Password</label>
            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              className="input"
              placeholder="Password"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500">
                Password must be 6 characters or longer
              </p>
            )}

            <div>
              <a className="link link-hover">Forgot password?</a>
            </div>
            <button className="btn btn-primary text-black mt-4">
              Register
            </button>
          </fieldset>
          <p>
            <small>
              Already have an account?{" "}
              <Link className="btn btn-link" to="/login">
                Login
              </Link>
            </small>
          </p>
        </form>
        {/* <SocialLogin></SocialLogin> */}
      </div>
    </div>
  );
};

export default Sign;
