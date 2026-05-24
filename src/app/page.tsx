import { Hero } from "@/components/sections/hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, LifeBuoy, Users, Music } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    title: "Healing Tools",
    description: "Engage with interactive tools to calm your mind and build resilience.",
    icon: <BookOpen className="h-8 w-8 text-accent" />,
    href: "/tools"
  },
  {
    title: "Sonic Sanctuary",
    description: "Tune into frequencies and sounds designed to calm your mind and aid focus.",
    icon: <Music className="h-8 w-8 text-accent" />,
    href: "/music"
  },
  {
    title: "Resource Hub",
    description: "Find curated articles, videos, and professional help resources.",
    icon: <LifeBuoy className="h-8 w-8 text-accent" />,
    href: "/resources"
  },
  {
    title: "Community",
    description: "Share your thoughts anonymously and find strength in shared experiences.",
    icon: <Users className="h-8 w-8 text-accent" />,
    href: "/community"
  }
]

export default function Home() {
  return (
    <>
      <Hero />
      <section className="container py-12 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">A Safe Space to Heal and Grow</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            PeaceMind is more than just an app; it's a companion for your mental wellness journey. Explore our different spaces, each designed with your peace in mind.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {sections.map(section => (
            <Card key={section.title} className="flex flex-col text-center items-center">
              <CardHeader>
                {section.icon}
                <CardTitle className="mt-4">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-muted-foreground flex-1">{section.description}</p>
                <Button asChild className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href={section.href}>Explore</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
