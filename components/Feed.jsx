import React, { useEffect } from 'react'
import MasonryLayout from "./MasonryLayout";
import Spinner from './Spinner';

const Feed = ({ pins, loading }) => {
  if(loading) return <Spinner />
  return (
    <div>
      <MasonryLayout pins={pins} />
    </div>
  )
}

export default Feed