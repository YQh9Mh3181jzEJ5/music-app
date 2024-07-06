import {
  faPlayCircle,
  faStopCircle,
  faVolumeMute,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PlayerProps } from "../types/type";
import { useEffect, useRef, useState } from "react";

export function Player({
  song,
  isPlay,
  onButtonClick,
  volume,
  onVolumeChange,
}: PlayerProps) {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>("");
  const volumeSliderRef = useRef<HTMLInputElement>(null);
  const [previousVolume, setPreviousVolume] = useState<number>(volume);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      const newVolume = Math.max(0, Math.min(1, volume + delta));
      onVolumeChange(newVolume);
    };

    const sliderElement = volumeSliderRef.current;
    if (sliderElement) {
      sliderElement.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && event.target === document.body) {
        event.preventDefault();
        onButtonClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (sliderElement) {
        sliderElement.removeEventListener("wheel", handleWheel);
      }

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [volume, onVolumeChange, onButtonClick]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);

    setIsMuted(false);
    setPreviousVolume(newVolume);
  };

  const toggleMute = (): void => {
    if (isMuted) {
      onVolumeChange(previousVolume);
    } else {
      setPreviousVolume(volume);
      onVolumeChange(0);
    }
    setIsMuted(!isMuted);
  };

  const displayVolume = Math.round(volume * 100);

  const handleVolumeClick = (): void => {
    setIsEditing(true);
    setEditValue(displayVolume.toString());
  };

  const handleVolumeInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (/^\d*$/.test(value) && parseInt(value, 10) <= 100) {
      setEditValue(value);
    }
  };

  const handleVolumeInputBlur = (): void => {
    setIsEditing(false);
    if (editValue !== "") {
      const newVolume = parseInt(editValue, 10) / 100;
      onVolumeChange(newVolume);
    }
  };

  const handleVolumeInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleVolumeInputBlur();
    }
  };

  return (
    <footer className="fixed bottom-0 w-full bg-gray-800 p-5">
      <div className="grid grid-cols-3">
        <div className="flex items-center">
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
        <div className="flex items-center justify-center">
          <FontAwesomeIcon
            onClick={onButtonClick}
            icon={isPlay ? faStopCircle : faPlayCircle}
            className="text-white text-3xl mx-2 h-[40px] w-[40px] cursor-pointer"
          />
        </div>
        <div className="flex items-center justify-end">
          <FontAwesomeIcon
            onClick={toggleMute}
            icon={isMuted || volume === 0 ? faVolumeMute : faVolumeUp}
            className="text-white text-xl mr-2 cursor-pointer"
          />
          <input
            ref={volumeSliderRef}
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 mr-1"
            aria-label="Volume control"
          />
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={handleVolumeInputChange}
              onBlur={handleVolumeInputBlur}
              onKeyDown={handleVolumeInputKeyDown}
              className="bg-gray-700 text-white text-sm w-12 px-1 rounded"
              autoFocus
            />
          ) : (
            <span
              className="text-white text-sm w-12 cursor-pointer"
              onClick={handleVolumeClick}
            >
              {displayVolume}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
