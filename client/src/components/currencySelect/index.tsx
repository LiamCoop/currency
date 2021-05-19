import React, { useState } from 'react';
import { CurrenciesEntity } from '..';
import styles from './CurrencySelect.module.css';

interface Props {
  currencies: CurrenciesEntity[],
  select: (currency: string) => void,
}

export const CurrencySelect = ({ 
  currencies, 
  select, 
}: Props) => {
  const [search, setSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className={styles.container}>
      <input 
        className={styles.input}
        type="text" 
        placeholder="Search currencies"
        value={search}
        onClick={() => setShowDropdown(true)}
        onChange={e => {
          setSearch(e.target.value)
          setShowDropdown(true)
        }}
      />
      {showDropdown && currencies.map((currency: CurrenciesEntity) => 
        currency.name.toLowerCase().includes(search.toLowerCase()) ?
          <option
            className={styles.option}
            key={currency.code}
            onClick={() => {
              select(currency.code)
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
