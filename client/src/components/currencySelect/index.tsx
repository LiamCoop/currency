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
  let initialSearch = currency.name !== '' ? 
    `${currency.name} (${currency.code})` : '';
  const [currencyVal, setCurrencyVal] = useState(currency);
  const [search, setSearch] = useState<string>(initialSearch);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if(currencyVal.name !== ''){
      setSearch(`${currency.name} (${currency.code})`)
    } else {
      setSearch('');
    }
  }, [currencyVal, currency])

  return (
    <div className={styles.container}>
      <input 
        className={styles.input}
        type="text" 
        placeholder="Search Currencies"
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
      {showDropdown && currencies.map((currency: CurrenciesEntity) => 
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
  );
}
