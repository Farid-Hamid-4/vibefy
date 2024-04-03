import { Card, Col } from "react-bootstrap";
import "./TrackCards.css";


export default function PlaylistCards({ playlist }) {

    return (
        <Col>
            <Card id="track-card">
                <Card.Img
                    src={playlist.images[0].url}
                    style={{ width: "5em", height: "5em" }}
                />
                <Card.Body>
                    <Card.Title style={{ color: "white" }}>{playlist.name}</Card.Title>
                </Card.Body>
            </Card>
        </Col>
    )
}