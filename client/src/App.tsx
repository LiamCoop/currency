import React, { useEffect, useState } from 'react';
import styles from './App.module.css';
import { 
  Rates, 
  CurrencySelect,
  NumberInput,
  Country,
  CurrenciesEntity,
  Swap,
} from './components';

const ExchangeBaseURL = 'https://v6.exchangerate-api.com/v6';
const key = process.env.REACT_APP_EXCHANGEKEY;

function App() {
  const [currencies, setCurrencies] = useState<CurrenciesEntity[]>([]);
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

  // fetch & set currencies & exchange rates (160 currencies)
  useEffect(() => {
    fetch(`${ExchangeBaseURL}/${key}/latest/USD`)
      .then(res => res.json())
      .then(({conversion_rates}: Rates) =>
        setRates(new Map<string, number>(
          Object.entries(conversion_rates))
        )
      )
  }, [])

  // fetch currencies from 250 countries, 
  // reduce to common between rates & countries
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

  
  // update output to conversion factor * input
  // triggers on change of input, rates, or i/o currencies (convert)
  useEffect(() => {
    let val: number = parseFloat(input);
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
      <div className={styles.InputContainer} >
        <div className={styles.input}>
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
        <div className={styles.input}>
          <input readOnly
            value={output} 
            placeholder="Resultant Amount"
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
          <img src={Swap} alt="swap" height="60px" />
        </button>
      </div>
    </div>
  );
}

export default App;
