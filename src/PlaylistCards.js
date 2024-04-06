import { Card } from "react-bootstrap";
import "./PlaylistCards.css";

export default function PlaylistCards({ playlist }) {

    return (
        <Card id="playlist-card">
            <Card.Img
                src={playlist.images[0].url}
                style={{ width: "6em", height: "6em" }}
            />
            <Card.Body>
                <Card.Title>{playlist.name}</Card.Title>
            </Card.Body>
        </Card>
    )
}