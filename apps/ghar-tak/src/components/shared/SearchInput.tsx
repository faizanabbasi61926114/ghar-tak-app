import { useRef, useState, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { Search, Camera, Loader2, Upload, Clock, X } from 'lucide-react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { analyzeImageForSearch } from '@/ai/flows/analyze-image-flow';
import { useUser } from '@clerk/react';

const RECENT_SEARCHES_KEY = 'ghar-tak:recent-searches';
const MAX_RECENT_SEARCHES = 6;

function readRecentSearches(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function writeRecentSearches(searches: string[]) {
  try {
    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  } catch {
    // Storage can be unavailable (private mode); recents are a nice-to-have.
  }
}

function saveRecentSearch(query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed) return readRecentSearches();
  const next = [trimmed, ...readRecentSearches().filter((item) => item.toLowerCase() !== trimmed.toLowerCase())]
    .slice(0, MAX_RECENT_SEARCHES);
  writeRecentSearches(next);
  return next;
}

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
  const inputRef = useRef<HTMLInputElement>(null);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => readRecentSearches());
  const [isRecentOpen, setIsRecentOpen] = useState(false);

  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [selectedImageDataUri, setSelectedImageDataUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setRecentSearches(saveRecentSearch(trimmed));
    setQuery(trimmed);
    setIsRecentOpen(false);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    runSearch(query);
  };

  const handleInputFocus = () => {
    const stored = readRecentSearches();
    setRecentSearches(stored);
    setIsRecentOpen(stored.length > 0);
  };

  const removeRecentSearch = (value: string) => {
    const next = readRecentSearches().filter((item) => item !== value);
    writeRecentSearches(next);
    setRecentSearches(next);
    if (next.length === 0) setIsRecentOpen(false);
  };

  const clearRecentSearches = () => {
    writeRecentSearches([]);
    setRecentSearches([]);
    setIsRecentOpen(false);
  };

  const filteredSearches = query.trim()
    ? recentSearches.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase()))
    : recentSearches;

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
        runSearch(result.searchQuery);
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
        <Popover open={isRecentOpen} onOpenChange={setIsRecentOpen}>
          <PopoverAnchor asChild>
            <div className="relative flex-grow min-w-0">
              <Input
                ref={inputRef}
                type="search"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleInputFocus}
                className="w-full h-11 text-base"
                autoComplete="off"
              />
            </div>
          </PopoverAnchor>
          <PopoverContent
            align="start"
            sideOffset={6}
            className="w-[var(--radix-popover-trigger-width)] min-w-[280px] p-2"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (inputRef.current?.contains(e.target as Node)) e.preventDefault();
            }}
          >
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Recent searches</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={clearRecentSearches}
              >
                Clear all
              </Button>
            </div>
            {filteredSearches.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">No recent searches match "{query.trim()}".</p>
            ) : (
              <div className="space-y-0.5">
                {filteredSearches.map((item) => (
                  <div key={item} className="flex items-center gap-1 rounded-lg transition-colors hover:bg-primary/10">
                    <button
                      type="button"
                      onClick={() => runSearch(item)}
                      className="flex flex-1 min-w-0 items-center gap-2 px-2 py-2 text-left text-sm"
                    >
                      <Clock className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <span className="truncate">{item}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeRecentSearch(item)}
                      aria-label={`Remove ${item} from recent searches`}
                      className="mr-1 flex-shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </PopoverContent>
        </Popover>
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
