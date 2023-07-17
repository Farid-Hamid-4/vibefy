import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Dropdown, Image, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import TrackCards from "./TrackCards.js";
import "./Dashboard.css";
import dotenv from 'dotenv';
dotenv.config();

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const REDIRECT_URI = 'https://main.d2xqpnct98klit.amplifyapp.com/';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_CLIENT_ID,
});

export default function Dashboard({ code }) {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresIn, setExpiresIn] = useState("");

  const [userProfile, setUserProfile] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Obtain the access token in exchange for the authorization code
  useEffect(() => {
    const obtainAccessToken = async () => {
      if (!code) return;

      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ` + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: REDIRECT_URI,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setAccessToken(data.access_token);
          setRefreshToken(data.refresh_token);
          setExpiresIn(data.expires_in);
        } else {
          console.error("Failed to obtain access token:", response.status);
        }
      } catch (error) {
        console.error("Failed to fetch access token:", error);
      }
    };

    obtainAccessToken();
  }, [code]);

  const refreshAccessToken = async () => {
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ` + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
        },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
      });

      const data = await response.json();
      setAccessToken(data.access_token);
      setExpiresIn(data.expires_in);
    } catch (error) {
      console.log(error);
    }
  };

  // Refresh the access token before it expires
  useEffect(() => {
    if (refreshToken && expiresIn) {
      const interval = setInterval(() => {
        refreshAccessToken();
      }, (expiresIn - 60) * 1000);

      return () => clearInterval(interval);
    }
  }, [refreshToken, expiresIn]);

  // Set the access token on the API object to use it in later calls
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.getMe().then((res) => setUserProfile(res.body));
  }, [accessToken]);

  // Search for tracks
  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search, { limit: 15 }).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          return {
            trackId: track.id,
            trackName: track.name,
            trackUri: track.uri,
            trackExplicit: track.explicit,
            albumId: track.album.id,
            albumImage: track.album.images[1].url,
            albumUri: track.album.uri,
            artistId: track.artists[0].id,
            artistName: track.artists[0].name,
            artistUri: track.artists[0].uri,
          };
        })
      );
    });
    return () => (cancel = true);
  }, [search, accessToken]);

  return (
    <Container fluid style={{ width: "98%" }}>
      <div className="d-flex align-items-center my-3">
        <h1>Vibefy</h1>
        <Dropdown style={{ marginLeft: "auto" }}>
          <Dropdown.Toggle variant="success" style={{ alignItems: "center" }}>
            {userProfile.images && userProfile.images.length > 0 && (
              <Image id="profile-image" src={userProfile.images[0].url}></Image>
            )}
            {userProfile.display_name}
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ width: "100%" }}>
            {userProfile.uri && (
              <Dropdown.Item
                href={userProfile.uri}
                target="_blank"
                rel="noopener noreferrer"
              >
                Profile
              </Dropdown.Item>
            )}

            <Dropdown.Divider />

            <Dropdown.Item>Log out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div>
        <Form.Control
          id="search-form-control"
          placeholder="Search for song/artist"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <Row xs={1} md={2} lg={3} className="g-4 my-3">
          {searchResults.map((track) => (
            <TrackCards
              key={track.trackId}
              spotifyApi={spotifyApi}
              track={track}
            />
          ))}
        </Row>
      </div>
    </Container>
  );
}
