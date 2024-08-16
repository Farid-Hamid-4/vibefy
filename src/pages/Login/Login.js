import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Row, Col } from "react-bootstrap";
import Lottie from "lottie-react";
import Animation from "./assets/Animation.json";
import "./Login.css";

const clientId = `${process.env.REACT_APP_SPOTIFY_CLIENT_ID}`;
const redirectUri = `${process.env.REACT_APP_SPOTIFY_REDIRECT_URI}`;
const scopes = `${process.env.REACT_APP_SPOTIFY_SCOPES}`;
const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`;

export default function Login() {
  return (
    <Container fluid>
      <Row className="login-background">
        <Col
          id="login-headings"
          className="d-flex flex-column justify-content-center align-items-start ps-5"
        >
          <h1>Vibefy</h1>
          <h2>Curate a playlist based on a song of your choice</h2>
          <Button active id="login-button" href={authUrl}>
            Login with Spotify
          </Button>
        </Col>
        <Col className="d-none d-md-flex justify-content-center">
          <Lottie loop={true} animationData={Animation} />
        </Col>
      </Row>
    </Container>
  );
}
