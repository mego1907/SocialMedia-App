import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { getSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import ComponentWithNavbar from '../components/ComponentWithNavbar'
import MasonryLayout from '../components/MasonryLayout'
import { db } from '../config/firebase'

const Search = () => {
  const [pins, setPins] = useState([]);
  const [searchValue, setSearchValue] = useState("");

    useEffect(
      () =>
        onSnapshot(
          query(
            collection(db, "pins"),
            orderBy("timestamp", "desc")
          ),
          (snapshot) => {
            const pinsFilter = snapshot.docs.filter(
              (pin) =>
                pin.data().title.includes(searchValue) ||
                pin.data().category.includes(searchValue) ||
                pin.data().about.includes(searchValue)
            );
            setPins(pinsFilter);
          }
        ),
      [db, searchValue]
    );


  return (
    <ComponentWithNavbar
      searchValue={searchValue}
      setSearchValue={setSearchValue}
    >
      <MasonryLayout pins={pins} />
    </ComponentWithNavbar>
  );
}

export default Search;

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
