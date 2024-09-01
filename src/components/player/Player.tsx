import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlayCircle,
  faStopCircle,
  faVolumeMute,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { PlayerProps } from "../../types/type";

export function Player({
  song,
  isPlay,
  onButtonClick,
  volume,
  onVolumeChange,
}: PlayerProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);

  const initializeWaveSurfer = () => {
    if (waveformRef.current && !wavesurfer.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "skyblue",
        progressColor: "orange",
        cursorColor: "white",
        height: 100,
        barWidth: 2,
        barGap: 2,
        barRadius: 2,
      });

      wavesurfer.current.on("ready", () => {
        console.log("WaveSurfer is ready"); // デバッグログ
        setDuration(wavesurfer.current!.getDuration());
        setIsLoading(false);
        setLoadError(false);
      });

      wavesurfer.current.on("error", (error) => {
        console.error("WaveSurfer error:", error); // エラーログ
        setLoadError(true);
        setIsLoading(false);
      });

      wavesurfer.current.on("audioprocess", () => {
        setCurrentTime(wavesurfer.current!.getCurrentTime());
      });
    }
  };

  useEffect(() => {
    initializeWaveSurfer();
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (wavesurfer.current) {
      setIsLoading(true);
      setLoadError(false);
      console.log("Loading new song:", song.preview_url); // デバッグログ
      wavesurfer.current.load(song.preview_url);
    }
  }, [song]);

  useEffect(() => {
    if (wavesurfer.current) {
      wavesurfer.current.setVolume(volume);
    }
  }, [volume]);

  useEffect(() => {
    if (wavesurfer.current) {
      if (isPlay) {
        wavesurfer.current.play();
      } else {
        wavesurfer.current.pause();
      }
    }
  }, [isPlay]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && event.target === document.body) {
        event.preventDefault();
        onButtonClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onButtonClick]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (wavesurfer.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = x / rect.width;
      wavesurfer.current.seekTo(percent);
    }
  };

  return (
    <footer className="fixed bottom-0 w-full bg-gray-800 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center w-1/4">
          <img
            src={song.album.images[0].url}
            alt="thumbnail"
            className="rounded-full mr-3 h-[50px] w-[50px]"
          />
          <div>
            <p className="text-sm font-semibold">{song.name}</p>
            <p className="text-xs text-gray-400">{song.artists[0].name}</p>
          </div>
        </div>
        <div className="flex items-center w-1/2">
          <FontAwesomeIcon
            onClick={onButtonClick}
            icon={isPlay ? faStopCircle : faPlayCircle}
            className="text-white text-3xl cursor-pointer mr-4"
          />
          <div className="flex-grow">
            {isLoading && <p className="text-center">Loading...</p>}
            {loadError && (
              <p className="text-center text-red-500">Failed to load audio</p>
            )}
            {!isLoading && !loadError && (
              <div className="flex justify-between text-xs mt-1">
                <span>{formatTime(currentTime)}</span>
                <div
                  ref={waveformRef}
                  className={`w-full ${isLoading ? "opacity-50" : ""}`}
                  onClick={handleSeek}
                />
                <span>{formatTime(duration)}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center w-1/4 justify-end">
          <FontAwesomeIcon
            onClick={() => onVolumeChange(volume === 0 ? 1 : 0)}
            icon={volume === 0 ? faVolumeMute : faVolumeUp}
            className="text-white text-xl mr-2 cursor-pointer"
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-24"
          />
        </div>
      </div>
    </footer>
  );
}
