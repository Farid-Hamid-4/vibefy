import { useState } from "react";
import explicitImage from "./icons8-explicit-30.png";
import { Card, Button, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import "./TrackCards.css";

export default function TrackCards({ spotifyApi, track }) {
  const [playlistCreated, setPlaylistCreated] = useState(false);

  async function getAudioFeatures() {
    const audioFeatures = await spotifyApi.getAudioFeaturesForTrack(
      track.trackId
    );
    return audioFeatures.body;
  }

  async function getTrackRecommendations() {
    const audioFeatures = await getAudioFeatures();
    const recommendations = await spotifyApi.getRecommendations({
      seed_artists: track.artistId,
      seed_tracks: track.trackId,
      target_popularity: track.trackPopularity,
      target_key: audioFeatures.key,
      target_mode: audioFeatures.mode,
      target_loudness: audioFeatures.loudness,
      target_energy: audioFeatures.energy,
      target_danceability: audioFeatures.danceability,
      target_valence: audioFeatures.valence,
      target_tempo: audioFeatures.tempo,
      target_instrumentalness: audioFeatures.instrumentalness,
      target_liveness: audioFeatures.liveness,
      target_speechiness: audioFeatures.speechiness,
      target_acousticness: audioFeatures.acousticness,
      limit: 50,
    });
    return recommendations.body;
  }

  async function createPlaylist() {
    if (!playlistCreated) {
      const recommendations = await getTrackRecommendations();
      spotifyApi
        .createPlaylist("Vibefy Playlist", {
          description: `A playlist created by Vibefy based on ${track.trackName}`,
          public: "false",
        })
        .then((res) => {
          spotifyApi.addTracksToPlaylist(
            res.body.id,
            recommendations.tracks.map((track) => track.uri)
          );
          setPlaylistCreated(true);
          toast.success("Playlist created successfully!");
        });
    }
  }

  return (
    <Col>
      <Card id="track-card">
        <Card.Img
          src={track.albumImage}
          style={{ height: "8rem", width: "8rem" }}
        />
        <Card.Body>
          <Card.Title id="track-name">{track.trackName}</Card.Title>
          <div
            id="artist-name"
            className="d-flex align-items-center text-muted"
          >
            {track.trackExplicit && (
              <img
                id="explicit-symbol"
                alt="explicit symbol"
                src={explicitImage}
              />
            )}
            {track.artistName}
          </div>
        </Card.Body>

        <Button
          id="create-playlist"
          title="Create playlist"
          onClick={() => createPlaylist()}
        >
          &#43;
        </Button>
      </Card>
    </Col>
  );
}
