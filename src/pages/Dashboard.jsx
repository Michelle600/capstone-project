import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Spinner, Row, Col, Card } from 'react-bootstrap';

export default function Dashboard() {
    const URL = import.meta.env.VITE_REPLIT_API;
    const [loading, setLoading] = useState(true);
    const [totalMonthlySpending, setTotalMonthlySpending] = useState([]);
    const [totalYearlySpending, setTotalYearlySpending] = useState(0);

    // Fetch Expenses from API and Calculate Spending
    const fetchExpenses = async () => {
        try {
            const response = await axios.get(`${URL}/expenses`);
            if (response.status === 200) {
                const data = response.data;
                calculateTotalSpending(data);
            }
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate total spending for each month and the entire year
    const calculateTotalSpending = (expenses) => {
        let monthlySpending = Array(12).fill(0);
        let totalYear = 0;

        expenses.forEach((expense) => {
            const date = new Date(expense.date);
            const month = date.getMonth();
            const amount = parseFloat(expense.amount);

            monthlySpending[month] += amount;
            totalYear += amount;
        });

        setTotalMonthlySpending(monthlySpending);
        setTotalYearlySpending(totalYear);
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    // Format number as currency (RM)
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(amount);
    };

    return (
        <div style={{ backgroundColor: '#343a40', minHeight: '100vh', paddingTop: '50px' }}>
            {/* Loading Spinner */}
            {loading && (
                <Row className="justify-content-center mb-4">
                    <Spinner animation="border" size="lg" />
                </Row>
            )}
            {/* Header */}
            <Container className="mt-5" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px', padding: '30px' }}>
                <Row className="mb-5">
                    <Col xs={12} className="text-center">
                        <h2 className="display-4 text-dark font-weight-bold">Dashboard</h2>
                        <p className="text-muted">Manage and track your monthly and yearly spending.</p>
                    </Col>
                </Row>

                {/* Yearly Spending */}
                <Row className="mb-4">
                    <Col xs={12}>
                        <Card className="mb-4" style={{ boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                            <Card.Body className="text-center">
                                <Card.Title className="h4">Total Yearly Spending</Card.Title>
                                <Card.Text className="display-4 text-success">{formatCurrency(totalYearlySpending)}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Monthly Spending Summary */}
                <Row className="mb-4">
                    {totalMonthlySpending.map((total, index) => (
                        <Col xs={12} md={4} key={index}>
                            <Card className="mb-4" style={{ boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                                <Card.Body className="text-center">
                                    <Card.Title className="h5">{new Date(0, index).toLocaleString('en-US', { month: 'long' })}</Card.Title>
                                    <Card.Text className="h4 text-primary">{formatCurrency(total)}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}
