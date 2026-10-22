import { useState, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Camera, Loader2, Upload } from 'lucide-react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { analyzeImageForSearch } from '@/ai/flows/analyze-image-flow';
import { useUser } from '@clerk/react';

interface SearchInputProps {
  initialQuery?: string;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({ 
  initialQuery = '', 
  placeholder = "Search for anything...",
  className 
}: SearchInputProps) {
  const [query, setQuery] = useState(initialQuery);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useUser();

  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [selectedImageDataUri, setSelectedImageDataUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleImageSearchClick = () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Sign in to search by image with AI.',
      });
      navigate('/sign-in');
      return;
    }
    setIsImageSearchOpen(true);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // Example: 4MB limit
        toast({
          variant: "destructive",
          title: "Image Too Large",
          description: "Please select an image smaller than 4MB.",
        });
        setSelectedImagePreview(null);
        setSelectedImageDataUri(null);
        if (event.target) event.target.value = ""; // Clear the input
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

  const handleAnalyzeAndSearch = async () => {
    if (!selectedImageDataUri) {
      toast({
        variant: "destructive",
        title: "No Image Selected",
        description: "Please upload an image to analyze.",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeImageForSearch({ imageDataUri: selectedImageDataUri });
      if (result.searchQuery && result.searchQuery.trim() !== "") {
        navigate(`/search?q=${encodeURIComponent(result.searchQuery.trim())}`);
        setIsImageSearchOpen(false);
        setSelectedImagePreview(null);
        setSelectedImageDataUri(null);
      } else {
        toast({
          variant: "default",
          title: "Image Analysis Inconclusive",
          description: "Could not identify specific items in the image. Please try a different image or a text search.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred during image analysis. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSearch} className={`flex w-full items-center space-x-2 ${className}`}>
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow h-11 text-base"
        />
        <Button type="button" variant="outline" size="icon" onClick={handleImageSearchClick} className="h-11 w-11 flex-shrink-0">
          <Camera className="h-5 w-5" />
          <span className="sr-only">Search by image</span>
        </Button>
        <Button type="submit" size="lg" className="h-11">
          <Search className="h-5 w-5 mr-2" />
          Search
        </Button>
      </form>

      <Dialog open={isImageSearchOpen} onOpenChange={(isOpen) => {
        setIsImageSearchOpen(isOpen);
        if (!isOpen) {
          setSelectedImagePreview(null);
          setSelectedImageDataUri(null);
        }
      }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center"><Camera className="mr-2 h-5 w-5 text-primary" />Search by Image</DialogTitle>
            <DialogDescription>
              Upload an image to find similar products or services.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input 
              id="imageUpload" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {selectedImagePreview && (
              <div className="mt-4 border rounded-md p-2 flex justify-center items-center max-h-[250px] overflow-hidden">
                <img 
                  src={selectedImagePreview} 
                  alt="Selected preview" 
                  width={200} 
                  height={200} 
                  className="object-contain max-h-[230px] w-auto rounded-md"
                />
              </div>
            )}
            {!selectedImagePreview && (
              <div className="mt-4 border border-dashed rounded-md p-8 flex flex-col justify-center items-center h-[150px] text-muted-foreground">
                <Upload className="h-10 w-10 mb-2" />
                <p>Image preview will appear here.</p>
                <p className="text-xs mt-1">Max file size: 4MB</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsImageSearchOpen(false);
                setSelectedImagePreview(null);
                setSelectedImageDataUri(null);
              }}
              disabled={isAnalyzing}
            >
              Cancel
            </Button>
            <Button onClick={handleAnalyzeAndSearch} disabled={!selectedImageDataUri || isAnalyzing}>
              {isAnalyzing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Analyze and Search
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
