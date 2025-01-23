import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";

export default function Login() {
    const [modalShow, setModalShow] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");

    const handleShowSignUp = () => setModalShow("SignUp");
    const handleShowLogin = () => setModalShow("Login");
    const handleClose = () => setModalShow(null);

    const navigate = useNavigate();
    const auth = getAuth();
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        if (currentUser) navigate("/");
    }, [currentUser, navigate]);

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            setAlertMessage("Password must be at least 6 characters long.");
            setAlertType("danger");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, username, password);
            setAlertMessage("Account created successfully!");
            setAlertType("success");
            handleClose();
        } catch (error) {
            console.error(error);
            setAlertMessage("An error occurred during sign-up. Please try again.");
            setAlertType("danger");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            setAlertMessage("Password must be at least 6 characters long.");
            setAlertType("danger");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, username, password);
            setAlertMessage("Login successfully!");
            setAlertType("success");
            handleClose();
        } catch (error) {
            console.error(error);
            setAlertMessage("An error occurred during login. Please check your credentials.");
            setAlertType("danger");
        }
    };

    const provider = new GoogleAuthProvider();

    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithPopup(auth, provider);
            setAlertMessage("Login with Google successful!");
            setAlertType("success");
        } catch (error) {
            console.error(error);
            setAlertMessage("An error occurred during Google login. Please try again.");
            setAlertType("danger");
        }
    };

    const backgroundStyle = {
        background: "linear-gradient(135deg, #2c2e83, #1a1c4b)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
    };

    return (
        <div style={backgroundStyle}>
            {/* Alert */}
            {alertMessage && (
                <div className={`alert alert-${alertType}`} role="alert" style={{ position: "absolute", top: "20px", width: "90%", zIndex: "1000" }}>
                    {alertMessage}
                </div>
            )}

            <Container
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "20px",
                    padding: "40px",
                    maxWidth: "420px",
                    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
                    textAlign: "center",
                }}
            >
                {/* Header */}
                <div className="header mb-5">
                    <h2 className="text-center">Money Manager Apps</h2>
                </div>

                {/* Google SignIn */}
                <div className="d-grid gap-3">
                    <Button className="rounded-pill w-100" variant="primary" size="md" onClick={handleGoogleLogin}>
                        <i className="bi bi-google"></i> Sign up with Google
                    </Button>
                </div>

                <div className="mt-2">
                    <p>
                        <strong> or </strong>
                    </p>

                    {/* Create account */}
                    <Button className="rounded-pill w-100" variant="success" size="md" onClick={handleShowSignUp}>
                        Create an account
                    </Button>

                    {/* Already have an account */}
                    <p className="mt-3">
                        <strong>Already have an account? </strong>
                    </p>

                    {/* Login */}
                    <Button className="rounded-pill w-100" variant="outline-primary" size="md" onClick={handleShowLogin}>
                        Login
                    </Button>
                </div>
            </Container>

            {/* Modal for Login or Sign-Up */}
            <Modal show={modalShow !== null} onHide={handleClose} animation={true} centered>

                {/* Title */}
                <Modal.Body>
                    <h2 className="mb-3" style={{ fontWeight: "bold" }}>
                        {modalShow === "SignUp" ? "Create Your Account Now" : "Login"}
                    </h2>

                    {/* Email */}
                    <Form className="d-grid gap-2 px-5" onSubmit={modalShow === "SignUp" ? handleSignUp : handleLogin}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control
                                onChange={(e) => setUsername(e.target.value)}
                                type="email"
                                placeholder="Enter Email"
                                value={username}
                                required
                            />
                        </Form.Group>

                        {/* Password */}
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Enter Password (min. 6 characters)"
                                value={password}
                                required
                            />
                        </Form.Group>

                        {/* T&C for signup */}
                        {modalShow === "SignUp" && (
                            <p style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                                By signing up, you agree to our Terms and Conditions. Learn more.
                            </p>
                        )}

                        {/* Button */}
                        <Button className="rounded-pill w-100" variant="primary" size="md" type="submit">
                            {modalShow === "SignUp" ? "Sign Up" : "Login"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
