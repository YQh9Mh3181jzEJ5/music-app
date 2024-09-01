import axios from "axios";

class SpotifyClient {
  private token: string | null = null;
  private tokenExpirationTime: number = 0;

  private async getToken() {
    if (this.token && Date.now() < this.tokenExpirationTime) {
      return this.token;
    }

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
    // トークンの有効期限を設定（1時間 = 3600秒）
    this.tokenExpirationTime = Date.now() + response.data.expires_in * 1000;
    return this.token;
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
