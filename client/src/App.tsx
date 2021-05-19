import React, { useEffect, useState } from 'react';
import styles from './App.module.css';
import { 
  Rates, 
  CurrencySelect,
  NumberInput,
  Country,
  CurrenciesEntity,
} from './components';

const ExchangeBaseURL = 'https://v6.exchangerate-api.com/v6';
const key = process.env.REACT_APP_EXCHANGEKEY;

function App() {
  const [currencies, setCurrencies] = useState<CurrenciesEntity[]>([]);
  // rates should be a hashmap
  const [rates, setRates] = useState<Map<string, number>>(new Map());
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [convert, setConvert] = useState({ 
    first: {
      "code": "CAD",
      "name": "Canadian dollar",
      "symbol": "$"
    }, 
    second: {
      "code": "USD",
      "name": "United State Dollar",
      "symbol": "$"
    },
  });

  // there are 250 countries, only 160 currencies
  useEffect(() => {
    fetch('https://restcountries.eu/rest/v2/all')
      .then(res => res.json())
      .then(data => {
        let addedCurrencies = new Set()
        let filtered = data
          .flatMap(({currencies}: Country) => currencies)
          .filter(({code}: CurrenciesEntity) => {
            if (rates.has(code) && !addedCurrencies.has(code)) {
              addedCurrencies.add(code)
              return true
            }
            return false
          });
        setCurrencies(filtered);
      })
  }, [rates])

  useEffect(() => {
    fetch(`${ExchangeBaseURL}/${key}/latest/USD`)
      .then(res => res.json())
      .then(({conversion_rates}: Rates) =>
        setRates(new Map<string, number>(
          Object.entries(conversion_rates))
        )
      )
  }, [])

  useEffect(() => {
    let addedCurrencies = new Set()
    setCurrencies(
      currencies.filter(({code}: CurrenciesEntity) => {
        if (rates.has(code) && !addedCurrencies.has(code)) {
          addedCurrencies.add(code)
          return true
        }
        return false
      })
    )
  }, [rates])

  useEffect(() => {
    let val = parseFloat(input);
    const cf1 = rates.get(convert.first.code)
    const cf2 = rates.get(convert.second.code)
    if(cf1 && cf2) {
      val = val * cf2 / cf1
    }

    if(isNaN(val)) setOutput('')
    else if (Number.isInteger(val)) setOutput(String(val))
    else setOutput(val.toFixed(2))
  }, [input, rates, convert])

  const handleSwap = () => {
    setConvert({ first: convert.second, second: convert.first });
  }

  return (
    <div className={styles.App}>
      <header></header>

      <div className={styles.InputContainers} >
        <div className={styles.ioGroup}>
          <NumberInput 
            value={input} 
            adjustValue={(val: string) => setInput(val)}
          />
          <CurrencySelect 
            currencies={currencies} 
            currency={convert.first}
            select={(currency: CurrenciesEntity) => {
              setConvert({...convert, first: currency})
            }}
          />
        </div>
        <div className={styles.ioGroup}>
          <input readOnly
            value={output ? output : ''} 
            placeholder="output"
          />
          <CurrencySelect 
            currencies={currencies} 
            currency={convert.second}
            select={(currency: CurrenciesEntity) => {
              setConvert({...convert, second: currency})
            }}
          />
        </div>
        <button className={styles.swapButton} onClick={handleSwap}>
            <p>swap</p>
        </button>
      </div>
    </div>
  );
}

export default App;
