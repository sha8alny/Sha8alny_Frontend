"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building, Globe, Users } from "lucide-react";

import { Button } from "@/app/components/ui/Button";
import { Card, CardContent } from "@/app/components/ui/Card";
import { Separator } from "@/app/components/ui/Separator";
import { useTheme } from "next-themes";

export default function AboutPage() {
  const { theme } = useTheme();
  const isDarkMode =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-foreground">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl text-text">
                  About Shaغalny
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Connecting professionals across the Middle East and beyond.
                  Shaغalny is where careers are built, opportunities are
                  discovered, and professional networks thrive.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    className="bg-secondary text-background font-bold hover:bg-secondary/90"
                    asChild
                  >
                    <Link href="/signup">
                      Join Our Network <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src={
                  isDarkMode
                    ? "/darkmode.svg"
                    : "/lightmode.svg"
                }
                alt="Logo"
                width={600}
                height={400}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl gap-8">
              <div className="space-y-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-text">
                  Our Story
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Founded in 2018, Shaغalny was born from a simple idea: to
                  create a platform that bridges the gap between talent and
                  opportunity in the Middle East and North Africa region.
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                <Card className="bg-foreground border-none">
                  <CardContent className="p-6 space-y-4">
                    <Building className="h-12 w-12 text-secondary" />
                    <h3 className="text-xl font-bold text-text">Our Mission</h3>
                    <p className="text-muted-foreground">
                      To empower professionals to build meaningful careers and
                      help organizations find the talent they need to thrive in
                      a rapidly evolving economy.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-foreground border-none">
                  <CardContent className="p-6 space-y-4">
                    <Globe className="h-12 w-12 text-secondary" />
                    <h3 className="text-xl font-bold text-text">Our Vision</h3>
                    <p className="text-muted-foreground">
                      To become the premier professional network in the MENA
                      region, connecting talent with opportunity across borders
                      and industries.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-foreground border-none">
                  <CardContent className="p-6 space-y-4">
                    <Users className="h-12 w-12 text-secondary" />
                    <h3 className="text-xl font-bold text-text">Our Values</h3>
                    <p className="text-muted-foreground">
                      Integrity, innovation, inclusivity, and impact guide
                      everything we do as we build a platform that serves
                      professionals at every stage of their career.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Separator className="bg-border" />

        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5 dark:bg-primary/10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl gap-8">
              <div className="space-y-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-text">
                  Our Impact
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Since our launch, Shaغalny has made a significant impact on
                  the professional landscape of the region.
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="flex flex-col items-center space-y-2 text-center">
                  <div className="text-4xl font-bold text-secondary">5M+</div>
                  <p className="text-muted-foreground">
                    Registered Professionals
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 text-center">
                  <div className="text-4xl font-bold text-secondary">50K+</div>
                  <p className="text-muted-foreground">Companies</p>
                </div>
                <div className="flex flex-col items-center space-y-2 text-center">
                  <div className="text-4xl font-bold text-secondary">12</div>
                  <p className="text-muted-foreground">Countries</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl gap-8">
              <div className="space-y-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-text">
                  Leadership Team
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Meet the passionate individuals driving Shaغalny's mission
                  forward.
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="bg-foreground p-1 rounded-full">
                    <Image
                      src="/nada.jpg"
                      alt="Nada Abdullah"
                      width={200}
                      height={200}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text">
                      Nada Abdullah
                    </h3>
                    <p className="text-secondary">Developer</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    developed things here
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="bg-foreground p-1 rounded-full">
                    <Image
                      src="/ease.jpg"
                      alt="Ezz ElDin Selim"
                      width={200}
                      height={200}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text">
                      Ezz ElDin Selim
                    </h3>
                    <p className="text-secondary">Developer</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    developed things here
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="bg-foreground p-1 rounded-full">
                    <Image
                      src="/hussein.jpg"
                      alt="Hussein Essam"
                      width={200}
                      height={200}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text">
                      Hussein Essam
                    </h3>
                    <p className="text-secondary">Team Leader</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    developed things here
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="bg-foreground p-1 rounded-full">
                    <Image
                      src="/zhfman.jpg"
                      alt="Ziad Hesham"
                      width={200}
                      height={200}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text">Ziad Hesham</h3>
                    <p className="text-secondary">Developer</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Designed and implemented the user profile with all its
                    features and functionalities. Also designed and implemented
                    the news feed.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="bg-foreground p-1 rounded-full">
                    <Image
                      src="/salsabil.jpg"
                      alt="Salsabil Mostafa"
                      width={200}
                      height={200}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text">
                      Salsabil Mostafa
                    </h3>
                    <p className="text-secondary">Developer</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    developed things here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator className="bg-border" />

        <section className="w-full py-12 md:py-24 lg:py-32 bg-foreground">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl gap-8">
              <div className="space-y-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-text">
                  Join the Shaغalny Community
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Whether you're looking for your next career opportunity or
                  seeking to build your professional network, Shaغalny is here
                  to help you succeed.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row justify-center">
                <Button
                  size="lg"
                  className="bg-secondary text-white hover:bg-secondary/90"
                  asChild
                >
                  <Link href="/register">
                    Create Your Profile <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-secondary text-secondary hover:bg-hover"
                  asChild
                >
                  <Link href="/employers">For Employers</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
