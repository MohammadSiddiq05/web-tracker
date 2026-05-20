"use client"

import Image from "next/image"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"

function AppHeader() {

  const { user } = useUser()

  return (
    <header className="w-full border-b border-gray-200 bg-white shadow-sm">

      <nav
        className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4"
        aria-label="Global"
      >

        {/* Logo Section */}
        <div className="flex items-center gap-3 cursor-pointer">

          <Image
            src={"/logo2.png"}
            alt="logo"
            width={45}
            height={45}
            className="rounded-xl object-cover"
          />

          <h2 className="text-2xl font-bold text-gray-800">
            WebTrack
          </h2>

        </div>

        {/* Right Section */}
        <div className="flex items-center">

          {!user ? (

            <SignInButton
              mode="modal"
              signUpForceRedirectUrl={"/dashboard"}
            >

              <button
                className="
                  flex items-center gap-2
                  bg-black text-white
                  px-5 py-2.5
                  rounded-xl
                  font-medium
                  hover:scale-105
                  transition-all duration-200
                "
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                </svg>

                Get Started

              </button>

            </SignInButton>

          ) : (

            <div className="scale-110">
              <UserButton />
            </div>

          )}

        </div>

      </nav>

    </header>
  )
}

export default AppHeader