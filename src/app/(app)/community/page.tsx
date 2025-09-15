'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Flame, MessageSquare, Rss, Share2, ThumbsUp } from 'lucide-react';

const threads = {
  discussion: [
    {
      id: 1,
      author: 'Tenzin',
      avatar: 'https://picsum.photos/seed/person5/48/48',
      time: '3 hours ago',
      title: 'Best place for authentic momos?',
      content: 'Hey everyone, just arrived in Darjeeling. My main mission is to find the absolute best, most authentic momos in town. Any recommendations? Not looking for fancy restaurants, more like hidden local spots. Thanks!',
      upvotes: 18,
      comments: 5,
    },
    {
      id: 2,
      author: 'Priya',
      avatar: 'https://picsum.photos/seed/person1/48/48',
      time: '1 day ago',
      title: 'Is the Toy Train worth it?',
      content: 'I\'m considering taking the Darjeeling Himalayan Railway (Toy Train) ride tomorrow. Is the full loop worth the time, or is a shorter ride just as good for the experience? Also, how early should I book tickets?',
      upvotes: 7,
      comments: 12,
    },
  ],
  qa: [
     {
      id: 3,
      author: 'Rohan',
      avatar: 'https://picsum.photos/seed/person2/48/48',
      time: '5 hours ago',
      title: 'Q: How to get to Tiger Hill for sunrise?',
      content: 'What is the best way to get to Tiger Hill for the sunrise view? Should I book a taxi the night before? And how early do I need to leave from the main town area?',
      upvotes: 25,
      comments: 8,
    },
  ],
  recommendations: [
     {
      id: 4,
      author: 'Ananya',
      avatar: 'https://picsum.photos/seed/person4/48/48',
      time: '2 days ago',
      title: 'Rec: Himalayan Java Coffee',
      content: 'If you are a coffee lover, you HAVE to visit Himalayan Java Coffee on Nehru Road. Their coffee is amazing, and the view from their window is just perfect for a lazy afternoon. Highly recommended!',
      upvotes: 32,
      comments: 6,
    },
  ]
};

const urgentAlerts = [
  {
    id: 99,
    author: 'Darjeeling Police',
    avatar: 'https://picsum.photos/seed/police/48/48',
    time: '45 minutes ago',
    title: 'URGENT: Roadblock on Hill Cart Road due to landslide',
    content: 'A minor landslide has occurred on Hill Cart Road near the Batasia Loop. Traffic is being diverted. Tourists are advised to avoid the area and use alternative routes. Cleanup crews are on site. Updates will follow.',
    upvotes: 112,
    comments: 19,
  }
];


export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Darjeeling Travellers Community</h1>
        <p className="text-muted-foreground">Your local hub for discussions, Q&amp;A, and alerts in Darjeeling.</p>
      </header>

      {/* Pinned Urgent Alerts */}
      <Card className="border-destructive bg-destructive/10">
        <CardHeader>
          <div className="flex items-center gap-3">
             <div className="flex-shrink-0 rounded-full bg-destructive/20 p-2">
                <Flame className="h-6 w-6 text-destructive" />
             </div>
             <div>
                <CardTitle>Urgent Alerts &amp; Missing Persons</CardTitle>
                <CardDescription className="text-destructive/80">Important safety information. Pinned automatically.</CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent>
            {urgentAlerts.map(post => (
                <PostCard key={post.id} post={post} isUrgent />
            ))}
        </CardContent>
      </Card>


      {/* Main Threads */}
      <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                 <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src="https://picsum.photos/seed/person1/48/48" alt="Priya"/>
                        <AvatarFallback>P</AvatarFallback>
                    </Avatar>
                    <Textarea placeholder="Create a new post..." className="flex-grow"/>
                 </div>
                <Button>Create Post</Button>
            </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="discussion">
            <TabsList>
              <TabsTrigger value="discussion">
                <MessageSquare className="mr-2 h-4 w-4" /> Discussion
              </TabsTrigger>
              <TabsTrigger value="qa">
                <Rss className="mr-2 h-4 w-4" /> Q&amp;A
              </TabsTrigger>
               <TabsTrigger value="recommendations">
                <ThumbsUp className="mr-2 h-4 w-4" /> Recommendations
              </TabsTrigger>
            </TabsList>
            <TabsContent value="discussion" className="mt-6 space-y-4">
              {threads.discussion.map(post => <PostCard key={post.id} post={post} />)}
            </TabsContent>
            <TabsContent value="qa" className="mt-6 space-y-4">
              {threads.qa.map(post => <PostCard key={post.id} post={post} />)}
            </TabsContent>
             <TabsContent value="recommendations" className="mt-6 space-y-4">
              {threads.recommendations.map(post => <PostCard key={post.id} post={post} />)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function PostCard({ post, isUrgent = false }: { post: any, isUrgent?: boolean }) {
    return (
        <div className={`flex gap-4 rounded-lg border p-4 ${isUrgent ? 'border-destructive/30' : ''}`}>
            <Avatar className="hidden sm:block">
                <AvatarImage src={post.avatar} alt={post.author} />
                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{post.author}</span>
                    <span>·</span>
                    <span>{post.time}</span>
                </div>
                <h3 className="text-lg font-semibold mt-1">{post.title}</h3>
                <p className="mt-2 text-muted-foreground">{post.content}</p>
                <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
                    <button className="flex items-center gap-1.5 hover:text-primary">
                        <ThumbsUp size={16} /> {post.upvotes}
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-primary">
                        <MessageSquare size={16} /> {post.comments}
                    </button>
                     <button className="flex items-center gap-1.5 hover:text-primary">
                        <Share2 size={16} /> Share
                    </button>
                </div>
            </div>
        </div>
    )
}
