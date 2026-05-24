"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function PrivacyPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
      setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <section className="container py-12 md:py-24">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Last updated: {lastUpdated}</p>
          <p>
            Your privacy is important to us. It is PeaceMind Sanctuary's policy to respect your privacy regarding any information we may collect from you across our website.
          </p>
          <h3 className="text-xl font-semibold text-foreground pt-4">1. Information We Collect</h3>
          <p>
            <strong>Account Information:</strong> When you create an account, we may collect personal information such as your name and email address. This information is used to create and manage your account, and to personalize your experience.
          </p>
          <p>
            <strong>User-Generated Content:</strong> Features like the Anonymous Journal and Mood Tracker allow you to store personal data. For journal entries, we utilize your browser's local storage, meaning this sensitive data never leaves your device and we do not have access to it. For features that require cloud storage, like mood history and community posts, your data is associated with your anonymous user ID and stored securely in our database.
          </p>
          <h3 className="text-xl font-semibold text-foreground pt-4">2. Use of Data</h3>
          <p>
            We use the information we collect to provide, maintain, and improve our services. Your data allows us to offer personalized features like mood tracking and analysis on your private profile. We only retain collected information for as long as necessary to provide you with your requested service. What data we do store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
          </p>
          <h3 className="text-xl font-semibold text-foreground pt-4">3. Anonymity and Data Security</h3>
          <p>
            Features like the Community Forum are designed to be anonymous. While your posts are linked to your user ID for moderation purposes, your public-facing identity is anonymized. We are committed to ensuring your data is protected and use services like Firebase Authentication and Firestore Security Rules to enforce strict data access controls.
          </p>
           <h3 className="text-xl font-semibold text-foreground pt-4">4. Third-Party Services</h3>
          <p>
            Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
          </p>
          <p>
            Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
