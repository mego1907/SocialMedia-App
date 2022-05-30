import React from 'react';
import Masonry from 'react-masonry-css';
import Pin from './Pin';

const MasonryLayout = ({ pins }) => {

    const breakpointObj = {
      default: 4,
      3000: 6,
      2000: 5,
      1200: 3,
      1000: 2,
      500: 1,
    };


  return (
    <Masonry className="flex" breakpointCols={breakpointObj}>
      {
        pins?.map(pin => (
          <Pin key={pin?.id} pin={pin} className="w-max" />
        ))
      }
    </Masonry>
  ) 
}

export default MasonryLayout