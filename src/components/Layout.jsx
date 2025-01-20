import { useEffect } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

export default function Layout() {
    const auth = getAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!auth.currentUser) {
            navigate("/login");
        }
    }, [auth, navigate]);

    const handleLogout = () => {
        auth.signOut();
        navigate("/login");
    };

    return (
        <>
            <Navbar bg="black" variant="dark" expand="lg" className="px-3">
                <Navbar.Brand href="/" className="me-auto ms-3">
                    <i className="bi bi-coin"></i> <em>Expenses Manager</em>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ms-auto me-3">
                        <Nav.Link href="/" className="me-3">
                            <i className="bi bi-clipboard-data"> Dashboard</i>
                        </Nav.Link>
                        <Nav.Link href="/currency" className="me-3">
                            <i className="bi bi-currency-exchange"> Currency Exchange Rate</i>
                        </Nav.Link>
                        <Nav.Link href="/expenses" className="me-3">
                            <i className="bi bi-wallet2"> Expenses </i>
                        </Nav.Link>
                        <Nav.Link href="/receipt" className="me-3">
                            <i className="bi bi-receipt"> Receipt </i>
                        </Nav.Link>

                        {/* Hide Logout link on the login page */}
                        {location.pathname !== "/login" && (
                            <Nav.Link className="me-3" onClick={handleLogout}>
                                <i className="bi bi-box-arrow-in-right"> Logout</i>
                            </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <Container fluid className="p-0">
                <Outlet />
            </Container>
        </>
    );
}
