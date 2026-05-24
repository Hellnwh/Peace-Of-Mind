"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser, addDocumentNonBlocking, useCollection, useMemoFirebase, useFirestore } from "@/firebase";
import { collection, query, orderBy, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const emojiAvatars = ["😊", "🌟", "💖", "✨", "🙏", "❤️", "🌿", "🌙"];

interface CommunityPost {
    id: string;
    content: string;
    userId: string;
    createdAt: any;
    likes: number;
    replies: number;
}

export function CommunityForum() {
  const { user, isUserLoading } = useUser();
  const [newPost, setNewPost] = useState("");
  const { toast } = useToast();
  const db = useFirestore();

  const postsQuery = useMemoFirebase(() => 
    db ? query(collection(db, "communityPosts"), orderBy("createdAt", "desc")) : null, 
  [db]);

  const { data: posts, isLoading: postsLoading } = useCollection<CommunityPost>(postsQuery);

  const handleSubmit = () => {
      if (newPost.trim() === "" || !user) return;
      
      const newPostData = {
          content: newPost,
          userId: user.uid,
          createdAt: serverTimestamp(),
          likes: 0,
          replies: 0,
      };

      const postsCollection = collection(db, "communityPosts");
      addDocumentNonBlocking(postsCollection, newPostData);
      setNewPost("");
      toast({ title: "Shared!", description: "Your thought has been shared with the community." });
  };

  return (
    <section id="community" className="container py-12 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Share Your Light</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          You are not alone. Share your anonymous thoughts and find strength in community.
        </p>
      </div>
      <div className="mx-auto mt-12 max-w-2xl">
        <Card className="mb-8 shadow-lg">
            <CardHeader>
                <CardTitle>Leave a thought</CardTitle>
                <CardDescription>Posts are public, anonymous, and will be reviewed. Be kind.</CardDescription>
            </CardHeader>
            <CardContent>
                {isUserLoading ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                    </div>
                ) : user ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <Textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="Share something on your mind..."
                            className="mb-4"
                        />
                        <Button type="submit" className="w-full">Share Anonymously</Button>
                    </form>
                ) : (
                    <div className="text-center p-6 bg-secondary rounded-md">
                        <p className="text-muted-foreground mb-4">Please log in to share your thoughts with the community.</p>
                        <Button asChild>
                            <Link href="/login">Login or Sign Up</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>

        <div className="space-y-4">
            {postsLoading && (
                 <div className="flex justify-center items-center p-10">
                    <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                </div>
            )}
            {posts && posts.map((post, index) => (
                <Card key={post.id} className="transition-all hover:shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                            <Avatar>
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                    {emojiAvatars[index % emojiAvatars.length]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="text-foreground">{post.content}</p>
                                <div className="mt-4 flex items-center gap-6 text-muted-foreground">
                                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                                        <ThumbsUp className="h-4 w-4" /> {post.likes}
                                    </button>
                                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                                        <MessageCircle className="h-4 w-4" /> {post.replies}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </section>
  );
}
