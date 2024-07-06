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
  songs: Song[] | null;
  onSongSelected: (song: Song) => void;
}
export interface PlayerProps {
  song: Song;
  isPlay: boolean;
  onButtonClick: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export interface SpotifyTrackItem {
  track: Song;
}

export interface SearchInputProps {
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => Promise<void>;
}
