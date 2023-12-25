"use client";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import GoogleLogo from "@pb/img/login/googleLogo.png";

const Form = () => {
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(null);

  const router = useRouter();
  const Pathname = usePathname();

  const handleSumit = async (e) => {
    e.preventDefault();
    const dataFromForm = new FormData(e.currentTarget);
    const usernameLower = dataFromForm.get("username").toLowerCase();

    if (Pathname === "/register") {
      const emailLower = dataFromForm.get("email").toLowerCase();
      try {
        const res = await axios.post("/api/auth/signup", {
          username: usernameLower,
          email: emailLower,
          name: dataFromForm.get("name"),
          lastname: dataFromForm.get("lastname"),
          password: dataFromForm.get("password"),
        });
        const resSignin = await signIn("credentials", {
          username: usernameLower,
          password: dataFromForm.get("password"),
          redirect: false,
        });
        setErrors(null);
        setSuccess(res.data.message);
        if (resSignin?.ok) {
          return router.push("/dashboard");
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          setSuccess(null);
          setErrors(error.response?.data.message);
        }
      }
    }
    if (Pathname === "/login") {
      try {
        if (!usernameLower) return setErrors("Username is required");
        if (!dataFromForm.get("password"))
          return setErrors("Password is required");

        const resSignin = await signIn("credentials", {
          username: usernameLower,
          password: dataFromForm.get("password"),
          redirect: false,
        });
        setErrors(null);

        if (resSignin.error === "User not found") {
          setSuccess(null);
          return setErrors("User not found");
        }
        if (resSignin.error === "Password not match or User not found") {
          setSuccess(null);
          return setErrors("Password not match or User not found");
        }

        if (resSignin?.ok) {
          setSuccess("Login success");
          return router.push("/dashboard");
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          setSuccess(null);
          setErrors(error.response?.data.message);
        }
      }
    }
  };
  return (
    <>
      <div
        className={
          Pathname === "/login"
            ? "flex flex-col justify-center items-center w-4/12 sm:w-11/12 rounded-lg text-black dark:text-white"
            : "flex flex-col justify-center w-6/12 sm:w-full sm:items-center"
        }>
        <div className="flex self-start items-center">
          {Pathname === "/login" ? (
            <h2 className="text-5xl p-2 ml-10 font-thin">Sign In</h2>
          ) : (
            <div className="flex flex-col h-full">
              <h2 className="text-5xl p-2 font-thin">Sign Up</h2>
              <h3 className="text-xl sm:text-base p-2 ">
                create your photos portfolio
              </h3>
            </div>
          )}
        </div>
        <div className="flex w-5/12 sm:w-11/12 sm:text-sm mt-28 sm:mt-1 ml-4 sm:ml-0 ">
          {errors && (
            <div className="bg-red-500 p-3 rounded-lg text-white w-full text-center">
              {errors}
            </div>
          )}
          {success && (
            <div className="bg-green-500 p-3 rounded-lg text-white w-full text-center">
              {success}
            </div>
          )}
        </div>
        <div
          className={
            Pathname === "/login"
              ? "flex flex-col w-full items-center"
              : "flex flex-col w-11/12 h-full justify-around items-center"
          }>
          <form
            onSubmit={handleSumit}
            className="w-full flex flex-col justify-start items-center">
            {Pathname === "/login" ? (
              <div className="w-8/12 sm:w-full">
                <label
                  htmlFor="username"
                  className="text-gray-700 dark:text-white text-md mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="border border-gray-300 rounded-lg p-3 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder={
                    Pathname === "/login"
                      ? "Enter your username"
                      : "Use a cool username!"
                  }
                />
                <label
                  htmlFor="password"
                  className="text-gray-700 dark:text-white text-md mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="border border-gray-300 rounded-lg p-3 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            ) : (
              <>
                <div className="w-full ">
                  <label
                    htmlFor="username"
                    className="text-gray-700 text-md sm:text-sm sm:mb-0 mb-2 dark:text-white">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="border border-gray-300 rounded-lg p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Use a cool username!"
                  />
                  <label htmlFor="email" className="text-gray-700 sm:text-sm sm:mb-0 dark:text-white text-md mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="border border-gray-300 rounded-lg p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                  <label htmlFor="name" className="text-gray-700sm:text-sm sm:mb-0  dark:text-white text-md mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="border border-gray-300 rounded-lg p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                  <label
                    htmlFor="lastname"
                    className="text-gray-700 dark:text-white sm:text-sm sm:mb-0 text-md mb-2">
                    Lastname
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    className="border border-gray-300 rounded-lg p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Enter your lastname"
                  />
                  <label
                    htmlFor="password"
                    className="text-gray-700 dark:text-white sm:text-sm sm:mb-0 text-md mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    className="border border-gray-300 rounded-lg p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </>
            )}
            {Pathname === "/login" ? (
              <button className="w-5/12 sm:w-10/12 bg-gray-300 p-3 mt-2 rounded-xl text-xl hover:bg-blue-500 hover:text-white text-black">
                Sign In
              </button>
            ) : (
              <button className="w-5/12 sm:w-10/12 bg-gray-300 p-2 mt-2 rounded-xl text-xl hover:bg-blue-500 hover:text-white text-black">
                Sign Up
              </button>
            )}
          </form>
          <div className="flex flex-col w-full">
            {Pathname === "/login" ? (
              <div className="w-full flex flex-col justify-center items-center">
                <p className="my-2">or</p>
                <div className="">
                  <button
                    onClick={() =>
                      signIn("google", {
                        redirect: true,
                        callbackUrl: "/dashboard",
                      })
                    }
                    className="w-full p-1 mt-2 rounded-lg text-xl bg-white border border-gray-400">
                    <div className="w-16">
                      <Image src={GoogleLogo} alt="logo_Google" />
                    </div>
                  </button>
                </div>
                <div className="mt-12 ml-3 self-start">
                  <Link
                    href="/register"
                    className="rounded-xl text-base hover:text-red-500 text-black dark:text-white">
                    Don&apos;t have an account? Sign Up
                  </Link>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col justify-center sm:p-0 items-start">
                <div className="w-full flex flex-col justify-center sm:p-0 items-center">
                <p className="my-2 sm:hidden">or</p>
                  <h2 className="text-2xl sm:text-lg sm:p-0 p-2">Sign up with google</h2>
                  <div className="">
                    <button
                      onClick={() =>
                        signIn("google", {
                          redirect: true,
                          callbackUrl: "/dashboard",
                        })
                      }
                      className="w-full p-1 mt-2 rounded-lg text-xl bg-white border border-gray-400">
                      <div className="w-16 sm:w-14">
                        <Image src={GoogleLogo} alt="logo_Google" />
                      </div>
                    </button>
                  </div>
                </div>
                <div className="mt-2 ml-3 self-end hover:scale-105">
                  <Link
                    href="/login"
                    className="rounded-md text-base sm:text-xs  hover:text-blue-500 bg-white p-2 text-black">
                    Already have an account? Log in
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
