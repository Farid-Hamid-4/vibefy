import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Row, Col } from "react-bootstrap";
import Lottie from "lottie-react";
import Animation from "./Animation3.json";
import "./Login.css";

const CLIENT_ID = "2c11048635dd4d6f928a6a38371cbfe9";
// const REDIRECT_URI = "https://main.d2xqpnct98klit.amplifyapp.com/";
const REDIRECT_URI = "http://localhost:3000/";
const SCOPES = "user-top-read playlist-modify-private streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state";
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}`;

export default function Login() {
  return (
    <Container fluid>
      <Row id="background" style={{ height: "100vh" }}>
        <Col id="login" className="d-flex flex-column justify-content-center align-items-start ps-5">
          <h1>Vibefy</h1>
          <h2>Get recommended tracks based on a song of your choice</h2>
          <Button active id="login-button" href={AUTH_URL}>
            Login with Spotify
          </Button>
        </Col>
        <Col className="d-flex justify-content-center">
          <Lottie loop={true} animationData={Animation}/>
        </Col>
      </Row>
    </Container>
  );
}
