"use client"

import { Box } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Chakra from "../components/Chakra";

export default function Login() {
  return (
    <Chakra>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="85vh"
      >
        <div className="flex flex-col justify-center items-center rounded-lg p-8 mt-16">
          <div className="flex mb-5">
            <Image
              src="/ANG_logo.png"
              alt="ANG Logo"
              width={110}
              height={90}
              priority={true}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
          </div>
          {/* <div className="py-3">
            <span>ANG Consultants Inc.</span>
          </div> */}
          <button
            onClick={() =>
              signIn("google", { callbackUrl: `${window.location.origin}/all-projects` })
            }
            className="mt-10 px-4 py-2 border flex items-center gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google logo"
              width={24}
              height={24}
            />
            <span>Login with Google</span>
          </button>
        </div>
      </Box>
    </Chakra>
  );
}
