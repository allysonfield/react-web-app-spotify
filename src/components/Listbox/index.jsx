import React from 'react';

const Listbox = ({ items, clicked }) => {
  const clickedd = (e) => {
    e.preventDefault();
    clicked(e.target.id);
  };

  return (
    <div className="col-sm-6 list-group px-0">
      {items.map((item) => (
        <button
          className="list-group-item list-group-item-action list-group-item-light"
          type="button"
          onClick={clickedd}
          id={item.track.id}>
          {item.track.name}
        </button>
      ))}
    </div>
  );
};

export default Listbox;
