import React, { useState } from 'react';
import styles from './NumberInput.module.css';

interface NumberType { 
  value: string,
  adjustValue?: (val: string) => void,
}

export const NumberInput = ({ value, adjustValue }: NumberType) => {
  const [val, setVal] = useState('');

  const validate = (val: string) => {
    if(!Number(val) && val !== "" && Number(val) !== 0) {
      return;
    }
    setVal(val);
    if(adjustValue) adjustValue(val);
  }

  return (
    <input 
      value={val} 
      onChange={e => validate(e.target.value)}
      placeholder="Value to Convert"
    />
  );
}
