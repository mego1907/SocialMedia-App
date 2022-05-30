import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { MdDownloadForOffline } from "react-icons/md";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { FaRegHeart } from 'react-icons/fa';
import { FaHeart } from "react-icons/fa";
// import { fetchUser } from '../utils/fetchUser';
import { AiTwotoneDelete } from "react-icons/ai";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { db } from '../config/firebase';
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';



const Pin = ({ pin }) => {
  const router = useRouter();
  const [postHovered, setpostHovered] = useState(false);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [savedPins, setSavedPins] = useState([])

  const { data: session } = useSession();

  let alreadySaved = savedPins.find(savePin => savePin?.id === pin?.id)
  // delete pin
  const deletePin = async (id) => {
    if(pin.data().saved) {
      const docRef = doc(db, "users", `${session.user.uid}`, "saved-pins", `${id}`);
      deleteDoc(docRef)
    } else {
      const docRef = doc(db, "pins", id);
      await deleteDoc(docRef);
    }

  };

  const likePin = async (e) => {
    e.stopPropagation();
    if (hasLiked) {
      await deleteDoc(
        doc(db, "pins", `${pin.id}`, "likes", `${session?.user?.uid}`)
      );
    } else {
      await setDoc(
        doc(db, "pins", `${pin.id}`, "likes", `${session?.user?.uid}`),
        {
          id: session?.user?.uid,
          timestamp: serverTimestamp(),
          username: session?.user?.name,
          profileImage: session?.user?.image,
        }
      );
    }
  };

  useEffect(() => {
    setHasLiked(
      likes.findIndex((like) => like?.id === session?.user?.uid) !== -1
    );
  }, [likes, session?.user?.uid]);
  

  // get likes
  useEffect(
    () =>
      onSnapshot(collection(db, "pins", `${pin?.id}`, "likes"), (snapshot) => {
        setLikes(snapshot.docs);
      }),
    [db, pin?.id]
  );

  // get saved pins
  useEffect(
    () =>
      onSnapshot(
        collection(db, "users", `${session?.user?.uid}`, "saved-pins"),
        (snapshot) => {
          setSavedPins(snapshot.docs);
        }
      ),
    [db, session?.user?.uid]
  );  

  const savePin = async (e) => {
    e.stopPropagation();

    if(!alreadySaved) {
      await setDoc(doc(db, "users", `${session?.user?.uid}`, "saved-pins", `${pin?.id}`), {
        id: pin.id,
        timestamp: serverTimestamp(),
        title: pin.data().title,
        about: pin.data().about,
        destination: pin.data().destination,
        image: pin.data().image,
        category: pin.data().category,
        profileImage: session?.user?.image,
        userId: session?.user?.uid,
        username: session?.user?.name,
        saved: true,
      });
    }
  }

  const unSavePin = async (e) => {
    e.stopPropagation();

    if(alreadySaved) {
      const docRef = doc(db, "users", `${session?.user?.uid}`, "saved-pins", `${pin?.id}`);
      deleteDoc(docRef)
    }
  }

  return (
    <div className="m-2  select-none">
      <div
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
        onMouseEnter={() => setpostHovered(true)}
        onMouseLeave={() => setpostHovered(false)}
        onClick={() => router.push(`/pin-details/${pin.id}`)}
      >
        <img
          src={pin?.data()?.image}
          alt="user-post"
          className="w-full rounded-lg"
        />

        {postHovered && (
          <div className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50">
            {session && (
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={likePin}
                    className="bg-white w-8 h-8 rounded-full absolute top-2 left-2 flex justify-center items-center text-rose-500 text-xl opacity-75 hover:opacity-100 hover:shadow-md"
                  >
                    {hasLiked ? (
                      <FaHeart fontSize={18} />
                    ) : (
                      <FaRegHeart fontSize={18} />
                    )}
                  </button>
                </div>
                {alreadySaved ? (
                  <button
                    type="button"
                    className="bg-red-600 absolute top-2 right-2 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 rounded-3xl outline-none hover:shadow-md"
                    onClick={unSavePin}
                  >
                    Saved
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={savePin}
                    className="bg-rose-500 absolute top-2 right-2 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 rounded-3xl outline-none hover:shadow-md"
                  >
                    Save
                  </button>
                )}
              </div>
            )}
            <div className="flex justify-between items-center gap-2 w-full">
              {pin?.data()?.destination && (
                <a
                  href={pin?.data()?.destination}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 absolute bottom-2 left-2  rounded-full opacity-70 hover:opacity-100 hover:shadow-md whitespace-nowrap"
                >
                  <BsFillArrowUpRightCircleFill />
                  {/* {pin?.data()?.destination?.length > 15
                    ? `${pin?.data()?.destination?.slice(0, 15)}`
                    : pin?.data()?.destination} */}
                </a>
              )}

              {pin?.data()?.userId === session?.user?.uid && (
                <button
                  type="button"
                  className="bg-white p-2 opacity-70 absolute bottom-2 right-2 hover:opacity-100 text-black fontd-bold rounded-3xl hover:shadow-md outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(pin.id);
                  }}
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link href={`/user-profile/${pin?.data()?.userId}`}>
        <a className="flex gap-2 mt-2 items-center">
          <img
            src={pin?.data()?.profileImage}
            alt="user-profile"
            className="rounded-full w-8 h-8 object-cover"
          />
          <p className="font-semibold capitalize">
            {pin?.data()?.name || pin?.data()?.username}
          </p>
        </a>
      </Link>
    </div>
  );
}

export default Pin