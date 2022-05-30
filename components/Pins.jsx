import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import Feed from "./Feed";
import Navbar from "./Navbar";

const Pins = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [pins, setPins] = useState([])

  // get All pins
  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "pins"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPins(snapshot.docs);
        }
      ),
    [db]
  );


  return (
    <div className="px-2 md:px-5">
      <div className="bg-gray-50">
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <div className="h-full">
        <Feed pins={pins} />
      </div>
    </div>
  );
};

export default Pins;


