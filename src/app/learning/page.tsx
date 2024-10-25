"use client";

import {BookOpen, FileText, Newspaper, Twitter, Video} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

import {Button} from "@/components/ui/button";
import Image from "next/image";
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {useState} from "react";

const contentData = [
    {
        type: "article",
        title: "Understanding Kenya's Electoral System",
        description: "A comprehensive guide to how elections work in Kenya.",
        author: "John Doe",
        date: "2023-06-15",
        readTime: "10 min read",
        image: "/images/iebc.jpg",
    },
    {
        type: "video",
        title: "Effective Campaign Strategies for Local Elections",
        description: "Learn from successful politicians about grassroots campaigning.",
        author: "Jane Smith",
        date: "2023-06-10",
        duration: "15:30",
        image: "/images/iebc.jpg?height=100&width=200",
    },
    {
        type: "news",
        title: "New Legislation Impacts Campaign Finance",
        description:
            "Recent changes in law affect how political campaigns can be funded.",
        source: "Kenya Politics Today",
        date: "2023-06-20",
        readTime: "5 min read",
    },
    {
        type: "guide",
        title: "Public Speaking for Politicians",
        description: "Improve your oratory skills with these expert tips.",
        author: "Dr. Alice Johnson",
        date: "2023-06-05",
        readTime: "20 min read",
        image: "/images/iebc.jpg?height=100&width=200",
    },
];

const twitterFeed = [
    {
        user: "KenyaPolitics",
        handle: "@KenyaPolitics",
        content:
            "Breaking: New poll shows shifting voter preferences in key counties. #KenyaElections",
        time: "2h ago",
    },
    {
        user: "AfricaAnalyst",
        handle: "@AfricaAnalyst",
        content:
            "Opinion: The role of youth in shaping Kenya's political future. Read our latest analysis:",
        time: "5h ago",
    },
    {
        user: "KenyaElectoralComm",
        handle: "@KenyaElectoralComm",
        content:
            "Reminder: Voter registration deadline approaching. Make sure you're registered to vote!",
        time: "1d ago",
    },
];

export default function LearningZonePage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredContent = contentData.filter(
        (item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Learning Zone</h2>
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Search content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-[300px]"
                    />
                </div>
            </div>
            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="articles">Articles</TabsTrigger>
                    <TabsTrigger value="videos">Videos</TabsTrigger>
                    <TabsTrigger value="news">News</TabsTrigger>
                    <TabsTrigger value="guides">Guides</TabsTrigger>
                </TabsList>
                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3">
                        <TabsContent value="all" className="space-y-4">
                            {filteredContent.map((item, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            {item.type === "article" && (
                                                <BookOpen className="mr-2" />
                                            )}
                                            {item.type === "video" && (
                                                <Video className="mr-2" />
                                            )}
                                            {item.type === "news" && (
                                                <Newspaper className="mr-2" />
                                            )}
                                            {item.type === "guide" && (
                                                <FileText className="mr-2" />
                                            )}
                                            {item.title}
                                        </CardTitle>
                                        <CardDescription>
                                            {item.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {item.image && (
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                width={200}
                                                height={100}
                                                className="rounded-md mb-4"
                                            />
                                        )}
                                        <p className="text-sm text-muted-foreground">
                                            {item.author || item.source} • {item.date} •{" "}
                                            {item.readTime || item.duration}
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button>Read More</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </TabsContent>
                        {/* Repeat TabsContent for articles, videos, news, and guides, filtering content accordingly */}
                    </div>
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Twitter className="mr-2" />
                                Twitter Feed
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                                {twitterFeed.map((tweet, index) => (
                                    <div key={index} className="mb-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="font-bold">
                                                {tweet.user}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {tweet.handle}
                                            </div>
                                        </div>
                                        <p className="mt-1">{tweet.content}</p>
                                        <div className="mt-2 text-sm text-muted-foreground">
                                            {tweet.time}
                                        </div>
                                        {index < twitterFeed.length - 1 && (
                                            <Separator className="my-4" />
                                        )}
                                    </div>
                                ))}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </Tabs>
        </div>
    );
}
