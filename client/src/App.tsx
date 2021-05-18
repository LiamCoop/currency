import React, { useEffect, useState } from 'react';
import './App.css';
import { Country } from './components';

const ExchangeBaseURL = 'https://v6.exchangerate-api.com/v6';
const key = process.env.REACT_APP_EXCHANGEKEY;

function App() {
  const [countries, setCountries] = useState([]);
  const [rates, setRates] = useState({})

  // there are 250 countries, only 160 currencies
  useEffect(() => {
    const fetchCountries = fetch('https://restcountries.eu/rest/v2/all')
      .then(res => res.json())
      .then(data => setCountries(data));

    const fetchExchanges = fetch(`${ExchangeBaseURL}/${key}/latest/USD`)
      .then(res => res.json())
      .then(data => setRates(data.conversion_rates))
  }, [])

  return (
    <div className="App">
      <header className="App-header"> </header>
    </div>
  );
}

export default App;
