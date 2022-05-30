import React, { useEffect } from 'react'
import MasonryLayout from "./MasonryLayout";
import Spinner from './Spinner';

const Feed = ({ pins }) => {
  return (
    <div>
      <MasonryLayout pins={pins} />
    </div>
  )
}

export default Feed