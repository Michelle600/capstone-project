import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {

    const navigate = useNavigate();

    function returnToHome() {
        navigate('/dashboard');
    }

    const backgroundStyle = {
        backgroundImage: `url('https://png.pngtree.com/thumb_back/fh260/background/20230630/pngtree-astronaut-fishes-for-answers-on-3d-404-error-page-image_3691381.jpg')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%',
    };

    return (
        <div style={backgroundStyle}>
            <div className="d-flex justify-content-end align-items-center h-100">
                <Card className="text-center border-0 bg-light shadow" style={{ maxWidth: '400px', marginRight: '6rem' }}>
                    <Card.Body>
                        <Card.Title>Error 404</Card.Title>
                        <Card.Text>
                            Sorry, the page you are looking for does not exist or is unavailable.
                        </Card.Text>
                        <Button variant="primary" onClick={returnToHome}>Back to Dashboard</Button>
                    </Card.Body>
                </Card>
            </div>

        </div>
    );
}
