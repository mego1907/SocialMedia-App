import React, { useState } from "react";
import ComponentWithNavbar from "../components/ComponentWithNavbar";
import { MdDelete } from "react-icons/md";
import {
  AiOutlineCloudUpload,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { categories } from "../utils/data";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import Spinner from "../components/Spinner"

const CreatePin = () => {
  const [fields, setFields] = useState(null);
  const [loading, setLoading] = useState(false);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [imageAsset, setImageAsset] = useState(null);
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState(null);

  const router = useRouter();

  const { data: session } = useSession()


  const uploadImage = async (e) => {
    const { type, name } = e.target.files[0];

    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/jpeg" ||
      type === "image/gif" ||
      type === "image/tiff"
    ) {
      setWrongImageType(false);

      const reader = new FileReader();

      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
      }

      reader.onload = (readerEvent) => {
        setImageAsset(readerEvent.target.result);
      };
    } else {
      setWrongImageType(true);
    }
  };

  const createPin = async () => {
    if(loading) return ;

    if(title && about && imageAsset) {
      setLoading(true);

      const docRef = await addDoc(collection(db, "pins"), {
        username: session.user.name,
        profileImage: session.user.image,
        userId: session.user.uid,
        title: title,
        about: about,
        destination: destination ? destination : "",
        category: category,
        timestamp: serverTimestamp(),
      });

      const imageRef = ref(storage, `pins/${docRef.id}/image`);

      await uploadString(imageRef, imageAsset, "data_url").then(
        async (snapshot) => {
          const downloadUrl = await getDownloadURL(imageRef);

          await updateDoc(doc(db, "pins", docRef.id), {
            image: downloadUrl,
          });
        }
      );

      setLoading(false);
      setImageAsset(null);
      setAbout("");
      setTitle("");
      setDestination("");

      router.push("/");
    } else {
      setFields(true);

      setTimeout(() => setFields(false), 2000);
    }
  };

  return (
    <ComponentWithNavbar>
      <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
        {fields && (
          <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">
            Please fill all the fields
          </p>
        )}

        <div className="flex flex-col lg:flex-row justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
          <div className="bg-gray-200 p-3 flex flex-[0.7] w-full">
            <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full select-none md:h-[420px]">
              {wrongImageType && <p>Wrong image type</p>}
              {!imageAsset ? (
                <label>
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="flex flex-col justify-center items-center">
                      <p className="font-bold text-2xl">
                        <AiOutlineCloudUpload />
                      </p>
                      <p className="text-lg">Click to upload</p>
                    </div>

                    <p className="mt-32 text-gray-400">
                      Use high-quality JPG, JPEG, SVG, PNG, GIF or TIFF less
                      than 20MB
                    </p>
                  </div>
                  <input
                    type="file"
                    name="upload-image"
                    onChange={(e) => uploadImage(e)}
                    className="w-0 h-0"
                  />
                </label>
              ) : (
                <div className="relative h-full">
                  <img
                    src={imageAsset}
                    alt="uploaded-pic"
                    className="md:h-full w-full "
                  />
                  <button
                    type="button"
                    className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                    onClick={() => setImageAsset(null)}
                  >
                    <MdDelete />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
            <input
              type="text"
              placeholder="Add your title here"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2 "
            />

            {session && (
              <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
                <img
                  src={session?.user?.image}
                  className="w-10 h-10 rounded-full"
                  alt="user-profile"
                />
                <p className="font-bold">{session?.user?.name}</p>
              </div>
            )}

            <input
              type="text"
              placeholder="What is your pin about?"
              onChange={(e) => setAbout(e.target.value)}
              value={about}
              className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2 "
            />

            <input
              type="text"
              placeholder="Add destination link"
              onChange={(e) => setDestination(e.target.value)}
              value={destination}
              className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2 "
            />

            <div className="flex flex-col">
              <div>
                <p className="mb-2 font-semibold text-lg sm:text-xl">
                  Choose your category
                </p>
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
                >
                  <option value="others" className="bg-white sm:text-black">
                    Select category
                  </option>
                  {categories.map((item) => (
                    <option
                      key={item?.name}
                      value={item?.name}
                      className="text-base border-0 outline-none capitalize bg-white text-black "
                    >
                      {item?.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end items-end mt-5">
                <button
                  type="button"
                  className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none flex justify-center items-center"
                  onClick={createPin}
                >
                  {loading ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  ) : (
                    "Save pin"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentWithNavbar>
  );
};

export default CreatePin;

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
