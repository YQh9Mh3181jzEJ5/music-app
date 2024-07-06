import axios from "axios";

class SpotifyClient {
  private token?: string;

  static async initialize() {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      {
        grant_type: "client_credentials",
        client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        client_secret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const spotify = new SpotifyClient();
    spotify.token = response.data.access_token;
    return spotify;
  }

  async getPopularSongs() {
    const response = await axios.get(
      "https://api.spotify.com/v1/playlists/37i9dQZF1DX9vYRBO9gjDe/tracks",
      { headers: { Authorization: "Bearer " + this.token } }
    );
    console.log(response);
    return response.data;
  }
}

const spotify = await SpotifyClient.initialize();
export default spotify;
