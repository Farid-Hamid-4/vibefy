# Vibefy

Vibefy is a React-based web application that allows users to discover and explore music tracks, albums, and artists using the Spotify Web API. Users can search for songs or artists, and generate playlists containing similar tracks.

A React-based web application that allows users to discover and explore music tracks, albums, and artists using the Spotify Web API. Users can search for songs or artists, and generate playlists containing similar tracks.

![vibefy-screenshot](https://github.com/Farid-Hamid-4/vibefy/assets/71334751/a5538142-a156-4a7c-b0df-b74868e21f2c)

![vibefy-screenshot](https://github.com/Farid-Hamid-4/vibefy/assets/71334751/a5538142-a156-4a7c-b0df-b74868e21f2c)

## Features

- User authentication using the Spotify Web API authorization flow.
- Search functionality to find tracks, artists, and albums.
- Display of track details including album information and artist details.
- Generate playlist button

## Usage

1. You will be prompted to log in with your Spotify account. Click the "Log in with Spotify" button to authorize the app and grant access to your Spotify data.

2. Once logged in, you can use the search bar to search for songs or artists.

3. Click on the `+` button on the track cards to generate a playlist containing 50 recommended tracks based on the track of your choice.

4. Click on the `+` button on the track cards to generate a playlist containing 50 recommended tracks based on the track of your choice.

## Notes of things to-do

1. Store Access Token in local storage and create a function getAccessToken() for use in requests

   - For persisiting access tokens and for user not to lose access to web-api on page refresh

2. Re-do the authentication process and instead use spotify-web-api-node

3. Clean up the search form design

4. Store the client secret in a .env file

5. Use react-bootstrap placeholders for loading playlist/track cards

6. Implement logout functionality

7. Change UI design with white/purple theme and change fonts

8. Place some filler content for track search, perhaps a recently listened music section
