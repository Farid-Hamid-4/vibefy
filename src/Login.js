import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button } from "react-bootstrap";
import "./Login.css";
import dotenv from 'dotenv';
dotenv.config();

const REDIRECT_URI = 'https://main.d2xqpnct98klit.amplifyapp.com/';
const SCOPES =
  "user-top-read playlist-modify-private streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state";
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}`;

export default function Login() {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="col">
        <h1>Vibefy</h1>
        <h2>Get recommended tracks based on a song of your choice</h2>
        <Button
          variant="success"
          id="login-button"
          className="btn"
          href={AUTH_URL}
        >
          Login with Spotify
        </Button>
      </div>
    </Container>
  );
}
