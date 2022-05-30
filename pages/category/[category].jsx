import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import ComponentWithNavbar from '../../components/ComponentWithNavbar'
import MasonryLayout from '../../components/MasonryLayout'
import { db } from '../../config/firebase'

const Category = () => {
  const router = useRouter()
  const { category } = router.query
  const [pins, setPins] = useState([])

  const collectionRef = collection(db, 'pins')
  const q = query(collectionRef, where('category', "==", category))
  useEffect(() => onSnapshot(q, (snapshot) => {
    setPins(snapshot.docs)
  }), [db, category])

  return (
    <ComponentWithNavbar>
      <MasonryLayout pins={pins} />
    </ComponentWithNavbar>
  );
}

export default Category;

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
