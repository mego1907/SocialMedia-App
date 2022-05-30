import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {useEffect, useState} from 'react'
import { db } from '../config/firebase';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import Moment from 'react-moment';

const Comments = ({ pinDetails }) => {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() =>
    onSnapshot(
      query(
        collection(db, "pins", `${pinDetails?.id}`, "comments"),
        orderBy("timestamp", "asc")
      ),
      (snapshot) => {
        setComments(snapshot.docs);
      }
    ),[db, pinDetails?.id]
  );

  // Send Comment
  const sendComment = async (e) => {
    e.preventDefault();

    if(comment.trim() === "") return;

    setComment("")

    await addDoc(collection(db, "pins", `${pinDetails?.id}`, "comments"), {
      comment: comment,
      username: session.user.name,
      profileImage: session.user.image,
      userId: session.user.uid,
      timestamp: serverTimestamp(),
    })
  };
  // Edit Comment
  const editComment = async (id) => {
    await updateDoc(doc(db, "pins", `${pinDetails?.id}`, "comments", id), {
      comment: comment,
    })
  }
  // Delete Comment
  const deleteComment = async (id) => {
    await deleteDoc(doc(db, "pins", `${pinDetails?.id}`, "comments", `${id}`));
  }

  return (
    <>
      <h2 className="mt-5 text-2xl mb-3">Comments</h2>
      <div className="max-h-[370px] overflow-y-auto">
        {comments?.map((comment) => (
          <div
            className="flex flex-col mb-3 border p-1.5 rounded-lg"
            key={comment.id}
          >
            <div className="flex justify-between">
              {/* <Link href={`/user-profile/${comment?.userId}`}> */}
                <a className="flex items-center gap-2 font-bold">
                  <img
                    src={comment?.data()?.profileImage}
                    alt="user-image"
                    className="w-8 h-8 rounded-full object-cover cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm md:text-xs capitalize">
                      {comment?.data()?.username}
                    </p>
                    <Moment
                      fromNow
                      className="text-xs text-gray-500 font-light"
                    >
                      {comment?.data()?.timestamp?.toDate()}
                    </Moment>
                  </div>
                </a>
              {/* </Link> */}
              {session?.user?.uid === comment?.data()?.userId && (
                <div className="flex items-center gap-3">
                  {/* <FaEdit
                  className="cursor-pointer text-gray-500 hover:text-rose-500"
                  fontSize={18}
                  onClick={() => editComment(comment?.id)}
                /> */}
                  <div className="w-8 h-8 border border-gray-300 rounded-full flex justify-center items-center">
                    <MdDelete
                      className="cursor-pointer text-gray-500 hover:text-rose-500"
                      fontSize={18}
                      onClick={() => deleteComment(comment?.id)}
                    />
                  </div>
                </div>
              )}
            </div>
            <p className="m-2 p-1">{comment?.data()?.comment}</p>
          </div>
        ))}
      </div>
      {session && (
        <div className="flex flex-wrap mt-6 gap-3">
          <Link href={`/user-profile/${pinDetails?.userId}`}>
            <a className="flex justify-center items-center gap-2 font-bold">
              <img
                src={session?.user?.image}
                alt="user-image"
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
              />
              <p className="font-semibold text-sm capitalize ">
                {session?.user?.name}
              </p>
            </a>
          </Link>
          <form className="w-full" onSubmit={(e) => sendComment(e)}>
            <textarea
              placeholder="Add a comment"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              className="flex-1 w-full border-gray-100 border-2 p-2 rounded-2xl focus:border-gray-500 outline-none"
            ></textarea>
            <div className="flex items-center justify-end mt-2">
              <button className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none">
                Done
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default Comments