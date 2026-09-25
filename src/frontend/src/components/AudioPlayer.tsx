import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RefreshCw, Radio } from 'lucide-react';
import type { VillageThreat } from '../types';

interface AudioPlayerProps {
  village: VillageThreat | null;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ village }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [village]);

  const togglePlay = () => {
    if (!audioRef.current || !village) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Audio playback notice:', err));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 1;
    setCurrentTime(cur);
    setDuration(dur);
    setProgress((cur / dur) * 100);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full bg-white border-2 border-black p-3.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={village?.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Title & ElevenLabs Badge */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2 mb-3">
        <div className="flex items-center space-x-1.5">
          <Radio className="w-4 h-4 text-blue-900 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-900">
            ElevenLabs Voice Alert File
          </span>
        </div>
        <span className="bg-blue-900 text-white text-[10px] font-extrabold px-2 py-0.5 uppercase border border-black">
          BENGALI TTS
        </span>
      </div>

      {/* Audio Waveform / Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[11px] font-black text-slate-900 mb-1">
          <span>STATUS: {isPlaying ? 'BROADCASTING...' : 'STANDBY'}</span>
          <span>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <div className="w-full bg-slate-200 border-2 border-black h-3 relative">
          <div
            className="bg-blue-900 h-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={togglePlay}
          disabled={!village}
          className={`gov-btn flex items-center space-x-2 px-4 py-2 font-black text-xs uppercase ${
            isPlaying ? 'bg-amber-500 text-black' : 'bg-blue-900 text-white'
          } disabled:opacity-50`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isPlaying ? 'PAUSE VOICE' : 'PLAY VOICE ALERT'}</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className="gov-btn bg-slate-100 p-2 text-slate-900 font-bold"
            title="Toggle Mute"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-700" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            className="gov-btn bg-slate-100 p-2 text-slate-900 font-bold"
            title="Re-generate Audio"
            onClick={() => alert('ElevenLabs audio re-synthesis queued.')}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
