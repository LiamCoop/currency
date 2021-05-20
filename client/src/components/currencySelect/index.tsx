import React, { useEffect, useState } from 'react';
import { CurrenciesEntity } from '..';
import styles from './CurrencySelect.module.css';

interface Props {
  currencies: CurrenciesEntity[],
  currency: CurrenciesEntity,
  select: (currency: CurrenciesEntity) => void,
}

export const CurrencySelect = ({ 
  currencies, 
  currency,
  select, 
}: Props) => {
  const initialSearch = `${currency.name} (${currency.code})`;
  const [search, setSearch] = useState<string>(initialSearch);
  const [currencyVal, setCurrencyVal] = useState(currency);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setSearch(`${currency.name} (${currency.code})`);
  }, [currencyVal, currency])

  return (
    <div className={styles.container}>
      <input 
        className={styles.input}
        type="text" 
        placeholder="Search Currencies (ctrl+space to expand/collapse)"
        value={search}
        onKeyDown={e => {
          if(e.key === ' ' && e.ctrlKey) {
            setShowDropdown(!showDropdown)
          }
        }}
        onChange={e => {
          setSearch(e.target.value)
          setShowDropdown(true)
        }}
      />
      <div className={styles.ddDiv} style={ showDropdown ?  
        {visibility: 'visible', opacity: '1', display: 'block'} : 
        {visibility: 'hidden', opacity: '0', display: 'none'}
      }>
        {currencies.map((currency: CurrenciesEntity) => 
        (currency.name + currency.code).toLowerCase()
          .includes(search.toLowerCase()) ?
            <option
              className={styles.option}
              key={currency.code}
              onClick={() => {
                select(currency)
                setCurrencyVal(currency)
                setSearch(`${currency.name} (${currency.code})`)
                setShowDropdown(false)
              }}
            >
              {`${currency.name} (${currency.code})`}
            </option> : null
        )}
      </div>
      

    </div>
  );
}
