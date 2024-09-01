import axios from "axios";

class SpotifyClient {
  private token: string | null = null;
  private tokenExpirationTime: number = 0;
  private readonly TOKEN_REFRESH_MARGIN = 5 * 60 * 1000;

  private async getToken() {
    const now = Date.now();
    if (
      this.token &&
      now + this.TOKEN_REFRESH_MARGIN < this.tokenExpirationTime
    ) {
      return this.token;
    }
    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
          client_secret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      this.token = response.data.access_token;
      this.tokenExpirationTime =
        Date.now() +
        response.data.expires_in * 1000 -
        this.TOKEN_REFRESH_MARGIN;

      return this.token;
    } catch (error) {
      console.error("Error getting token:", error);
      throw error;
    }
  }

  async getPopularSongs() {
    const token = await this.getToken();
    const response = await axios.get(
      "https://api.spotify.com/v1/playlists/37i9dQZF1DX9vYRBO9gjDe/tracks",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  async searchSongs(keyword: string, limit: number, offset: number) {
    const token = await this.getToken();
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: keyword, type: "track", limit, offset },
    });
    return response.data.tracks;
  }
}

const spotify = new SpotifyClient();
export default spotify;
