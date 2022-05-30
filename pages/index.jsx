import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pins from "../components/Pins";
import { db } from "../config/firebase";
import { getUserInfo } from "../store/login/loginActions";
// import { fetchPins } from "../utils/fetchPins";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { data: session } = useSession();

  return (
    <div>
      <main>
        <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-all duration-75 ease-out">
          <div className="flex-1 pb-2 h-screen overflow-y-scroll">
            <Pins />
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      }
    }
  }

  return {
    props: {
    },
  };

};
