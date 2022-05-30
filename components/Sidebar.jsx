import { useSession } from 'next-auth/react';
import Link from 'next/link'
import { useRouter } from 'next/router';
import React from 'react';
import { IoHome } from 'react-icons/io5';
import { categories } from '../utils/data';

const isNotActiveStyle =
  "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";
const isActiveStyle =
  "flex items-center px-5 gap-3 font-extrabold border-r-2 border-black  transition-all duration-200 ease-in-out capitalize";


const Sidebar = () => {
  const router = useRouter()  

  const { data: session } = useSession();

  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-[210px] hide-scrollbar">
      <div className="flex flex-col">
        <Link href={"/"}>
          <a className="flex px-5 gap-2 my-6 w-44 pt-1 items-center ">
            <img src="/assets/logo.png" alt="logo" className="w-full" />
          </a>
        </Link>

        <div className="flex flex-col gap-5">
          <Link href={"/"}>
            <a
              className={`${
                router.asPath === "/"
                  ? "flex items-center px-5 text-black gap-3 border-r-2 border-black hover:text-black transition-all duration-200 ease-in-out capitalize"
                  : "flex items-center px-5 text-gray-500 gap-3 hover:text-black transition-all duration-200 ease-in-out capitalize"
              }`}
            >
              <IoHome />
              Home
            </a>
          </Link>

          <h3 className="mt-2 px-5 text-base 2xl:text-xl ">
            Discover Categories
          </h3>

          {categories?.map((category, index) => (
            <Link key={index} href={`/category/${category.name}`}>
              <a
                className={`${
                  router.asPath === `/category/${category.name}`
                    ? isActiveStyle
                    : isNotActiveStyle
                }`}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-8 h-8 rounded-full"
                />
                {category.name}
              </a>
            </Link>
          ))}
        </div>

        {session && (
          <>
            <Link href={`/user-profile/${session?.user?.uid}`}>
              <a className="flex gap-2 px-5 mb-3 my-5 p-2 items-center shadow-lg rounded-lg mx-3">
                <img
                  src={session?.user?.image}
                  alt="user-profile"
                  className="w-10 h-10 rounded-full"
                />
                {session?.user?.name}
              </a>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Sidebar