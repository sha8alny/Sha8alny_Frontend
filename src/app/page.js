"use client";
import Head from "next/head";
import Navbar from "@/app/components/layout/NavBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-white">
      <Head>
        <title>Shaغalny - Job Search Platform</title>
      </Head>

      {/* Navbar */}
      <div className="sticky top-0 z-50">
        <header>
          <Navbar />
        </header>
      </div>
    </div>
  );
}
