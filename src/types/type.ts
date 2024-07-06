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
  preview_url: string;
}

export interface SongListProps {
  isLoading: boolean;
  songs: Song[];
  onSongSelected: (song: Song) => void;
}
export interface PlayerProps {
  song: Song;
  isPlay: boolean;
  onButtonClick: () => void;
}

export interface SpotifyTrackItem {
  track: Song;
}
