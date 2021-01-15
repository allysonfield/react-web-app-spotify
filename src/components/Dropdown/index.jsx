import React from 'react';
import './styles.css';

const Dropdown = ({ data, changed, label, selected }) => {
  const dropdownChanged = (e) => {
    changed(e.target.value);
  };
  return (
    <div className="col-sm-13 form-group row px-0">
      <label className="form-label col-sm-4">{label}</label>
      <select
        className="form-control form-control-sm col-sm-12"
        labelId="label"
        id="select"
        value={selected}
        onChange={dropdownChanged}>
        {data.map((item) => (
          <option value={item.id}>{item.name}</option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
