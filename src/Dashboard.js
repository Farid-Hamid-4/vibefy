import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Form, Dropdown, Image, Row } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import TrackCards from './TrackCards.js'
import './Dashboard.css'

const spotifyApi = new SpotifyWebApi({
    clientId: '2c11048635dd4d6f928a6a38371cbfe9'
})

export default function Dashboard({ code }) {
    const accessToken = ''
    const [userProfile, setUserProfile] = useState([])
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
        spotifyApi.getMe().then(res => setUserProfile(res.body))
    }, [accessToken])

    useEffect(() => {
        if (!search) return setSearchResults([])
        if (!accessToken) return
        
        let cancel = false
        spotifyApi.searchTracks(search, { limit: 15 }).then(res => {
            if (cancel) return
            setSearchResults(res.body.tracks.items.map(track => {
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
                    artistUri: track.artists[0].uri
                }
            }))
        })
        return () => cancel = true
    }, [search, accessToken])

    return (
        <Container fluid style={{ width: '98%' }}>
            <div className='d-flex align-items-center my-3'>
                <h1>Vibefy</h1>
                <Dropdown style={{ marginLeft: 'auto' }}>
                    <Dropdown.Toggle variant='success' style={{ alignItems: 'center' }}>
                        {userProfile.images && userProfile.images.length > 0 && (
                                <Image id='profile-image' src={userProfile.images[0].url}></Image>
                            )}
                        {userProfile.display_name}
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{ width: '100%'}}>
                        {userProfile.uri && <Dropdown.Item href={userProfile.uri} target='_blank' rel='noopener noreferrer'>Profile</Dropdown.Item>}

                        <Dropdown.Divider />

                        <Dropdown.Item>Log out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            
            <div>
                <Form.Control id='search-form-control' placeholder='Search for song/artist' type='search' value={search} onChange={event => setSearch(event.target.value)}/>
                
                <Row xs={1} md={2} lg={3} className='g-4 my-3'>
                    {searchResults.map(track => (
                        <TrackCards key={track.trackId} spotifyApi={spotifyApi} track={track} />
                    ))}
                </Row>
            </div>
        </Container>
    )
}