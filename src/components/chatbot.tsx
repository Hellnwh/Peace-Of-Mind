"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Bot } from "lucide-react";
import { getChatResponse, checkDistress } from "@/app/actions";
import { EmergencyModal } from "./emergency-modal";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, addDocumentNonBlocking, useDoc, useMemoFirebase } from "@/firebase";
import { collection, serverTimestamp, doc } from "firebase/firestore";

interface Message {
    sender: "user" | "bot";
    text: string;
}

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: "bot", text: "Hello! I am your Sanctuary Guide. How can I help you find peace today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEmergency, setIsEmergency] = useState(false);
    const { user } = useUser();
    const db = useFirestore();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const profileRef = useMemoFirebase(() => 
        user && db ? doc(db, "users", user.uid) : null
    , [user, db]);
    const { data: profile } = useDoc(profileRef);

    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollElement = scrollAreaRef.current.querySelector("div");
            if (scrollElement) {
                scrollElement.scrollTo({ top: scrollElement.scrollHeight, behavior: 'smooth' });
            }
        }
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === "" || isLoading) return;

        const userText = input;
        const userMessage: Message = { sender: "user", text: userText };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const { isSevereDistress, diversionMessage } = await checkDistress(userText);
            
            if (isSevereDistress) {
                setIsEmergency(true);
                
                if (user && db) {
                    const alertRef = collection(db, "distressAlerts");
                    addDocumentNonBlocking(alertRef, {
                        userId: user.uid,
                        userPhone: profile?.phoneNumber || 'Not provided',
                        triggerContent: userText,
                        status: 'pending',
                        timestamp: serverTimestamp()
                    });
                }

                const responseText = diversionMessage || "I'm here for you. Let's get you some immediate help.";
                setMessages(prev => [...prev, { sender: "bot", text: responseText }]);
                setIsLoading(false);
                return;
            }

            const { response } = await getChatResponse(userText);
            const botMessage: Message = { sender: "bot", text: response };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: "bot", text: "I'm resting momentarily. Please try again soon." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-lg"
                        size="icon"
                        aria-label="Open Guide"
                    >
                        <Bot className="h-8 w-8" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent side="top" align="end" className="w-[80vw] max-w-sm p-0">
                    <div className="flex h-[60vh] flex-col">
                        <div className="p-4 border-b">
                            <h3 className="font-semibold text-center">Sanctuary Guide</h3>
                        </div>
                        <ScrollArea className="flex-1" ref={scrollAreaRef}>
                            <div className="space-y-4 p-4">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.sender === 'bot' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                                        <div className={`max-w-[80%] rounded-lg px-3 py-2 ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                            <p className="text-sm">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex items-end gap-2 justify-start">
                                        <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                                        <div className="max-w-[80%] rounded-lg px-3 py-2 bg-muted">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                        <div className="p-4 border-t">
                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask the guide..."
                                />
                                <Button type="submit" size="icon" disabled={isLoading} aria-label="Send">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            <EmergencyModal open={isEmergency} onOpenChange={setIsEmergency} />
        </>
    );
}
