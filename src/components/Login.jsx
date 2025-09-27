import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import toast from 'react-hot-toast';

export default function Login() {
const {authUser,setAuthUser}=useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        const userInfo = {
            email: data.email,
            password: data.password
        };

        axios.post('/api/user/login', userInfo)
            .then((response) => {
               // console.log(response.data);
                if (response.data) {
                    toast.success("Login successful!");
                }
                    localStorage.setItem("messenger", JSON.stringify(response.data));
                    setAuthUser(response.data);
                    // Optionally redirect user to home/dashboard after login
                
            })
            .catch((error) => {
                if (error.response && error.response.data.message) {
                    toast.error("Error: " + error.response.data.message);
                } else {
                    alert("Error undefined");
                }
            });
    };

    return (
        <div className="flex h-screen items-center justify-center">
            <div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="border border-white px-6 py-4 rounded-md space-y-3 w-96"
                >
                    <h1 className="text-2xl text-blue-600 font-bold text-center">Messenger</h1>

                    <h2 className="text-2xl text-center">
                        Login to your <span className="text-blue-600 font-semibold">Account</span>
                    </h2>

                    {/* Email */}
                    <label className="input input-bordered flex items-center gap-2">
                        <input
                            type="email"
                            className="grow"
                            placeholder="Email"
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
                            className="grow"
                            placeholder="Password"
                            {...register('password', { required: 'Password is required' })}
                        />
                    </label>
                    {errors.password && (
                        <p className="text-red-500">{errors.password.message}</p>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-between">
                        <input
                            type="submit"
                            value="Login"
                            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer rounded-lg w-full"
                        />
                    </div>
                </form>

                {/* Separator with border */}
                <div className="mt-4 border-t pt-4 text-center">
                    <p>
                        Don't have an account?{' '}
                        <Link className="text-blue-500 underline cursor-pointer" to="/signup">
                            Signup
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
