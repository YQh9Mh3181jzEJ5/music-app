export interface Artist {
  name: string;
}

export interface Album {
  images: { url: string }[];
}

export interface Song {
  id: string;
  name: string;
  album: Album;
  artists: Artist[];
}

export interface SongListProps {
  isLoading: boolean;
  songs: Song[];
}

export interface SpotifyTrackItem {
  track: Song;
}