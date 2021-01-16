import React from 'react';

const Detail = ({ album, artists, name }) => (
  <div className="offset-md-1 col-sm-4 image">
    <div className="row col-sm-12 px-0">
      <img height="348px" src={album.images[0].url} alt={name} />
    </div>

    <label style={{ textAlign: 'center' }} htmlFor={name}>
      {name}
    </label>

    <label className="form-label col-sm-12" htmlFor={artists[0].name}>
      {artists[0].name}
    </label>
  </div>
);

export default Detail;
