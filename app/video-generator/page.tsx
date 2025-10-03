
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader, VideoIcon } from 'lucide-react';
import { generateVideo } from '@/ai/flows/generate-video-flow';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function VideoGeneratorPage() {
  const [prompt, setPrompt] = useState('A 3D animation of the EarnX app on a smartphone, with coins flying out of the screen.');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateVideo = async () => {
    if (!prompt) {
      toast({
        variant: 'destructive',
        title: 'Prompt is empty',
        description: 'Please enter an idea for your video.',
      });
      return;
    }
    setLoading(true);
    setVideoUrl(null);
    try {
      const result = await generateVideo(prompt);
      if (result && result.videoUrl) {
        setVideoUrl(result.videoUrl);
        toast({
          title: 'Video Generated!',
          description: 'Your promotional video has been created successfully.',
        });
      } else {
        throw new Error('AI failed to return a video.');
      }
    } catch (error: any) {
      console.error('Video generation error:', error);
      toast({
        variant: 'destructive',
        title: 'Video Generation Failed',
        description: error.message || 'Could not generate the video. Please check if billing is enabled and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/admin">Back to Admin Dashboard</Link>
        </Button>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <VideoIcon />
            AI Video Generator
          </CardTitle>
          <CardDescription>
            Describe the idea for your promotional video. The AI will generate a short video for you. (Requires GCP Billing)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              id="prompt"
              placeholder="e.g., A cinematic shot of the EarnX app logo rotating in space"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>
          <Button onClick={handleGenerateVideo} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Generating Video (can take 1-2 mins)...
              </>
            ) : (
              'Generate Video'
            )}
          </Button>

          {videoUrl && (
            <div className="mt-6 border rounded-lg p-4 bg-muted/50">
              <CardTitle className="mb-4 text-xl">Your Generated Video</CardTitle>
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="mt-4">
                <Button variant="secondary" asChild>
                  <a href={videoUrl} download="earnx-promo.mp4">
                    Download Video
                  </a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
