import { FileVideo, Github, Upload, Wand2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Slider } from "./components/ui/slider";

export function App() {

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">upload.ai</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Developed in nlw - rocketseat</span>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="outline">
            <Github className="w-4 h-4 mr-2"/>
            Github
          </Button>
        </div>
      </div>

      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Include the AI prompt"
            />
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="AI-generated result"
              readOnly
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Remember: you can use the <code className="text-emerald-400">{'{transcription}'}</code> variable in your prompt to add the selected video transcription content
          </p>
        </div>
        <aside className="w-80 space-y-6">
          <form className="space-y-6">
            <label htmlFor="video" className="border flex rounded-sm aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-zinc-400/5">
              <FileVideo className="w-4 h-4"/>
              Select one video
            </label>

            <input type="file" id="video" accept="video/mp4" className="sr-only" />

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="transcription-prompt">Transcription prompt</Label>
              <Textarea
                id="transcription-prompt"
                className="h-20 leading-relaxed resize-none"
                placeholder="Include the key words mentioned on the video separated by comma (,)"
              />
            </div>

            <Button type="submit" className="w-full">
              Load video
              <Upload className="w-4 h-4 ml-2"/>
            </Button>
          </form>

          <Separator/>

          <form action="space-y-6">
            <div className="space-y-2">
              <Label>Prompt</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select one prompt..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Youtube title</SelectItem>
                  <SelectItem value="description">Youtube description</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>

          <form action="space-y-6">
            <div className="space-y-2">
              <Label>Model</Label>
              <Select disabled defaultValue="gpt-3.5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">
                You will be able to customize this soon
              </span>
            </div>
          </form>

          <Separator />

          <div className="space-y-4">
            <Label>Temperature</Label>
            <Slider
              min={0}
              max={1}
              step={.1}
            />
            <span className="block text-xs text-muted-foreground italic leading-relaxed">
              Higher values tend to leave the results more creative and possible with errors
            </span>
          </div>

          <Separator />

          <Button type="submit" className="w-full">
            Execute
            <Wand2 className="w-4 h-4 ml-2"/>
          </Button>
        </aside>
      </main>
    </div>
  )
}
