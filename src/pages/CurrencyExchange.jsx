import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Table } from 'react-bootstrap';

export default function CurrencyExchange() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('MYR');
  const [conversionRates, setConversionRates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const currencyAPI = import.meta.env.VITE_EXCHANGE_API

  const currencies = ['MYR', 'USD', 'EUR', 'GBP', 'AUD', 'SGD', 'JPY', 'KRW'];

  useEffect(() => {
    const fetchExchangeRates = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${currencyAPI}/latest/${fromCurrency}`);


        console.log('API Response:', response.data);


        if (response.data && response.data.conversion_rates) {
          setConversionRates(response.data.conversion_rates);
        } else {
          setError('Invalid data structure from API.');
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('Error fetching exchange rates.');
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, [fromCurrency]);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
  };

  // Function to format numbers with commas and two decimals
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div style={{ backgroundColor: '#343a40', minHeight: '100vh', paddingTop: '50px' }}>
      <Container style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#f4f4f9', borderRadius: '10px' }}>
        {/* Header */}
        <h2 style={{ textAlign: 'center' }}>Currency Exchange</h2>

        {/* Select base currency */}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>From Currency</Form.Label>
            <Form.Select value={fromCurrency} onChange={handleCurrencyChange}>
              {currencies.map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Amount ({fromCurrency})</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder={`Enter amount in ${fromCurrency}`}
            />
          </Form.Group>
        </Form>

        {/* Loading or Error Messages */}
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}

        {/* Display all exchange rates in a table */}
        {conversionRates && Object.keys(conversionRates).length > 0 && !loading && !error ? (
          <Container>
            <h3>Converted Amount:</h3>
            <Table striped bordered hover>
              <thead style={{ textAlign: 'center' }}>
                <tr>
                  <th>Currency</th>
                  <th>Conversion Rate</th>
                  <th>Converted Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(conversionRates).map((currencyCode) => (
                  <tr key={currencyCode} style={{ textAlign: 'center' }}>
                    <td>
                      <strong>{currencyCode}</strong>
                    </td>
                    <td>{formatNumber(conversionRates[currencyCode])}</td>
                    <td>{formatNumber(amount * conversionRates[currencyCode])}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        ) : (
          <div>No exchange rates available at the moment.</div>
        )}
      </Container>
    </div>
  );
}
