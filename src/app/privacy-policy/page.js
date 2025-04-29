"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Info,
  Database,
  FileText,
  Cookie,
  Share2,
  Lock,
  UserCheck,
  RefreshCw,
  Mail,
  ArrowUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: <Info className="h-5 w-5" />,
    },
    {
      id: "information",
      title: "Information We Collect",
      icon: <Database className="h-5 w-5" />,
    },
    {
      id: "usage",
      title: "How We Use Your Information",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "cookies",
      title: "Cookies and Tracking",
      icon: <Cookie className="h-5 w-5" />,
    },
    {
      id: "sharing",
      title: "Data Sharing",
      icon: <Share2 className="h-5 w-5" />,
    },
    {
      id: "security",
      title: "Data Security",
      icon: <Lock className="h-5 w-5" />,
    },
    {
      id: "rights",
      title: "Your Rights",
      icon: <UserCheck className="h-5 w-5" />,
    },
    {
      id: "changes",
      title: "Policy Changes",
      icon: <RefreshCw className="h-5 w-5" />,
    },
    { id: "contact", title: "Contact Us", icon: <Mail className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-foreground text-text py-16">
        <div className="container  mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="h-10 w-10 text-secondary" />
              <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
            </div>
          </div>
          <p className="text-muted text-lg max-w-2xl">
            We value your privacy and are committed to protecting your personal
            data. This policy explains how we collect, use, and safeguard your
            information.
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

            <section id="introduction" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4  flow-root py-4 flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <Info className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">Introduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text">
                    Welcome to our Privacy Policy. This document explains how we
                    collect, use, and disclose your information when you use our
                    service. We take your privacy seriously and are committed to
                    protecting any personal information you share with us.
                  </p>
                </CardContent>
              </Card>
            </section>

            <section id="information" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4  flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <Database className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">
                    Information We Collect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-text">
                      Personal Information
                    </h3>
                    <p className="text-muted">
                      We may collect personal information that you provide
                      directly to us, such as your name, email address, and any
                      other information you choose to provide when you:
                    </p>
                    <ul className="list-disc ml-6 mt-2 text-muted space-y-1">
                      <li>Create an account or profile</li>
                      <li>Fill out a form or survey</li>
                      <li>Subscribe to our newsletter</li>
                      <li>Contact our support team</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-text">
                      Usage Data
                    </h3>
                    <p className="text-muted">
                      We may also collect information about how you access and
                      use our service, including your IP address, browser type,
                      operating system, referring webpage, pages visited, and
                      the date and time of your visit. This information helps us
                      improve our services and user experience.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="usage" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4  flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <FileText className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">
                    How We Use Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc ml-6 mt-3 text-muted space-y-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>
                      Send you technical notices, updates, security alerts, and
                      support messages
                    </li>
                    <li>Respond to your comments, questions, and requests</li>
                    <li>
                      Monitor and analyze trends, usage, and activities in
                      connection with our service
                    </li>
                    <li>
                      Detect, investigate, and prevent fraudulent transactions
                      and other illegal activities
                    </li>
                    <li>
                      Personalize and improve your experience with our service
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="cookies" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4  flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <Cookie className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">
                    Cookies and Tracking Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted">
                    We use cookies and similar tracking technologies to track
                    activity on our service and hold certain information.
                    Cookies are files with a small amount of data which may
                    include an anonymous unique identifier.
                  </p>
                  <p className="text-muted">Types of cookies we use:</p>
                  <ul className="list-disc ml-6 text-muted space-y-2">
                    <li>
                      <strong className="text-text">Essential cookies:</strong>{" "}
                      Necessary for the website to function properly
                    </li>
                    <li>
                      <strong className="text-text">Preference cookies:</strong>{" "}
                      Enable the website to remember your preferences
                    </li>
                    <li>
                      <strong className="text-text">Analytics cookies:</strong>{" "}
                      Help us understand how visitors interact with our website
                    </li>
                    <li>
                      <strong className="text-text">Marketing cookies:</strong>{" "}
                      Used to track visitors across websites for marketing
                      purposes
                    </li>
                  </ul>
                  <p className="text-muted">
                    You can instruct your browser to refuse all cookies or to
                    indicate when a cookie is being sent. However, if you do not
                    accept cookies, you may not be able to use some portions of
                    our service.
                  </p>
                </CardContent>
              </Card>
            </section>

            <section id="sharing" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4  flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <Share2 className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">
                    Data Sharing and Disclosure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted">
                    We may share your information in the following situations:
                  </p>
                  <ul className="list-disc ml-6 mt-3 text-muted space-y-2">
                    <li>
                      <strong className="text-text">
                        With service providers:
                      </strong>{" "}
                      Who perform services on our behalf, such as hosting, data
                      analysis, payment processing, and customer service
                    </li>
                    <li>
                      <strong className="text-text">For legal reasons:</strong>{" "}
                      To comply with applicable laws and regulations, to respond
                      to a subpoena, search warrant or other lawful request
                    </li>
                    <li>
                      <strong className="text-text">To protect rights:</strong>{" "}
                      To protect and defend our rights and property, including
                      enforcing our terms and policies
                    </li>
                    <li>
                      <strong className="text-text">With your consent:</strong>{" "}
                      When you have given us consent to share your information
                    </li>
                    <li>
                      <strong className="text-text">Business transfers:</strong>{" "}
                      In connection with any merger, sale of company assets,
                      financing, or acquisition of all or a portion of our
                      business
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="security" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4  flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <Lock className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">Data Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted">
                    The security of your data is important to us, but remember
                    that no method of transmission over the Internet or method
                    of electronic storage is 100% secure. While we strive to use
                    commercially acceptable means to protect your personal
                    information, we cannot guarantee its absolute security.
                  </p>
                  <p className="text-muted mt-3">
                    We implement a variety of security measures to maintain the
                    safety of your personal information when you enter, submit,
                    or access your personal information, including:
                  </p>
                  <ul className="list-disc ml-6 mt-2 text-muted space-y-1">
                    <li>
                      Using encryption to protect sensitive information
                      transmitted online
                    </li>
                    <li>
                      Protecting your information offline by keeping servers in
                      a secure environment
                    </li>
                    <li>
                      Regularly reviewing our information collection, storage,
                      and processing practices
                    </li>
                    <li>
                      Restricting access to personal information to employees
                      and contractors who need to know that information
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="rights" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4  flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <UserCheck className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">
                    Your Data Protection Rights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted">
                    Depending on your location, you may have the following
                    rights:
                  </p>
                  <ul className="list-disc ml-6 mt-3 text-muted space-y-2">
                    <li>
                      <strong className="text-text">Right to access:</strong>{" "}
                      You have the right to request copies of your personal data
                    </li>
                    <li>
                      <strong className="text-text">
                        Right to rectification:
                      </strong>{" "}
                      You have the right to request that we correct any
                      information you believe is inaccurate or incomplete
                    </li>
                    <li>
                      <strong className="text-text">Right to erasure:</strong>{" "}
                      You have the right to request that we erase your personal
                      data, under certain conditions
                    </li>
                    <li>
                      <strong className="text-text">
                        Right to restrict processing:
                      </strong>{" "}
                      You have the right to request that we restrict the
                      processing of your personal data, under certain conditions
                    </li>
                    <li>
                      <strong className="text-text">
                        Right to object to processing:
                      </strong>{" "}
                      You have the right to object to our processing of your
                      personal data, under certain conditions
                    </li>
                    <li>
                      <strong className="text-text">
                        Right to data portability:
                      </strong>{" "}
                      You have the right to request that we transfer the data we
                      have collected to another organization, or directly to
                      you, under certain conditions
                    </li>
                  </ul>
                  <p className="text-muted mt-3">
                    If you make a request, we have one month to respond to you.
                    If you would like to exercise any of these rights, please
                    contact us using the information provided in the Contact
                    section.
                  </p>
                </CardContent>
              </Card>
            </section>

            <section id="changes" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4  flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">
                    Changes to This Privacy Policy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted">
                    We may update our Privacy Policy from time to time. We will
                    notify you of any changes by posting the new Privacy Policy
                    on this page and updating the &quot;Last updated&quot; date.
                  </p>
                  <p className="text-muted mt-3">
                    You are advised to review this Privacy Policy periodically
                    for any changes. Changes to this Privacy Policy are
                    effective when they are posted on this page.
                  </p>
                  <p className="text-muted mt-3">
                    If we make material changes to this policy, we will notify
                    you either through the email address you have provided us or
                    by placing a prominent notice on our website.
                  </p>
                </CardContent>
              </Card>
            </section>

            <section id="contact" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4  flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <Mail className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">Contact Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted">
                    If you have any questions about this Privacy Policy, please
                    contact us at:
                  </p>
                  <div className="mt-4 p-4 bg-hover rounded-lg">
                    <p className="text-text">
                      <strong>Email:</strong> sha8alny@sha8alny.com
                    </p>
                    <p className="text-text mt-2">
                      <strong>Address:</strong> 123 sha8alny Street, City,
                      Country
                    </p>
                    <p className="text-text mt-2">
                      <strong>Phone:</strong> +1 (555) 123-4567
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <div className="mt-12 border-t border-hover pt-6 flex justify-between items-center">
              <Link
                href="/"
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
