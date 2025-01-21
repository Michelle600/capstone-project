import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { fetchExpenses } from '../features/expensesSlice.js';

export default function Receipt() {
    const dispatch = useDispatch();
    const { expenses, loading } = useSelector((state) => state.expenses);

    useEffect(() => {
        dispatch(fetchExpenses());
    }, [dispatch]);

    return (
        <div style={{ backgroundColor: '#343a40', minHeight: '100vh', paddingTop: '50px' }}>
            <Container
                className="mt-4"
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    padding: '30px',
                    minHeight: '100vh',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                }}
            >
                <h2 className="text-center text-dark mb-4">Receipts</h2>

                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <Row>
                        {/* Iterate through all receipts */}
                        {Object.keys(expenses).map((month) =>
                            expenses[month]
                                .filter((expense) => expense.imageurl) 
                                .map((expense) => (
                                    <Col
                                        xs={12} 
                                        sm={6} 
                                        md={4} 
                                        lg={3}
                                        key={expense.id}
                                        className="mb-4"
                                    >
                                        <Card
                                            style={{
                                                borderRadius: '10px',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Card.Img
                                                variant="top"
                                                src={expense.imageurl}
                                                alt="Receipt"
                                                style={{
                                                    height: '200px',
                                                    objectFit: 'cover',
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.3s ease',
                                                }}
                                                onClick={() => window.open(expense.imageurl, '_blank')}
                                                onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                                                onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                                            />
                                            <Card.Body>
                                                <Card.Title className="text-center">{expense.title}</Card.Title>
                                                <Card.Text className="text-center text-muted">{expense.date}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                        )}
                    </Row>
                )}
            </Container>
        </div>
    );
}
