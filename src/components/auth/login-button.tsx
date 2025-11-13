'use client'

import Image from "next/image";
import { Button } from "../ui/button";
import { signIn } from "@/lib/auth-client";


export default function LoginButton() {

  const handleLogin = async() =>{
     const data = await signIn.social({
        provider: "google",
        callbackURL : "/"
      });
  }
  return (
    <Button
      onClick={handleLogin}
      className="w-full flex items-center cursor-pointer justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-medium py-2"
    >
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png"
        alt="Google logo"
        width={20}
        height={20}
        className="rounded-full"
      />
      <span>Sign in with Google</span>
    </Button>
  );
}
