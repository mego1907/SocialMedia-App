import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";
import { getProviders, getSession, signIn } from "next-auth/react"

const Login = ({providers}) => {
  const router = useRouter();
  
  return (
    <div>
      <Head>
        <title>ShareMe - Login</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="flex justify-center items-center flex-col h-screen">
        <div className="relative h-full w-full">
          <video
            src={"/assets/share.mp4"}
            type="video/mp4"
            muted
            controls={false}
            loop
            autoPlay
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute flex flex-col justify-center items-center top-0 left-0 bottom-0 w-full">
          <div className="p-5">
            <img src={"/assets/logowhite.png"} alt="logo" width={"130px"} />
          </div>

          {Object.keys(providers).map((provider) => (
            <div key={provider} className="shadow-2xl">
              <button
                type="button"
                className="flex bg-white text-black justify-center items-center p-3 rounded-lg outline-none"
                onClick={() => signIn(provider, { callbackUrl: "/"})}
              >
                <FcGoogle className="mr-4" /> Sign in with Google
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;

export async function getServerSideProps(context) {
  const providers = await getProviders()
  const session = await getSession(context)

  if(session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      }
    }
  }

  return {
    props: {
      providers
    }
  }
}