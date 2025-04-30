"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/app/components/ui/Button";
import { Card, CardContent } from "@/app/components/ui/Card";
import { Separator } from "@/app/components/ui/Separator";
import Image from "next/image";
import { useTheme } from "../context/ThemeContext";

export default function TermsPage() {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 w-full ">
        <section className="w-full mx-auto py-12 md:py-16 lg:py-20 bg-foreground">
          <div className="w-full px-4 md:px-6">
            <div className="w-full space-y-4 text-center">
              <h1 className="text-3xl w-full font-bold tracking-tighter sm:text-4xl md:text-5xl text-text">
                Terms of Service
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Last Updated: April 30, {currentYear}
              </p>
            </div>
          </div>
        </section>

        <section className="w-full mx-auto py-12 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto grid max-w-4xl gap-8">
              <Card className="bg-foreground border-none overflow-hidden">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-text">
                      Table of Contents
                    </h2>
                    <ul className="grid gap-1 text-muted-foreground">
                      <li>
                        <Link
                          href="#acceptance"
                          className="hover:text-secondary flex items-center"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4 text-secondary" />
                          <span>1. Acceptance of Terms</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#accounts"
                          className="hover:text-secondary flex items-center"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4 text-secondary" />
                          <span>2. User Accounts</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#conduct"
                          className="hover:text-secondary flex items-center"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4 text-secondary" />
                          <span>3. User Conduct</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#content"
                          className="hover:text-secondary flex items-center"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4 text-secondary" />
                          <span>4. Content Ownership</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#privacy"
                          className="hover:text-secondary flex items-center"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4 text-secondary" />
                          <span>5. Privacy Policy</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#termination"
                          className="hover:text-secondary flex items-center"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4 text-secondary" />
                          <span>6. Termination</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#liability"
                          className="hover:text-secondary flex items-center"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4 text-secondary" />
                          <span>7. Limitation of Liability</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#law"
                          className="hover:text-secondary flex items-center"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4 text-secondary" />
                          <span>8. Governing Law</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#changes"
                          className="hover:text-secondary flex items-center"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4 text-secondary" />
                          <span>9. Changes to Terms</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#contact"
                          className="hover:text-secondary flex items-center"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4 text-secondary" />
                          <span>10. Contact Information</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-10 text-text">
                <section id="acceptance" className="scroll-mt-16">
                  <h2 className="text-2xl font-bold mb-4">
                    1. Acceptance of Terms
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Welcome to Shaغalny. By accessing or using our platform,
                      you agree to be bound by these Terms of Service ("Terms"),
                      our Privacy Policy, and any other policies referenced
                      herein. If you do not agree to these Terms, please do not
                      use our services.
                    </p>
                    <p>
                      Shaغalny provides a professional networking platform that
                      connects job seekers, professionals, and employers across
                      the Middle East and North Africa region. These Terms
                      govern your access to and use of Shaغalny's website,
                      mobile applications, and services (collectively, the
                      "Services").
                    </p>
                    <p>
                      By creating an account, you represent that you are at
                      least 18 years of age and are legally able to enter into a
                      binding contract. If you are accessing the Services on
                      behalf of a company or other legal entity, you represent
                      that you have the authority to bind such entity to these
                      Terms.
                    </p>
                  </div>
                </section>

                <Separator className="bg-border" />

                <section id="accounts" className="scroll-mt-16">
                  <h2 className="text-2xl font-bold mb-4">2. User Accounts</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      <strong className="text-text">Registration:</strong> To
                      access certain features of our Services, you must register
                      for an account. You agree to provide accurate, current,
                      and complete information during the registration process
                      and to update such information to keep it accurate,
                      current, and complete.
                    </p>
                    <p>
                      <strong className="text-text">Account Security:</strong>{" "}
                      You are responsible for safeguarding your password and for
                      all activities that occur under your account. You agree to
                      notify Shaغalny immediately of any unauthorized use of
                      your account or any other breach of security.
                    </p>
                    <p>
                      <strong className="text-text">
                        Profile Information:
                      </strong>{" "}
                      You agree that the information you provide in your profile
                      will be truthful and accurate. Misrepresentation of your
                      identity, qualifications, or affiliations may result in
                      termination of your account.
                    </p>
                    <p>
                      <strong className="text-text">
                        Professional Information:
                      </strong>{" "}
                      When you add professional experience, education, or other
                      credentials to your profile, you agree that this
                      information is accurate and that you have the right to
                      share it.
                    </p>
                  </div>
                </section>

                <Separator className="bg-border" />

                <section id="conduct" className="scroll-mt-16">
                  <h2 className="text-2xl font-bold mb-4">3. User Conduct</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      When using our Services, you agree not to engage in any of
                      the following prohibited activities:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Violate any applicable laws, regulations, or third-party
                        rights, including intellectual property and privacy
                        rights.
                      </li>
                      <li>
                        Use the Services to transmit any content that is
                        unlawful, harmful, threatening, abusive, harassing,
                        defamatory, vulgar, obscene, or otherwise objectionable.
                      </li>
                      <li>
                        Impersonate any person or entity, or falsely state or
                        otherwise misrepresent your affiliation with a person or
                        entity.
                      </li>
                      <li>
                        Engage in any activity that could disable, overburden,
                        or impair the proper functioning of the Services, such
                        as a denial-of-service attack.
                      </li>
                      <li>
                        Collect or harvest any information from the Services,
                        including user profiles and contact information, for any
                        unauthorized purpose.
                      </li>
                      <li>
                        Use automated means, including spiders, robots,
                        crawlers, or data mining tools, to download data from
                        the Services.
                      </li>
                      <li>
                        Post false, inaccurate, misleading, deceptive, or
                        offensive content, including job listings or
                        professional qualifications.
                      </li>
                      <li>
                        Use the Services for any commercial purpose not
                        expressly authorized by Shaغalny, including unauthorized
                        recruitment activities or data scraping.
                      </li>
                    </ul>
                  </div>
                </section>

                <Separator className="bg-border" />

                <section id="content" className="scroll-mt-16">
                  <h2 className="text-2xl font-bold mb-4">
                    4. Content Ownership
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      <strong className="text-text">Your Content:</strong> You
                      retain ownership of any content you post, upload, share,
                      store, or otherwise provide through the Services ("User
                      Content"). By posting User Content, you grant Shaغalny a
                      worldwide, non-exclusive, royalty-free license to use,
                      copy, modify, distribute, publish, and process that User
                      Content for the purpose of providing and improving the
                      Services.
                    </p>
                    <p>
                      <strong className="text-text">Shaغalny Content:</strong>{" "}
                      The Services contain content owned or licensed by Shaغalny
                      ("Shaغalny Content"). Shaغalny Content is protected by
                      copyright, trademark, patent, trade secret, and other
                      laws, and Shaغalny owns and retains all rights in the
                      Shaغalny Content and the Services.
                    </p>
                    <p>
                      <strong className="text-text">Feedback:</strong> If you
                      provide feedback or suggestions about our Services, we may
                      use this information without any obligation to you.
                    </p>
                    <p>
                      <strong className="text-text">
                        Reporting Violations:
                      </strong>{" "}
                      If you believe that your intellectual property rights have
                      been violated, please contact us with information
                      regarding the alleged violation.
                    </p>
                  </div>
                </section>

                <Separator className="bg-border" />

                <section id="privacy" className="scroll-mt-16">
                  <h2 className="text-2xl font-bold mb-4">5. Privacy Policy</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Your privacy is important to us. Our Privacy Policy, which
                      is incorporated into these Terms by reference, explains
                      how we collect, use, and disclose information about you,
                      including personal information. By using the Services, you
                      consent to the collection, use, and disclosure of your
                      information as described in our Privacy Policy.
                    </p>
                    <p>
                      We may update our Privacy Policy from time to time. We
                      will notify you of any changes by posting the new Privacy
                      Policy on this page and updating the "Last Updated" date.
                    </p>
                    <p>
                      <Link
                        href="/privacy-policy"
                        className="text-secondary hover:underline"
                      >
                        View our Privacy Policy
                      </Link>
                    </p>
                  </div>
                </section>

                <Separator className="bg-border" />

                <section id="termination" className="scroll-mt-16">
                  <h2 className="text-2xl font-bold mb-4">6. Termination</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      <strong className="text-text">By You:</strong> You may
                      terminate your account at any time by following the
                      instructions on the Services or by contacting us.
                    </p>
                    <p>
                      <strong className="text-text">By Shaغalny:</strong> We may
                      terminate or suspend your account or access to all or part
                      of the Services at any time, with or without cause, with
                      or without notice, effective immediately. Causes for
                      termination may include, but are not limited to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Violations of these Terms or any other policies
                        referenced herein
                      </li>
                      <li>
                        Requests by law enforcement or other government agencies
                      </li>
                      <li>
                        Discontinuance or material modification of the Services
                      </li>
                      <li>Unexpected technical or security issues</li>
                      <li>Extended periods of inactivity</li>
                    </ul>
                    <p>
                      <strong className="text-text">
                        Effect of Termination:
                      </strong>{" "}
                      Upon termination, your right to use the Services will
                      immediately cease. All provisions of these Terms that by
                      their nature should survive termination shall survive,
                      including ownership provisions, warranty disclaimers,
                      indemnity, and limitations of liability.
                    </p>
                  </div>
                </section>

                <Separator className="bg-border" />

                <section id="liability" className="scroll-mt-16">
                  <h2 className="text-2xl font-bold mb-4">
                    7. Limitation of Liability
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      <strong className="text-text">
                        Disclaimer of Warranties:
                      </strong>{" "}
                      THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE"
                      WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED,
                      INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF
                      MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
                      NON-INFRINGEMENT.
                    </p>
                    <p>
                      <strong className="text-text">
                        Limitation of Liability:
                      </strong>{" "}
                      TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW,
                      SHAغALNY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                      SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS
                      OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR
                      INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER
                      INTANGIBLE LOSSES, RESULTING FROM:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Your access to or use of or inability to access or use
                        the Services
                      </li>
                      <li>
                        Any conduct or content of any third party on the
                        Services
                      </li>
                      <li>
                        Any content obtained from the Services or any
                        unauthorized access, use, or alteration of your
                        transmissions or content
                      </li>
                    </ul>
                    <p>
                      In no event shall Shaغalny's aggregate liability for all
                      claims related to the Services exceed the greater of one
                      hundred dollars ($100) or the amount you paid to Shaغalny,
                      if any, in the past twelve months.
                    </p>
                  </div>
                </section>

                <Separator className="bg-border" />

                <section id="law" className="scroll-mt-16">
                  <h2 className="text-2xl font-bold mb-4">8. Governing Law</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      These Terms shall be governed by and construed in
                      accordance with the laws of [Jurisdiction], without regard
                      to its conflict of law provisions.
                    </p>
                    <p>
                      Any dispute arising from or relating to these Terms or the
                      Services shall be resolved exclusively in the courts of
                      [Jurisdiction]. You consent to the personal jurisdiction
                      of such courts and waive any objection to proceedings in
                      such courts.
                    </p>
                    <p>
                      Any claim or cause of action arising out of or related to
                      the Services or these Terms must be filed within one year
                      after such claim or cause of action arose, or be forever
                      barred.
                    </p>
                  </div>
                </section>

                <Separator className="bg-border" />

                <section id="changes" className="scroll-mt-16">
                  <h2 className="text-2xl font-bold mb-4">
                    9. Changes to Terms
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      We may modify these Terms from time to time. If we make
                      changes, we will provide notice by posting the updated
                      Terms on the Services and updating the "Last Updated" date
                      at the top of these Terms.
                    </p>
                    <p>
                      Your continued use of the Services after the effective
                      date of the revised Terms constitutes your acceptance of
                      the changes. If you do not agree to the new Terms, you
                      should stop using the Services and delete your account.
                    </p>
                    <p>
                      For material changes to these Terms, we will make
                      reasonable efforts to provide more prominent notice, such
                      as sending an email to the address associated with your
                      account or displaying a prominent notice within the
                      Services.
                    </p>
                  </div>
                </section>

                <Separator className="bg-border" />

                <section id="contact" className="scroll-mt-16">
                  <h2 className="text-2xl font-bold mb-4">
                    10. Contact Information
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      If you have any questions, concerns, or feedback regarding
                      these Terms or the Services, please contact us at:
                    </p>
                    <div className="bg-hover p-4 rounded-lg">
                      <p>Shaغalny, Inc.</p>
                      <p>Email: legal@sha8alny.com</p>
                      <p>Address: 123 Tech Hub, Cairo, Egypt</p>
                      <p>Phone: +20 2 1234 5678</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 bg-foreground">
          <div className="container flex gap-2 items-center justify-center mx-auto px-4 md:px-6">
            <Link href="/">
              <Image
                src={theme === "dark" ? "/darkmode.svg" : "/lightmode.svg"}
                alt="Shaغalny Logo"
                width={500}
                height={300}
                className="hover:scale-125 duration-300 ease-in-out cursor-pointer"
              />
            </Link>
            <div className="max-w-4xl space-y-4 text-center">
              <h2 className="text-2xl font-bold text-text">
                Ready to Join Shaغalny?
              </h2>
              <p className="text-muted-foreground">
                By creating an account, you agree to our Terms of Service and
                Privacy Policy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  className="bg-secondary text-white hover:bg-secondary/90"
                  asChild
                >
                  <Link href="/signup">
                    Create Your Profile <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-secondary text-secondary hover:bg-hover"
                  asChild
                >
                  <Link href="/about">Learn More About Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
