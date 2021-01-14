import { InputLabel, MenuItem, Select } from '@material-ui/core';
import React from 'react';
import './styles.css'

const Dropdown = ({data, changed, label, selected}) => {
const dropdownChanged = (e) => {
  changed(e.target.value)
}
  return (
    <div className="Container">
      <InputLabel id="label">{label}</InputLabel>
      <Select labelId="label" id="select" value={selected} onChange={dropdownChanged}>
        {data.map((item, i) => <MenuItem key={i} value={item.id}>{item.name}</MenuItem>)}
      </Select>
    </div>
  );
}

export default Dropdown