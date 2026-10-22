import { useState, type ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Eye, Image as ImageIcon, Loader2, Upload } from 'lucide-react';
import { describeImage } from '@/ai/flows/describe-image-flow';
import { useUser } from '@clerk/react';
import { Link } from 'wouter';

export default function ImageAnalyzerPage() {
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [selectedImageDataUri, setSelectedImageDataUri] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="font-headline flex items-center justify-center">
              <ImageIcon className="mr-2 h-6 w-6 text-primary" /> AI Image Analyzer
            </CardTitle>
            <CardDescription>Sign in to upload an image and get an AI-powered description.</CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setAnalysisResult(null); // Reset result on new image
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: "destructive",
          title: "Image Too Large",
          description: "Please select an image smaller than 4MB.",
        });
        setSelectedImagePreview(null);
        setSelectedImageDataUri(null);
        if (event.target) event.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImagePreview(reader.result as string);
        setSelectedImageDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImagePreview(null);
      setSelectedImageDataUri(null);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImageDataUri) {
      toast({
        variant: "destructive",
        title: "No Image Selected",
        description: "Please upload an image to analyze.",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await describeImage({ imageDataUri: selectedImageDataUri });
      setAnalysisResult(result.description);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An error occurred during image analysis. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <header className="text-center mb-12">
        <Eye className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold font-headline text-primary">Image Analyzer</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Upload an image and let our AI tell you what it sees.
        </p>
      </header>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center"><ImageIcon className="mr-2 h-5 w-5" />Upload Your Image</CardTitle>
          <CardDescription>Select an image from your device to begin analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            id="imageUpload" 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            disabled={isAnalyzing}
          />
          {selectedImagePreview ? (
            <div className="mt-4 border rounded-md p-2 flex justify-center items-center max-h-[300px] overflow-hidden">
              <img 
                src={selectedImagePreview} 
                alt="Selected preview" 
                width={300} 
                height={300} 
                className="object-contain max-h-[280px] w-auto rounded-md"
              />
            </div>
          ) : (
            <div className="mt-4 border border-dashed rounded-md p-8 flex flex-col justify-center items-center h-[200px] text-muted-foreground">
              <Upload className="h-10 w-10 mb-2" />
              <p>Image preview will appear here.</p>
              <p className="text-xs mt-1">Max file size: 4MB</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col items-stretch space-y-4">
          <Button onClick={handleAnalyzeImage} disabled={!selectedImageDataUri || isAnalyzing} className="w-full text-lg py-6">
            {isAnalyzing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Eye className="mr-2 h-5 w-5" />
            )}
            Analyze Image
          </Button>
          {analysisResult && (
             <div className="space-y-2 pt-4">
                <h3 className="text-lg font-semibold font-headline">Analysis Result:</h3>
                <Textarea 
                  value={analysisResult} 
                  readOnly 
                  rows={5}
                  className="bg-muted/50"
                />
             </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
