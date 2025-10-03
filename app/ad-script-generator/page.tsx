
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { generateAdScript } from '@/ai/flows/generate-ad-script-flow';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function AdScriptGeneratorPage() {
  const [prompt, setPrompt] = useState('A 3D animation of the EarnX app on a smartphone, with coins flying out of the screen.');
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateScript = async () => {
    if (!prompt) {
      toast({
        variant: 'destructive',
        title: 'Prompt is empty',
        description: 'Please enter an idea for your ad.',
      });
      return;
    }
    setLoading(true);
    setScript(null);
    try {
      const result = await generateAdScript(prompt);
      if (result && result.adScript) {
        setScript(result.adScript);
        toast({
          title: 'Script Generated!',
          description: 'Your ad script has been created successfully.',
        });
      } else {
        throw new Error('AI failed to return a script.');
      }
    } catch (error: any) {
      console.error('Script generation error:', error);
      toast({
        variant: 'destructive',
        title: 'Script Generation Failed',
        description: error.message || 'Could not generate the script. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
       <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/admin"> Back to Admin Dashboard</Link>
          </Button>
        </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>AI Ad Script Generator</CardTitle>
          <CardDescription>
            Describe the idea for your promotional video. The AI will write a professional script for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              id="prompt"
              placeholder="e.g., A cinematic shot of the EarnX app logo rotating in space"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button onClick={handleGenerateScript} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Generating Script...
              </>
            ) : (
              'Generate Ad Script'
            )}
          </Button>

          {script && (
            <div className="mt-6 border rounded-lg p-4 bg-muted/50">
                <CardTitle className="mb-4 text-xl">Your Generated Ad Script</CardTitle>
                <pre className="whitespace-pre-wrap font-sans text-sm text-foreground">
                    {script}
                </pre>
                <div className="mt-4">
                    <Button variant="secondary" onClick={() => navigator.clipboard.writeText(script)}>
                        Copy Script
                    </Button>
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
