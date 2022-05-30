import { collection, deleteDoc, doc, documentId, getDoc, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { db } from '../../config/firebase';
import { MdDownloadForOffline } from 'react-icons/md';
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import {FaHeart} from "react-icons/fa";
import Spinner from "../../components/Spinner";

import ComponentWithNavbar from '../../components/ComponentWithNavbar';
import Link from 'next/link';
import { getSession, useSession } from 'next-auth/react';
import MasonryLayout from '../../components/MasonryLayout';
import { FaRegHeart } from "react-icons/fa";
import Comments from '../../components/Comments';


const PinDetails = () => {
  const router = useRouter();
  const { pinId } = router.query;
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false)
  const [pinDetails, setPinDetails] = useState({});
  const [pins, setPins] = useState([])
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false)
  const [likesOwner, setLikesOwner] = useState([])

  // get pin details
  useEffect(() => {
    const docRef = doc(db, "pins", `${pinId}`);
    const fetchData = async () => {
      setLoading(true)
      getDoc(docRef).then((snapshot) => {
        setPinDetails({ ...snapshot.data(), id: snapshot.id });
        setLoading(false)
      });
    };

    fetchData();
  }, [pinId]);

  // get more pins from the same category
  const collectionRef = collection(db, "pins");
  const q = query(collectionRef, where("category", "==", `${pinDetails.category}`));
  useEffect(() => {
    const fetchData = () =>
      onSnapshot(q, (snapshot) => {
        setPins(snapshot.docs.filter((pin) => pin.id !== pinId));
      });

    fetchData();
  }, [db, pinDetails.category, pinId]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like?.id === session?.user?.uid) !== -1)
  }, [likes, session?.user?.uid]);

  // get likes
  useEffect(
    () =>
      onSnapshot(collection(db, "pins", `${pinId}`, "likes"), (snapshot) => {
        setLikes(snapshot.docs);
      }),
    [db, pinId]
  );


  const likePin = async () => {
    if(hasLiked) {
      await deleteDoc(doc(db, "pins", `${pinId}`, "likes", `${session?.user?.uid}`));
    } else {
      await setDoc(doc(db, "pins", `${pinId}`, "likes", `${session?.user?.uid}`), {
        id: session?.user?.uid,
        timestamp: serverTimestamp(),
        username: session?.user?.name,
        profileImage: session?.user?.image,
      })
    }
  }

  const getLikesOweners = () => {
    const ownersMakeLike = likes.map((likeOwner) => likeOwner.data());
    setLikesOwner(ownersMakeLike);
  }

  console.log(pinDetails);
  // if pin not found return null
  
  if(loading) return (
    <div className="w-full h-screen flex justify-center items-center">
      <Spinner />
    </div>
  );

  if(!pinDetails?.title) return(

    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h3 className="text-2xl text-gray-700">Sorry, This pin is not found!</h3>
      <Link href="/">
        <a className="mt-6 p-2 px-4 rounded-full bg-rose-500 text-white/90">
          Back to home
        </a>
      </Link>
    </div>
  );

  return (
    <ComponentWithNavbar>
      <div className="flex flex-col xl:flex-row m-auto bg-white max-w-[1500px] rounded-[32px]">
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetails?.image}
            alt="pin-image"
            className="rounded-t-3xl rounded-b-lg"
          />
        </div>
        <div className="w-full p-2 md:p-5 flex-1 xl:min-w-[620px]">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              {session && (
                <div className="flex items-center">
                  <button
                    type="button"
                    className="bg-white w-8 h-8 rounded-full flex justify-left items-center text-rose-500 outline-none text-xl"
                    onClick={likePin}
                  >
                    {hasLiked ? <FaHeart /> : <FaRegHeart />}
                  </button>
                  {likes.length > 0 && (
                    <span
                      className="text-sm cursor-pointer"
                      onClick={getLikesOweners}
                    >
                      {likes.length} Likes
                    </span>
                  )}
                </div>
              )}
            </div>
            {pinDetails?.destination && (
              <a
                href={pinDetails?.destination}
                target="_blank"
                rel="noreferrer"
                className="bg-white shadow-sm p-1 px-2 rounded-full flex items-center text-xs md:text-sm gap-2 text-gray-500 hover:shadow-md"
              >
                <BsFillArrowUpRightCircleFill />
                {pinDetails?.destination}
              </a>
            )}
          </div>
          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetails?.title}
            </h1>
            <p className="mt-3">{pinDetails?.about}</p>
          </div>
          <Link href={`/user-profile/${pinDetails?.userId}`}>
            <a className="flex gap-2 mt-2 items-center bg-white rounded-lg">
              <img
                src={pinDetails?.profileImage}
                className="w-8 h-8 rounded-full object-cover"
                alt="profile-image"
              />
              <p className="font-semibold text-sm capitalize">
                {pinDetails?.username}
              </p>
            </a>
          </Link>
          <Comments pinDetails={pinDetails} />
        </div>
      </div>
      {pins.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
      {pins ? (
        <MasonryLayout pins={pins} />
      ) : (
        <h3 className="text-center">Loading...</h3>
      )}
    </ComponentWithNavbar>
  );
}

export default PinDetails;

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
