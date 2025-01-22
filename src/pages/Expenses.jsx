import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Container, Table, Modal, Form, Spinner, Row, Col, Image } from 'react-bootstrap';
import { addExpense, deleteExpense, fetchExpenses, updateExpense, uploadFileToFirebase } from '../features/expensesSlice.js';
import { storage } from '../firebase.js';
import { deleteObject, ref } from 'firebase/storage';

export default function Expenses() {
    const dispatch = useDispatch();
    const { expenses, loading } = useSelector((state) => state.expenses);

    const [showModal, setShowModal] = useState(false);
    const [expenseData, setExpenseData] = useState({
        id: null,
        title: '',
        amount: '',
        date: '',
        month: '',
    });

    const [file, setFile] = useState(null);

    useEffect(() => {
        dispatch(fetchExpenses());
    }, [dispatch]);

    const handleAddExpense = () => {
        setExpenseData({ id: null, title: '', amount: '', date: '', month: '', file });
        setFile(null);
        setShowModal(true);
    };

    const handleEditExpense = (expense) => {
        setExpenseData(expense);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = expenseData.imageurl;

        if (file) {
            imageUrl = await uploadFileToFirebase(file);
        }

        const expenseDataWithImage = {
            ...expenseData,
            imageurl: imageUrl,
        };

        if (expenseData.id) {
            dispatch(updateExpense({ expenseData: expenseDataWithImage, file }));
        } else {
            dispatch(addExpense({ expenseData: expenseDataWithImage, file }));
        }
        setFile(null);
        setShowModal(false);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleDeleteExpense = (id) => {
        dispatch(deleteExpense(id));
    };

    const handleDeleteImage = async () => {
        if (expenseData.imageurl) {
            try {
                const imageRef = ref(storage, expenseData.imageurl);
                await deleteObject(imageRef);
                const updatedExpenseData = { ...expenseData, imageurl: null };
                await dispatch(updateExpense({ expenseData: updatedExpenseData, file: null }));
                setExpenseData({ ...expenseData, imageurl: null });
                alert('Image deleted successfully');
            } catch (error) {
                console.error(error);
            }
        }
    };

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
                {/* Header */}
                <Row className="mb-4">
                    <Col xs={12} className="text-center">
                        <h2 className="display-4 text-dark font-weight-bold">Expense Management</h2>
                    </Col>
                </Row>

                {/* Button */}
                <Button
                    className="btn btn-primary mb-3"
                    onClick={handleAddExpense}
                    style={{
                        borderRadius: '20px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    Add Expense
                </Button>

                {/* Expenses Table - Grouped by Month */}
                {Object.keys(expenses).map((month) => (
                    <div key={month}>
                        <h3 className="text-primary">{month}</h3>
                        <Table
                            striped
                            bordered
                            hover
                            responsive
                            className="mb-4"
                            style={{
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                                borderRadius: '10px',
                            }}
                        >
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center', width: '200px' }}>Date</th>
                                    <th style={{ textAlign: 'center', width: '350px' }}>Title</th>
                                    <th style={{ textAlign: 'center', width: '350px' }}>Amount (RM)</th>
                                    <th style={{ textAlign: 'center', width: '350px' }}>Receipt</th>
                                    <th style={{ textAlign: 'center', width: '120px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses[month].map((expense) => (
                                    <tr key={`${month}-${expense.id}`} style={{ cursor: 'pointer', transition: 'background-color 0.3s ease' }}>
                                        <td style={{ textAlign: 'center' }}>{expense.date}</td>
                                        <td style={{ textAlign: 'center' }}>{expense.title}</td>
                                        <td style={{ textAlign: 'center' }}>{expense.amount}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            {expense.imageurl ? (
                                                <a href={expense.imageurl} target="_blank" rel="noopener noreferrer">
                                                    <Image
                                                        src={expense.imageurl}
                                                        alt="Receipt"
                                                        style={{ width: 100, cursor: 'pointer' }}
                                                    />
                                                </a>
                                            ) : (
                                                <p>No Receipt</p>
                                            )}
                                        </td>
                                        <td className="d-flex justify-content-center align-items-center">
                                            <Button
                                                className="btn btn-warning mx-1"
                                                onClick={() => handleEditExpense(expense)}
                                                style={{ borderRadius: '12px' }}
                                            >
                                                <i className="bi bi-pencil-fill"></i>
                                            </Button>
                                            <Button
                                                className="btn btn-danger mx-1"
                                                onClick={() => handleDeleteExpense(expense.id)}
                                                style={{ borderRadius: '12px' }}
                                            >
                                                <i className="bi bi-trash-fill"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                ))}



                {/* Modal for Adding or Editing Expenses */}
                <Modal show={showModal} onHide={() => setShowModal(false)} animation={true} centered>
                    <Modal.Header>
                        <Modal.Title>{expenseData.id ? 'Edit Expense' : 'Add Expense'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={expenseData.date ? expenseData.date.split('/').reverse().join('-') : ''}
                                    onChange={(e) => {
                                        const newDate = e.target.value.split('-').reverse().join('/');
                                        setExpenseData({ ...expenseData, date: newDate });
                                    }}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter title"
                                    value={expenseData.title}
                                    onChange={(e) => setExpenseData({ ...expenseData, title: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Amount"
                                    value={expenseData.amount}
                                    onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Receipt</Form.Label>
                                <Form.Control type="file" onChange={handleFileChange} />
                            </Form.Group>
                            {expenseData.imageurl && (
                                <div className="mb-3">
                                    <Image src={expenseData.imageurl} alt="Receipt" style={{ width: 100 }} />
                                    <p>Current Image</p>
                                </div>
                            )}
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                {expenseData.imageurl && (
                                    <Button variant="danger" onClick={handleDeleteImage} style={{ borderRadius: '20px' }}>
                                        Delete Image
                                    </Button>
                                )}
                                <Button type="submit" className="primary" style={{ borderRadius: '20px' }}>
                                    {loading ? <Spinner animation="border" size="sm" /> : expenseData.id ? 'Update Expense' : 'Add Expense'}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
}
