import { useState, useEffect } from "react";
import { Container, Form, Spinner, Table } from "react-bootstrap";


export default function CurrencyExchange() {
  const currencyAPI = import.meta.env.VITE_EXCHANGE_API;
  const [exchangeRates, setExchangeRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState("MYR");
  const [loading, setLoading] = useState(true);


  const availableCurrencies = ["MYR", "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "SGD"];

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${currencyAPI}&base_currency=${baseCurrency}`);
        if (!response.ok) {
          throw new Error("Failed to fetch exchange rates");
        }
        const data = await response.json();
        setExchangeRates(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, [currencyAPI, baseCurrency]);

  const handleBaseCurrencyChange = (e) => {
    setBaseCurrency(e.target.value);
  };

  const formatExchangeRate = (rate) => {
    return rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading exchange rates...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#343a40', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '50px' }}>
      <Container className="mt-4 text-white">
        <h1 className="text-center mb-4">Currency Exchange Rates</h1>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>From Currency:</Form.Label>
            <Form.Select value={baseCurrency} onChange={handleBaseCurrencyChange}>
              {availableCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>

        <Table striped bordered hover responsive className="mx-auto text-center">
          <thead>
            <tr>
              <th>Currency</th>
              <th>Exchange Rate</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(exchangeRates).map(([currency, rate]) => (
              <tr key={currency}>
                <td>{currency}</td>
                <td>{formatExchangeRate(rate.value)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>

  );
};


