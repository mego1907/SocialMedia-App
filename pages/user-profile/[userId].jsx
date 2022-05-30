import { collection, getDoc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { getSession, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { db } from '../../config/firebase';
import { AiOutlineLogout } from 'react-icons/ai';
import MasonryLayout from '../../components/MasonryLayout';

const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";


const UserProfile = () => {
  const router = useRouter();
  const [pins, setPins] = useState([])
  const { userId } = router.query;
  const { data: session } = useSession();
  const [activeBtn, setActiveBtn] = useState("created");
  const [profileOwner, setProfileOwner] = useState(null)

  useEffect(() => {
    if(activeBtn === "created") {
      const collectionRef = collection(db, "pins");
      const q = query(collectionRef, where("userId", "==", `${userId}`));
      return onSnapshot(q, (snapshot) => {
        setPins(snapshot.docs);
        const newUser = snapshot.docs?.find(
          (pin) => pin.data().userId === userId
        );
        setProfileOwner(newUser);
      });
    } else {
      return onSnapshot(
        collection(db, "users", `${session?.user?.uid}`, "saved-pins"),
        (snapshot) => {
          setPins(snapshot.docs);
        }
      );
    }
  }, [userId, db, activeBtn, session]);

  // logout user from the app
  const logout = () => {
    signOut({ callbackUrl: "/login"});
  }


  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-2">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              className="w-full h-[300px] xl:h-[510px] shadow-lg object-cover"
              src="https://source.unsplash.com/1600x900/?nature,photography,technology"
              alt="user-pic"
            />
            <img
              src={
                profileOwner
                  ? profileOwner.data().profileImage
                  : session?.user?.image
              }
              className="w-20 h-20 rounded-full -mt-10 object-cover"
              alt="user-image"
            />
          </div>
          <h1 className="font-bold text-center text-xl lg:text-3xl mt-3">
            {profileOwner
              ? profileOwner?.data()?.username
              : session?.user?.name}
          </h1>
          <div className="absolute top-0 right-0 z-1 p-2">
            {session?.user?.uid === userId && (
              <button
                type="button"
                className="bg-white rounded-full cursor-pointer outline-none shadow-md"
                onClick={logout}
              >
                <AiOutlineLogout color="red" fontSize={21} />
              </button>
            )}
          </div>
        </div>
        {session?.user?.uid === userId && (
          <div className="text-center mb-7">
            <button
              onClick={() => setActiveBtn("created")}
              className={`${
                activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              onClick={() => setActiveBtn("saved")}
              className={`${
                activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>
        )}
        {pins.length > 0 ? (
          <MasonryLayout pins={pins} />
        ) : (
          <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
            No Pins Found
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: {},
  };
};
