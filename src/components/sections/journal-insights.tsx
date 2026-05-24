"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

interface StickyNote {
    id: string;
    content: string;
    createdAt: { seconds: number, nanoseconds: number } | any; // Firestore timestamp
}

interface JournalInsightsProps {
    data: StickyNote[] | null;
    isLoading: boolean;
}

export function JournalInsights({ data, isLoading }: JournalInsightsProps) {

    return (
        <Card>
            <CardHeader>
                <CardTitle>Journal Insights</CardTitle>
                <CardDescription>A look at your recent thoughts.</CardDescription>
            </CardHeader>
            <CardContent>
                 {isLoading ? (
                     <div className="h-[250px] w-full flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">Loading notes...</p>
                    </div>
                 ) : !data || data.length === 0 ? (
                    <div className="h-[250px] w-full flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No journal entries yet. Try the Journal tool!</p>
                    </div>
                ) : (
                    <ScrollArea className="h-[250px] w-full">
                        <div className="space-y-4 pr-4">
                            {data.map(note => (
                                <div key={note.id} className="p-3 bg-secondary rounded-lg">
                                    <p className="text-sm text-secondary-foreground line-clamp-3">{note.content}</p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {note.createdAt?.seconds 
                                            ? formatDistanceToNow(new Date(note.createdAt.seconds * 1000), { addSuffix: true }) 
                                            : 'Just now'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    )
}
