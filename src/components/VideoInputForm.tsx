import { Label } from "@radix-ui/react-label";
import { Separator } from "@radix-ui/react-separator";
import { FileVideo, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ChangeEvent, FormEvent, useMemo, useState, useRef } from "react";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from '@ffmpeg/util'
import { api } from "@/lib/axios";

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

const statusMessages = {
  converting: 'Converting...',
  uploading: 'Uploading...',
  generating: 'Generating...',
  success: 'Success!'
}

interface VideoInputFormProps {
  onVideoUploaded: (id: string) => void
}

export function VideoInputForm(props: VideoInputFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const promptInputRef = useRef<HTMLTextAreaElement>(null)
  const [status, setStatus] = useState<Status>('waiting')

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget

    if (files) {
      const selectedFile = files[0]

      setVideoFile(selectedFile)
    }
  }

  const previewUrl = useMemo(() => {
    if (videoFile) {
      return URL.createObjectURL(videoFile)
    }
  }, [videoFile])


  async function convertVideoToAudio(video: File) {
    const ffmpeg = await getFFmpeg()

    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    ffmpeg.on('progress', progress => {
      console.log(`Convert progress ${Math.round(progress.progress * 100)}`)
    })

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3'
    ])

    const data = await ffmpeg.readFile('output.mp3')

    const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
    const audioFile = new File([audioFileBlob], 'audio.mp3', {
      type: 'audio/mpeg'
    })

    return audioFile
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const prompt = promptInputRef.current?.value

    if (!videoFile) {
      return
    }

    setStatus('converting')

    const audioFile = await convertVideoToAudio(videoFile)

    const data = new FormData()

    data.append('file', audioFile)

    setStatus('uploading')

    const response = await api.post('/videos', data)

    const videoId = response.data.video.id

    setStatus('generating')

    await api.post(`/videos/${videoId}/transcription`, {
      prompt
    })

    setStatus('success')

    props.onVideoUploaded(videoId)
  }

  return (
      <form className="space-y-6" onSubmit={handleUploadVideo}>
        <label
          htmlFor="video"
          className="relative border flex rounded-sm aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-zinc-400/5"
          >
          {previewUrl ? (
            <video src={previewUrl} controls={false} className="pointer-events-none absolute inset-0"></video>
          ) : (
            <>
              <FileVideo className="w-4 h-4"/>
              Select one video
            </>
          )}
        </label>

        <input type="file" id="video" accept="video/mp4" className="sr-only" onChange={handleFileSelected} />

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="transcription-prompt">Transcription prompt</Label>
          <Textarea
            id="transcription-prompt"
            disabled={status !== 'waiting'}
            ref={promptInputRef}
            className="h-20 leading-relaxed resize-none"
            placeholder="Include the key words mentioned on the video separated by comma (,)"
          />
        </div>

        <Button
          data-success={status === 'success'}
          disabled={status !== 'waiting'}
          type="submit"
          className="w-full data-[success=true]:bg-white"
        >
          {status === 'waiting' ? (
            <>
              Load video
              <Upload className="w-4 h-4 ml-2"/>
            </>
          ) : statusMessages[status]}
        </Button>
    </form>
  )
}