"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Info,
  FileText,
  UserCheck,
  Mail,
  ArrowUp,
  AlertCircle,
  XCircle,
  CheckCircle
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";

export default function UserAgreement() {
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
      id: "obligations",
      title: "Obligations",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
        id: "rights",
        title: "Rights and Limits",
        icon: <UserCheck className="h-5 w-5" />,
    },
    {
      id: "disclaimer",
      title: "Disclaimer and Limit of Liability",
      icon: <AlertCircle className="h-5 w-5" />,
    },
    {
      id: "termination",
      title: "Termination",
      icon: <XCircle className="h-5 w-5" />,
    },
    {
      id: "generalTerms",
      title: "General Terms",
      icon: <FileText className="h-5 w-5" />,
    },
    { id: "contact", title: "Contact Us", icon: <Mail className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-foreground text-text py-16">
        <div className="container  mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="h-10 w-10 text-secondary" />
              <h1 className="text-4xl md:text-5xl font-bold">User Agreement</h1>
            </div>
          </div>
          <p className="text-muted text-lg max-w-2xl">
          This agreement governs your access to our professional network, where meaningful connections are built on trust and mutual respect. By joining our community, you agree to these terms that protect all members' interests.
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
                  Our mission is to connect the world’s professionals to allow them to be more productive and successful. Our services are designed to promote economic opportunity for our members by enabling you and millions of other professionals to meet, exchange ideas, learn, and find opportunities or employees, work, and make decisions in a network of trusted relationships.
                  </p>
                </CardContent>
              </Card>
            </section>

            <section id="obligations" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4  flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">
                    Obligations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                <ul className="list-disc ml-6 text-muted space-y-2">
                    <li>
                      <strong className="text-text">Service Eligibility: </strong>{" "}
                      Users must be at least 16 years old (or older if required by local laws) to create an account. Each member must use their real name and maintain only one account. Fake accounts or those created for others violate Shaغalny's terms.
                    </li>
                    <li>
                      <strong className="text-text">Account Responsibilities: </strong>{" "}
                      Members must keep passwords confidential and not share accounts. While accounts belong to individuals, employers who pay for services (e.g., Recruiter seats) may access usage data but not personal account details.
                    </li>
                    <li>
                      <strong className="text-text">Payment Terms: </strong>{" "}
                      Paid services require timely payments, including applicable taxes. Shaغalny may store payment methods for renewals, with automatic charges for subscriptions. Prices and refunds follow Shaغalny's policies.
                    </li>
                    <li>
                      <strong className="text-text">Notices: </strong>{" "}
                      Shaغalny delivers notices via the platform or provided contact details. Users must keep contact information updated to avoid missing important messages.
                    </li>
                    <li>
                      <strong className="text-text">Sharings: </strong>{" "}
                      Shared content (posts, profiles, job applications) may be visible to others based on privacy settings. Shaغalny can remove content without notice and defaults to privacy for job searches.
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
                    Rights and Limits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc ml-6 mt-3 text-muted space-y-2">
                    <li> <strong className="text-text">Content License:</strong>{" "}
                     You keep content ownership but allow Shaغalny to use it globally. License terminates upon deletion (except shared copies). Ads may appear near content. You set visibility and verify compliance. Public posts may spread externally.
                    </li>
                    <li> <strong className="text-text">Service Availability: </strong>{" "} 
                        Shaغalny can change or remove services/features anytime. Your content isn't permanently stored. 
                    </li>
                    <li> <strong className="text-text">Other Content/Sites/Apps:</strong>{" "}
                        Not responsible for member-posted content/jobs/events. Marketplace requires age 18+. Use at your own risk.
                    </li>
                    <li> <strong className="text-text">Limits:</strong>{" "}
                        Shaغalny may restrict accounts or remove content for policy violations.
                    </li>
                    <li> <strong className="text-text">Intellectual Property:</strong>{" "}
                        All Shaغalny trademarks, logos, and service features remain the company's exclusive property. Third-party trademarks displayed belong to their respective owners.
                    </li>
                    <li> <strong className="text-text">Automated Processing:</strong>{" "}
                        Shaغalny uses your data to personalize recommendations (jobs, connections, content)
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="disclaimer" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4  flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">
                    Disclaimer and Limit of Liability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted">
                  Our services are provided "as-is" without warranties of functionality, accuracy, or uninterrupted access. Liability is limited as follows:
                  </p>
                  <ul className="list-disc ml-6 text-muted space-y-2">
                    <li>
                      <strong className="text-text">No Warranties</strong>{" "}
                      We provide our services 'as is' with no guarantees of uninterrupted access, accuracy, or fitness for any purpose.
                    </li>
                    <li>
                      <strong className="text-text">Liability Limitations</strong>{" "}
                      Excluded damages include lost profits, reputational harm, data loss, and consequential damages.
                    </li>
                    <li>
                      <strong className="text-text">Exceptions</strong>{" "}
                      These liability limitations shall not apply in cases involving death or personal injury, fraudulent or intentional misconduct, gross negligence, or material breaches of core contractual obligations.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="termination" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4  flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <XCircle className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">
                    Termination
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted">
                  Both you and Shaغalny may terminate this Contract at any time with notice to the other. Upon termination:
                  </p>
                  <ul className="list-disc ml-6 mt-3 text-muted space-y-2">
                    <li>
                      Your right to access and use our services will immediately cease
                    </li>
                    <li>
                      We may retain or delete your content in accordance with our data retention policies
                    </li>
                    <li>
                      All provisions regarding data protection, intellectual property, and liability limitations shall survive termination
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="generalTerms" className="scroll-mt-20">
              <Card className="bg-foreground border-none py-4  flow-root">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <FileText className="h-5 w-5 text-secondary" />
                  <CardTitle className="text-text">General Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted">
                    This Contract constitutes the entire agreement between you and Shaغany, superseding all prior agreements. If any provision is deemed unenforceable, the remaining terms remain valid. Shaغany's failure to enforce any term doesn't constitute waiver. You cannot transfer your rights under this agreement without Shaغany's consent, while Shaغany may assign the Contract freely. All legal notices must be sent to Shaغany's designated address. There are no third-party beneficiaries to this agreement.
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
                    If you have any questions about this User Agreement, please
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
