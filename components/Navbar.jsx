import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useSelector } from 'react-redux'
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { useSession } from 'next-auth/react';


const Navbar = ({ searchTerm, setSearchTerm }) => {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7">
      <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm">
        <IoMdSearch className="ml-1" fontSize={21} />
        <input
          type={"text"}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          onFocus={() => router.push("/search")}
          placeholder="Search"
          className="w-full outline-none p-2 bg-white"
        />
        {session ? (
          <div className="flex gap-3">
            <Link href={`/user-profile/${session?.user?.uid}`}>
              <a className="hidden md:block select-none">
                <img
                  src={session?.user?.image}
                  alt="user"
                  className="w-14 h-12 rounded-lg"
                />
              </a>
            </Link>
            <Link href={`/create-pin`}>
              <a className="bg-black text-white rounded-lg w-12 h-12 md:h-14 md:w-14 flex justify-center items-center">
                <IoMdAdd />
              </a>
            </Link>
          </div>
        ) : (
          <div>
            <Link href={`/login`}>
              <a className="bg-rose-500 rounded-full text-white p-3 px-5">
                Login
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar