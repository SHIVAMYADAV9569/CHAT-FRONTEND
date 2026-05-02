import React from 'react';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import toast from 'react-hot-toast';

export default function Signup() {
const {authUser,setAuthUser}=useAuth();
    const { 
    register,
    handleSubmit,
     watch,
      formState: { errors },
     } = useForm();

    const password = watch('password', "");
    const confirmPassword = watch("confirmPassword","")

    const onSubmit = async (data) => {
        const userInfo = {
            name: data.username,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword
        };

        await axios
            .post(`${import.meta.env.VITE_BASE_URL}/api/user/signup`, userInfo)
            .then((response) => {
               // console.log(response.data);
                if (response.data) {
                    toast.success("Signup successful! You can now log in.");
                }

                localStorage.setItem("messenger", JSON.stringify(response.data));
                setAuthUser(response.data);
            })
            .catch((error) => {
                if (error.response && error.response.data.error) {
                    toast.error("Error: " + error.response.data.error);
                } else {
                    alert("An unexpected error occurred");
                }
            });
    };

    return (
        <div className="flex h-screen items-center justify-center">
            <div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="border border-white px-6 py-4 rounded-md space-y-3 w-full max-w-md mx-4"
                >
                    <h1 className="text-2xl text-blue-600 font-bold text-center">Messenger</h1>

                    <h2 className="text-2xl text-center">
                        Create a new <span className="text-blue-600 font-semibold">Account</span>
                    </h2>

                    {/* Username */}
                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Username"
                            className="grow"
                            {...register('username', { required: 'Username is required' })}
                        />
                    </label>
                    {errors.username && (
                        <p className="text-red-500">{errors.username.message}</p>
                    )}

                    {/* Email */}
                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            type="email"
                            placeholder="Email"
                            className="grow"
                            {...register('email', { required: 'Email is required' })}
                        />
                    </label>
                    {errors.email && (
                        <span className="text-red-600 text-sm font-semibold">
                            {errors.email.message}
                        </span>
                    )}

                    {/* Password */}
                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            type="password"
                            placeholder="Password"
                            className="grow"
                            {...register('password', { required: 'Password is required' })}
                        />
                    </label>
                    {errors.password && (
                        <p className="text-red-500">{errors.password.message}</p>
                    )}

                    {/* Confirm Password */}
                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="grow"
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (value) => value === password || 'Passwords do not match'
                            })}
                        />
                    </label>
                    {errors.confirmPassword && (
                        <p className="text-red-500">{errors.confirmPassword.message}</p>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-flex">
                        <input
                            type="submit"
                            value="Signup"
                            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer rounded-lg w-full"
                        />
                    </div>
                </form>

                <div className="mt-4 border-t pt-4 text-center">
                    <p>
                        Already have an account?{' '}
                        <Link className="text-blue-500 underline cursor-pointer" to="/login">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
