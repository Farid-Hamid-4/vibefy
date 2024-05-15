import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Image, Row, Col, Button} from "react-bootstrap";
import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import TrackCards from "./TrackCards.js";
import PlaylistCards from "./PlaylistCards.js";
import "./Dashboard.css";

const CLIENT_ID = "2c11048635dd4d6f928a6a38371cbfe9";
const CLIENT_SECRET = "9bb6c018789e4e93818369e315931f37";
const REDIRECT_URI = "https://main.d2xqpnct98klit.amplifyapp.com/";

const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID,
});

export default function Dashboard({ code }) {
    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [expiresIn, setExpiresIn] = useState("");

    const [userProfile, setUserProfile] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [userPlaylists, setUserPlaylists] = useState([]);

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

    // Obtain a new access token when the current one expires
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
    // Also get the userProfile ID and their playlists
    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
        spotifyApi.getMe().then((res) => setUserProfile(res.body));                 
        spotifyApi.getUserPlaylists(userProfile.id).then((res) => {
            setUserPlaylists(res.body.items);
        });
    }, [accessToken]);

    // Search for tracks
    useEffect(() => {
        if (!search) return setSearchResults([]);
        if (!accessToken) return;

        let cancel = false;
        spotifyApi.searchTracks(search, { limit: 24 }).then((res) => {
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
        <Container fluid>
            <Row className="gap-2 py-4" style={{ height: "100vh" }}>
                <Col className="d-flex flex-column gap-2 ms-2" sm={3}>
                    <Row className="d-flex align-items-center p-2 section-background">
                        <Col className="px-0 display-name">{userProfile.display_name}</Col>
                        <Col className="d-flex justify-content-end px-0">
                            {userProfile.images && userProfile.images.length > 0 && (
                                <Image src={userProfile.images[0].url} rounded/>
                            )}
                        </Col>
                    </Row>
                    <Row className="flex-grow-1 section-background">
                        <Col className="mt-2">
                            {userPlaylists.map((playlist) => (
                                <PlaylistCards key={playlist.id} spotifyApi={spotifyApi} playlist={playlist}/>
                            ))}
                        </Col>
                    </Row>
                </Col>
                <Col className="me-2 p-2 section-background" style={{ maxHeight: "100%", overflowY: "auto" }}>
                    <Form.Control
                        className="search-form-control"
                        placeholder="What do you want to search for?"
                        type="search"
                        value={search}
                        autoComplete="off"
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <Row sm={3} className="g-3 my-1">
                        {searchResults.map((track) => (
                            <TrackCards
                                key={track.trackId}
                                spotifyApi={spotifyApi}
                                track={track}
                            />
                        ))}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}
