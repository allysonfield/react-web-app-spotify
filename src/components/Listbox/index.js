import { Box } from '@material-ui/core';
import React from 'react'

const Listbox = ({items, clicked}) => {
  const clickedd = (e) => {
    e.preventDefault();
    clicked(e.target.id)
  }

  return (
    <Box component="big">
      {
        items.map((item, i) => 
          <button
            key={i}
            onClick={clickedd}
            id={item.track.id}
          >
            {item.track.name}
          </button>
        )
      }
    </Box>
  );
}

export default Listbox