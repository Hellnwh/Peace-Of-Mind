"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function TermsPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <section className="container py-12 md:py-24">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Last updated: {lastUpdated}</p>
          <p>
            Please read these terms and conditions carefully before using Our Service.
          </p>
          <h3 className="text-xl font-semibold text-foreground pt-4">Acknowledgment</h3>
          <p>
            These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service. Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions.
          </p>
          <h3 className="text-xl font-semibold text-foreground pt-4">User Accounts</h3>
          <p>
            When You create an account with Us, You must provide Us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of Your account on our Service. You are responsible for safeguarding the password that You use to access the Service and for any activities or actions under Your password.
          </p>
           <h3 className="text-xl font-semibold text-foreground pt-4">User Content</h3>
          <p>
            Our Service may allow You to post Content. You are responsible for the Content that You post to the Service, including its legality, reliability, and appropriateness. By posting Content to the Service, You grant Us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service, while maintaining the anonymity promised in our Privacy Policy.
          </p>
          <h3 className="text-xl font-semibold text-foreground pt-4">Intellectual Property</h3>
          <p>
            The Service and its original content (excluding Content provided by You or other users), features and functionality are and will remain the exclusive property of the Company and its licensors.
          </p>
           <h3 className="text-xl font-semibold text-foreground pt-4">Termination</h3>
            <p>
                We may terminate or suspend Your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions. Upon termination, Your right to use the Service will cease immediately.
            </p>
            <h3 className="text-xl font-semibold text-foreground pt-4">Changes to These Terms and Conditions</h3>
            <p>
                We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at Our sole discretion.
            </p>
        </CardContent>
      </Card>
    </section>
  );
}
