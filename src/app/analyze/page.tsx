
'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { useActionState } from 'react';
import {
  UploadCloud,
  Leaf,
  Loader2,
  AlertCircle,
  X,
  Bot,
  Info,
  CheckCircle2,
  HeartPulse,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { detectDisease } from '@/app/actions';
import type { FormState, AnalysisResult } from '@/lib/types';
import { Logo } from '@/components/icons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { WaveBackground } from '@/components/WaveBackground';

const initialState: FormState = {
  success: false,
};

function Header() {
  return (
    <header className="py-4 px-4 md:px-8 flex items-center justify-between z-10 relative">
      <Link href="/" className="flex items-center gap-4">
        <Logo />
        <div>
          <h1 className="text-2xl font-bold font-headline text-primary">CropSafe AI</h1>
          <p className="text-muted-foreground">Leaf Analysis Tool</p>
        </div>
      </Link>
    </header>
  );
}

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending} className="w-full" size="lg">
      {isPending ? <Loader2 className="animate-spin mr-2" /> : <Leaf className="mr-2" />}
      {isPending ? 'Analyzing...' : 'Analyze Leaf'}
    </Button>
  );
}

function MarkdownContent({ content }: { content: string }) {
  const htmlContent = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.*$)/gm, '<li class="mb-1">$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

  return <div className="prose prose-sm max-w-none prose-invert" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}

function ResultDisplay({
  result,
  onReset,
}: {
  result: AnalysisResult;
  onReset: () => void;
}) {
  const isHealthy = result.disease === 'Healthy';
  const confidenceBadgeVariant = result.confidence > 0.8 ? 'default' : result.confidence > 0.5 ? 'secondary' : 'destructive';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Card className="overflow-hidden bg-card/80 backdrop-blur-sm">
        <div className="relative w-full aspect-video">
          {result.imageUrl && <Image src={result.imageUrl} alt={result.disease} fill style={{ objectFit: 'cover' }} />}
        </div>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {isHealthy ? <HeartPulse className="text-primary" /> : <AlertCircle className="text-destructive" />}
              {result.disease.replace(/_/g, ' ')}
            </span>
            <Badge variant={confidenceBadgeVariant} className="text-sm">
              {(result.confidence * 100).toFixed(1)}% Confidence
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isHealthy ? (
              <Alert variant="default" className="bg-primary/10">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">Plant is Healthy</AlertTitle>              
                <AlertDescription>
                  No disease detected. Keep up the great work in maintaining your crop's health!
                </AlertDescription>
              </Alert>
          ) : (
            <Accordion type="single" collapsible defaultValue="treatment" className="w-full">
              {result.treatment && (
                <AccordionItem value="treatment">
                  <AccordionTrigger className="text-lg font-headline">
                    <Bot className="mr-2 text-accent" /> AI Treatment Guidance
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                     <MarkdownContent content={result.treatment} />
                  </AccordionContent>
                </AccordionItem>
              )}
              {result.info && (
                <AccordionItem value="info">
                  <AccordionTrigger className="text-lg font-headline">
                    <Info className="mr-2 text-accent" /> Disease Information
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p>{result.info.description}</p>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Symptoms</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {result.info.symptoms.map((symptom, i) => <li key={i}>{symptom}</li>)}
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-1">Cause</h4>
                      <p className="text-muted-foreground">{result.info.cause}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          )}
        </CardContent>
      </Card>
      <Button onClick={onReset} variant="outline" className="w-full">
        Analyze Another Leaf
      </Button>
    </motion.div>
  );
}

function ImageUploadForm({
  formAction,
  isPending,
  formError
}: {
  formAction: (payload: FormData) => void;
  isPending: boolean;
  formError: string | undefined;
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4">
          {imagePreview ? (
            <div className="relative group w-full aspect-video rounded-md overflow-hidden">
              <Image
                src={imagePreview}
                alt="Selected leaf"
                fill
                style={{ objectFit: 'contain' }}
              />
              <Button
                variant="destructive"
                size="icon"
                type="button"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleRemoveImage}
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-card/80 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, or JPEG (Max 5MB)
                </p>
              </div>
            </label>
          )}
        </CardContent>
      </Card>

      <input
        id="image-upload"
        name="image"
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/jpg"
        ref={fileInputRef}
        onChange={handleImageChange}
      />
      
      <div>
        <SubmitButton isPending={isPending} />
      </div>

      {formError && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Analysis Error</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}


export default function AnalyzePage() {
  const [formState, formAction, isPending] = useActionState(detectDisease, initialState);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    if (formState.success) {
      setShowForm(false);
    }
  }, [formState.success]);

  const handleReset = () => {
    setShowForm(true);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-green-50 relative overflow-hidden">
      <WaveBackground />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl z-10 relative">
        {showForm ? (
          <ImageUploadForm 
            formAction={formAction}
            isPending={isPending}
            formError={formState.error}
          />
        ) : formState.result ? (
          <ResultDisplay result={formState.result} onReset={handleReset} />
        ) : null}
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground z-10 relative">
        © {new Date().getFullYear()} CropSafe AI. All rights reserved.
      </footer>
    </div>
  );
}
