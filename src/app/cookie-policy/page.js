"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Cookie,
  Info,
  Settings,
  Shield,
  ExternalLink,
  Clock,
  RefreshCw,
  Mail,
  ArrowUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/Table";

export default function CookiePolicy() {
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
      id: "what-are-cookies",
      title: "What Are Cookies",
      icon: <Cookie className="h-5 w-5" />,
    },
    {
      id: "types-of-cookies",
      title: "Types of Cookies",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      id: "how-we-use",
      title: "How We Use Cookies",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      id: "third-party",
      title: "Third-Party Cookies",
      icon: <ExternalLink className="h-5 w-5" />,
    },
    {
      id: "cookie-duration",
      title: "Cookie Duration",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      id: "managing-cookies",
      title: "Managing Cookies",
      icon: <Settings className="h-5 w-5" />,
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
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Cookie className="h-10 w-10 text-secondary" />
              <h1 className="text-4xl md:text-5xl font-bold">Cookie Policy</h1>
            </div>
          </div>
          <p className="text-muted text-lg max-w-2xl">
            This Cookie Policy explains how we use cookies and similar
            technologies to recognize you when you visit our website. It
            explains what these technologies are and why we use them.
          </p>
        </div>
      </div>

      <div className="container  mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <div className="md:sticky md:top-20">
              <Card className="bg-foreground border-none py-4 flow-root">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-text">Contents</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
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
              <Card className="bg-foreground border-none py-4 flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <Info className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">Introduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text">
                    This Cookie Policy explains how we use cookies and similar
                    tracking technologies on our website. This policy is
                    designed to help you understand what cookies are, why we use
                    them, and the types of cookies we use.
                  </p>
                  <p className="text-muted mt-3">
                    By continuing to use our site, you are agreeing to our use
                    of cookies as described in this Cookie Policy. If you do not
                    agree to our use of cookies, you should set your browser
                    settings accordingly or not use our website.
                  </p>
                </CardContent>
              </Card>
            </section>

            <section id="what-are-cookies" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4 flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <Cookie className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">What Are Cookies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted">
                    Cookies are small text files that are stored on your
                    computer or mobile device when you visit a website. They are
                    widely used to make websites work more efficiently and
                    provide information to the owners of the site.
                  </p>
                  <p className="text-muted mt-3">
                    Cookies allow a website to recognize your device and
                    remember if you&apos;ve been to the website before. Cookies
                    can be used to collect, store, and share data about your
                    activities across websites, including on our website.
                  </p>
                  <p className="text-muted mt-3">
                    Cookies also allow us to remember your user preferences,
                    helping to customize your experience on our site. They can
                    also help ensure that advertisements you see online are more
                    relevant to you and your interests.
                  </p>
                </CardContent>
              </Card>
            </section>

            <section id="types-of-cookies" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4 flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <Settings className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">
                    Types of Cookies We Use
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted">
                    We use different types of cookies for various reasons. Here
                    are the main categories of cookies we use:
                  </p>

                  <div className="mt-4 space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2 text-text flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary" />
                        Essential Cookies
                      </h3>
                      <p className="text-muted">
                        These cookies are necessary for the website to function
                        properly. They enable basic functions like page
                        navigation, secure areas access, and other essential
                        features. The website cannot function properly without
                        these cookies.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2 text-text flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary" />
                        Preference Cookies
                      </h3>
                      <p className="text-muted">
                        These cookies allow the website to remember choices you
                        make (such as your username, language, or the region you
                        are in) and provide enhanced, more personal features.
                        They can also be used to remember changes you have made
                        to text size, fonts, and other customizable parts of web
                        pages.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2 text-text flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary" />
                        Analytics Cookies
                      </h3>
                      <p className="text-muted">
                        These cookies help us understand how visitors interact
                        with our website by collecting and reporting information
                        anonymously. They help us improve the way our website
                        works, for example, by ensuring that users are finding
                        what they are looking for easily.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2 text-text flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary" />
                        Marketing Cookies
                      </h3>
                      <p className="text-muted">
                        These cookies are used to track visitors across
                        websites. The intention is to display ads that are
                        relevant and engaging for the individual user and
                        thereby more valuable for publishers and third-party
                        advertisers.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="how-we-use" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4 flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <Shield className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">
                    How We Use Cookies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted">
                    We use cookies for several reasons, including to:
                  </p>
                  <ul className="list-disc ml-6 mt-3 text-muted space-y-2">
                    <li>Make our website work as you would expect</li>
                    <li>Remember your settings during and between visits</li>
                    <li>Improve the speed/security of the site</li>
                    <li>
                      Allow you to share pages with social networks like
                      Facebook
                    </li>
                    <li>Continuously improve our website for you</li>
                    <li>Make our marketing more efficient</li>
                  </ul>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3 text-text">
                      Specific Uses
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-text">Purpose</TableHead>
                          <TableHead className="text-text">
                            Description
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium text-text">
                            Authentication
                          </TableCell>
                          <TableCell className="text-muted">
                            We use cookies to identify you when you visit our
                            website and as you navigate our site.
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-text">
                            Security
                          </TableCell>
                          <TableCell className="text-muted">
                            We use cookies as an element of the security
                            measures to protect our website and services.
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-text">
                            Personalization
                          </TableCell>
                          <TableCell className="text-muted">
                            We use cookies to store information about your
                            preferences and to personalize the website for you.
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-text">
                            Analysis
                          </TableCell>
                          <TableCell className="text-muted">
                            We use cookies to analyze the use and performance of
                            our website and services.
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="third-party" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4 flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">
                    Third-Party Cookies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted">
                    In addition to our own cookies, we may also use various
                    third-party cookies to report usage statistics of the
                    website, deliver advertisements on and through the website,
                    and so on.
                  </p>

                  <div className="mt-4 space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2 text-text">
                        Common Third-Party Services We Use
                      </h3>
                      <ul className="list-disc ml-6 text-muted space-y-2">
                        <li>
                          <strong className="text-text">
                            Google Analytics:
                          </strong>{" "}
                          Web analytics service that tracks and reports website
                          traffic
                        </li>
                        <li>
                          <strong className="text-text">Google Ads:</strong>{" "}
                          Online advertising platform developed by Google
                        </li>
                        <li>
                          <strong className="text-text">Facebook Pixel:</strong>{" "}
                          Analytics tool that allows us to measure the
                          effectiveness of our advertising
                        </li>
                        <li>
                          <strong className="text-text">Hotjar:</strong>{" "}
                          Behavior analytics and user feedback service
                        </li>
                        <li>
                          <strong className="text-text">Intercom:</strong>{" "}
                          Customer messaging platform
                        </li>
                      </ul>
                    </div>

                    <p className="text-muted">
                      Each of these third-party services has its own privacy
                      policy and methods to opt-out of their cookies. We
                      encourage you to check their websites for more
                      information.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="cookie-duration" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4 flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <Clock className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">Cookie Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted">
                    Cookies can remain on your computer or mobile device for
                    different periods of time. Some cookies are session cookies,
                    which means they only exist when your browser is open and
                    are automatically deleted when you close your browser. Other
                    cookies are persistent cookies, meaning they survive after
                    your browser is closed and can be used by websites to
                    recognize your computer when you reopen your browser later.
                  </p>

                  <div className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-text">Type</TableHead>
                          <TableHead className="text-text">Duration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium text-text">
                            Session Cookies
                          </TableCell>
                          <TableCell className="text-muted">
                            These cookies are temporary and expire once you
                            close your browser
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-text">
                            Persistent Cookies (Short-term)
                          </TableCell>
                          <TableCell className="text-muted">
                            These cookies remain on your device for up to 1
                            month
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-text">
                            Persistent Cookies (Medium-term)
                          </TableCell>
                          <TableCell className="text-muted">
                            These cookies remain on your device for up to 12
                            months
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-text">
                            Persistent Cookies (Long-term)
                          </TableCell>
                          <TableCell className="text-muted">
                            These cookies remain on your device for up to 24
                            months
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="managing-cookies" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4 flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <Settings className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">Managing Cookies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted">
                    Most browsers allow you to refuse to accept cookies and to
                    delete them. The methods for doing so vary from browser to
                    browser, and from version to version. You can obtain
                    up-to-date information about blocking and deleting cookies
                    via the support pages of your browser:
                  </p>

                  <ul className="list-disc ml-6 mt-3 text-muted space-y-2">
                    <li>
                      <strong className="text-text">Chrome:</strong>{" "}
                      <a
                        href="https://support.google.com/chrome/answer/95647"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary hover:underline"
                      >
                        Block and manage cookies in Chrome
                      </a>
                    </li>
                    <li>
                      <strong className="text-text">Firefox:</strong>{" "}
                      <a
                        href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary hover:underline"
                      >
                        Enhanced Tracking Protection in Firefox
                      </a>
                    </li>
                    <li>
                      <strong className="text-text">Safari:</strong>{" "}
                      <a
                        href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary hover:underline"
                      >
                        Manage cookies and website data in Safari
                      </a>
                    </li>
                    <li>
                      <strong className="text-text">Edge:</strong>{" "}
                      <a
                        href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary hover:underline"
                      >
                        Delete cookies in Microsoft Edge
                      </a>
                    </li>
                  </ul>

                  <div className="mt-6 p-4 bg-hover rounded-lg">
                    <h3 className="text-lg font-medium mb-2 text-text flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-secondary" />
                      Blocking All Cookies Will Have a Negative Impact
                    </h3>
                    <p className="text-muted">
                      If you block all cookies, many websites, including ours,
                      will not work properly. For this reason, we recommend that
                      you do not block all cookies. Instead, you can adjust your
                      browser settings to reject specific types of cookies that
                      you do not want.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="changes" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4 flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">
                    Changes to This Cookie Policy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted">
                    We may update our Cookie Policy from time to time. We will
                    notify you of any changes by posting the new Cookie Policy
                    on this page and updating the &quot;Last updated&quot; date.
                  </p>
                  <p className="text-muted mt-3">
                    You are advised to review this Cookie Policy periodically
                    for any changes. Changes to this Cookie Policy are effective
                    when they are posted on this page.
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
              <div className="flex gap-4">
                <Link
                  href="/"
                  className="text-secondary hover:underline flex items-center gap-2"
                >
                  ← Back to Home
                </Link>
                <Link
                  href="/privacy-policy"
                  className="text-secondary hover:underline"
                >
                  Privacy Policy
                </Link>
              </div>
              <p className="text-sm text-muted">
                © {new Date().getFullYear()} Your Company. All rights reserved.
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
