"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Info,
  FileText,
  Globe,
  Link as LinkIcon,
  PencilLine,
  BadgeCheck,
  ArrowUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const username = searchParams.get("username");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");

      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      let currentSection = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
          currentSection = section.getAttribute("id") || "";
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 20,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

   let backHref = "/company/setup";
   if (from === "create") backHref = "/company/setup";
   else if (from === "edit" && username) backHref = `/company/${username}/admin/edit`;

  const sections = [
    {
      id: "primary",
      title: "Primary & Secondary URLs",
      icon: <LinkIcon className="h-5 w-5" />,
    },
    {
      id: "editingRules",
      title: "Editing Rules",
      icon: <PencilLine className="h-5 w-5" />,
    },
    {
        id: "bestPractices",
        title: "Best Practices",
        icon: <BadgeCheck className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-foreground text-text py-16">
        <div className="container  mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Globe className="h-10 w-10 text-secondary" />
              <h1 className="text-4xl md:text-5xl font-bold">Shaغalny Page Public URL</h1>
            </div>
          </div>
          <p className="text-muted text-lg max-w-2xl">
            Understanding how Shaغalny Page URLs work and how to manage them effectively.
          </p>
        </div>
      </div>

      <div className="container  mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <div className="md:sticky md:top-20">
              <Card className="bg-foreground border-none py-4  flow-root flow-root">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-text">Contents</CardTitle>
                </CardHeader>
                <CardContent className="">
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-2 text-sm py-1.5 px-2 rounded-md transition-colors ${
                          activeSection === section.id
                            ? "bg-secondary/20 text-secondary font-medium"
                            : "hover:bg-hover text-text"
                        }`}
                      >
                        {section.icon}
                        <span className="text-left">{section.title}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="md:col-span-9 space-y-10">
            <p className="text-muted">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section id="primary" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4  flow-root py-4 flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">Primary & Secondary URLs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-text">
                    When you create a Shaغalny Page as an admin, you'll create a primary URL.
                  </p>
                  <ul className="list-disc ml-6 text-muted space-y-2">
                    <li>
                      <strong className="text-text">Primary URL: </strong>{" "}
                        Visible to all members of your Page
                    </li>
                    <li>
                      <strong className="text-text">Secondary URL: </strong>{" "}
                        A unique identification number that only admins can see
                    </li>
                  </ul>
                  <p className="text-text">
                    Every Shaغalny Page and Showcase Page is assigned both a primary and secondary URL. Both URLs can be used to direct traffic to your Page.
                  </p>
                </CardContent>
              </Card>
            </section>

            <section id="editingRules" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4  flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <PencilLine className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text"> Editing Rules </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text"> After Changing Your URL </p>
                  <ul className="list-disc ml-6 mt-3 text-muted space-y-2">
                        <li> It may take a few weeks for search engines to direct traffic to the new Page URL </li>
                        <li> Both the old and new Page URL will direct to your LinkedIn Page </li>
                        <li> If another admin requests your old Page URL, it can be reassigned to their Page </li>
                        <li> Once reassigned, the old URL will no longer redirect to your Page </li>
                  </ul>
                </CardContent>
              </Card>
            </section>


            <section id="bestPractices" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4  flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text"> Best Practices </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text"> When Choosing Your Page URL: </p>
                  <ul className="list-disc ml-6 mt-3 text-muted space-y-2">
                    <li> Page URLs are subject to availability </li>
                    <li> If eligible, first update your company name, then match the proposed URL as closely as possible </li>
                    <li> Avoid ambiguity by not using acronyms that could match another company name </li>
                    <li> If you'd like to repurpose your LinkedIn Page URL to another one of your LinkedIn Pages, contact LinkedIn Support </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <div className="mt-12 border-t border-hover pt-6 flex justify-between items-center">
              <Link
                href={backHref}
                className="text-secondary hover:underline flex items-center gap-2"
              >
                ← Back to Home
              </Link>
              <p className="text-sm text-muted">
                © {new Date().getFullYear()} Sha8alny. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-secondary text-text rounded-full shadow-lg hover:opacity-90 transition-all"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
