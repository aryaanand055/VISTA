'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Search, Star, Camera, ThumbsUp, MessageSquare, MapPin } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const placesData = [
  {
    id: 1,
    name: 'Glenary\'s Bakery & Cafe',
    category: 'Cafe & Restaurant',
    rating: 4.6,
    reviewCount: 3800,
    address: 'Nehru Road, Darjeeling',
    images: [
      'https://picsum.photos/seed/glenarys1/800/600',
      'https://picsum.photos/seed/glenarys2/800/600',
      'https://picsum.photos/seed/glenarys3/800/600',
    ],
    reviews: [
      {
        author: 'Rohan',
        avatar: 'https://picsum.photos/seed/person2/48/48',
        rating: 5,
        comment: 'An absolute must-visit in Darjeeling! The bakery items are fresh and delicious. The view from the upstairs restaurant is breathtaking. A bit crowded, but worth it.',
      },
      {
        author: 'Ananya',
        avatar: 'https://picsum.photos/seed/person4/48/48',
        rating: 4,
        comment: 'Great place for breakfast. Their English breakfast is famous for a reason. The service can be a bit slow when it\'s busy.',
      },
    ],
  },
  {
    id: 2,
    name: 'Himalayan Mountaineering Institute',
    category: 'Museum & Institution',
    rating: 4.8,
    reviewCount: 5200,
    address: 'Jawahar Parbat, Darjeeling',
    images: [
        'https://picsum.photos/seed/hmi1/800/600',
        'https://picsum.photos/seed/hmi2/800/600',
    ],
    reviews: [
         {
        author: 'Tenzin',
        avatar: 'https://picsum.photos/seed/person5/48/48',
        rating: 5,
        comment: 'A truly inspiring place. The museum is incredibly well-maintained and provides a fascinating look into the history of mountaineering. The Everest section is a highlight.',
      },
    ]
  }
];

export default function PlacesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(placesData[0]);
  const fileInputRef = useRef&lt;HTMLInputElement>(null);

  const handleSearch = () => {
    if (!searchQuery) {
        setSelectedPlace(placesData[0]);
        return;
    }
    const result = placesData.find(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (result) {
        setSelectedPlace(result);
    } else {
        // Handle case where place is not found
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Column: Search and List */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Search/> Find Places</CardTitle>
            <CardDescription>Search for cafes, attractions, and more.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full items-center space-x-2">
                <Input 
                    type="text" 
                    placeholder="e.g., 'Glenary's', 'Tiger Hill'"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' &amp;&amp; handleSearch()}
                />
                <Button onClick={handleSearch}><Search className="h-4 w-4"/></Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Search Results / List */}
        <div className="space-y-4">
            {placesData.map(place => (
                 <Card 
                    key={place.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedPlace?.id === place.id ? 'border-primary shadow-md' : ''}`}
                    onClick={() => setSelectedPlace(place)}
                >
                    <CardContent className="p-4 flex items-start gap-4">
                        <Image src={place.images[0]} alt={place.name} width={80} height={80} className="rounded-md aspect-square object-cover" />
                        <div className="flex-grow">
                            <p className="font-semibold">{place.name}</p>
                            <p className="text-sm text-muted-foreground">{place.category}</p>
                            <div className="flex items-center gap-1 text-sm mt-1">
                                <Star className="w-4 h-4 text-accent fill-accent"/>
                                <span className="font-bold">{place.rating}</span>
                                <span className="text-muted-foreground">({place.reviewCount})</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>

      {/* Right Column: Place Details */}
      <div className="lg:col-span-2">
        {selectedPlace ? (
            <Card className="h-full">
                <CardHeader>
                    {/* Image Carousel */}
                    <Carousel className="w-full">
                        <CarouselContent>
                            {selectedPlace.images.map((img, index) => (
                                <CarouselItem key={index}>
                                    <div className="relative h-64 w-full">
                                        <Image src={img} alt={`${selectedPlace.name} image ${index + 1}`} fill style={{ objectFit: 'cover' }} className="rounded-lg" />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-4" />
                        <CarouselNext className="right-4" />
                    </Carousel>

                    <div className="pt-4">
                        <CardTitle className="font-headline text-3xl">{selectedPlace.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 pt-1">
                            <MapPin className="h-4 w-4" /> {selectedPlace.address}
                        </CardDescription>
                         <div className="flex items-center gap-1 text-lg mt-2">
                            <Star className="w-5 h-5 text-accent fill-accent"/>
                            <span className="font-bold">{selectedPlace.rating}</span>
                            <span className="text-muted-foreground">({selectedPlace.reviewCount} reviews)</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Write a review section */}
                    <div className="space-y-3 rounded-lg border bg-background/50 p-4">
                        <h3 className="font-semibold">Leave your feedback</h3>
                        <div className="flex items-center gap-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-6 w-6 text-gray-300 cursor-pointer hover:text-accent" />
                            ))}
                        </div>
                        <Textarea placeholder={`What did you think of ${selectedPlace.name}?`} />
                         <div className="flex justify-between items-center">
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                                <Camera className="mr-2 h-4 w-4" /> Add Photos
                            </Button>
                             <Input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" />
                            <Button>Submit Review</Button>
                         </div>
                    </div>
                    
                    {/* Reviews List */}
                     <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Reviews</h3>
                        {selectedPlace.reviews.map((review, index) => (
                            <div key={index} className="flex gap-4 border-t pt-4">
                                <Avatar>
                                    <AvatarImage src={review.avatar} alt={review.author} />
                                    <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold">{review.author}</p>
                                        <div className="flex items-center">
                                            {[...Array(review.rating)].map((_, i) => (
                                                 <Star key={i} className="w-4 h-4 text-accent fill-accent"/>
                                            ))}
                                             {[...Array(5 - review.rating)].map((_, i) => (
                                                 <Star key={i} className="w-4 h-4 text-gray-300"/>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="mt-1 text-muted-foreground">{review.comment}</p>
                                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                                        <button className="flex items-center gap-1.5 hover:text-primary"><ThumbsUp size={14} /> Helpful</button>
                                        <button className="flex items-center gap-1.5 hover:text-primary"><MessageSquare size={14} /> Comment</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        ) : (
            <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Select a place to see details</p>
            </div>
        )}
      </div>
    </div>
  );
}
