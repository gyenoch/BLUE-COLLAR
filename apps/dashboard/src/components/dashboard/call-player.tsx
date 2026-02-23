'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDuration } from '@/lib/utils'
import { cn } from '@/lib/cn'

interface CallPlayerProps {
  recordingUrl: string
  duration?: number
  className?: string
}

export function CallPlayer({ recordingUrl, duration, className }: CallPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(duration ?? 0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = () => setTotalDuration(audio.duration)
    const onEnded = () => setPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play()
    }
    setPlaying(!playing)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !muted
    setMuted(!muted)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const time = Number(e.target.value)
    audio.currentTime = time
    setCurrentTime(time)
  }

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0

  return (
    <div className={cn('flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3', className)}>
      <audio ref={audioRef} src={recordingUrl} preload="metadata" />

      <Button variant="ghost" size="icon" onClick={togglePlay} className="h-9 w-9 flex-shrink-0">
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      <div className="flex-1 space-y-1">
        <input
          type="range"
          min={0}
          max={totalDuration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 accent-primary cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>{formatDuration(Math.floor(currentTime))}</span>
          <span>{formatDuration(Math.floor(totalDuration))}</span>
        </div>
      </div>

      <Button variant="ghost" size="icon" onClick={toggleMute} className="h-9 w-9 flex-shrink-0">
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
    </div>
  )
}
