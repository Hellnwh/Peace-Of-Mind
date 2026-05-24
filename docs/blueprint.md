# **App Name**: PeaceMind Sanctuary

## Core Features:

- Mood-Based Tool Recommendation: Anonymous mood check-in upon loading, auto-recommends relevant tools (breathing for anxiety, affirmations for low mood).
- Personalized Content Streams: Dynamically adjusts visible tools, and emphasis in resource section based on the current and historical (localStorage) mood of the user.
- Anonymous Journal with AI Prompts: Private text area for journaling, offers optional AI-generated prompts.  Includes 'burn after reading' and localStorage save options. This feature uses AI to generate personalized and supportive writing prompts. The AI LLM will use a tool to optionally provide follow-up suggestions depending on the content of the journal.
- Stepped Care Navigation: Guided pathway, escalates to resources/helplines if severe distress is detected through keyword recognition (e.g., suicidal ideation).
- Wellness Challenge Streaks: 7-day challenges (e.g., 'Anxiety Reset') with progress badges stored in localStorage.
- Gen Z Resource Hub: Curated content on social media pressure, academic burnout, identity issues, featuring tips, audio embeds, and infographics.
- Community 'Share Your Light': Allows anonymous text/emoji posts, likes/replies, Firebase Firestore storage with basic moderation.
- Basic support chatbot: Integrates a rule-based chatbot (Dialogflow or similar) to instantly provide CBT based help for anxiety. Detects suicidal thoughts to redirect to emergency helpline. No storage of the data will occur on the server, data is kept entirely within the users browser.

## Style Guidelines:

- Primary color: Soft lavender (#E6E6FA) to promote tranquility and peace.
- Background color: Very light lavender (#F5F5FF), near-white to ensure the prominence of foreground elements and the primary color.
- Accent color: Muted teal (#70A1AF) to complement the primary color without overpowering it, adding a touch of calm.
- Body and headline font: 'PT Sans', a humanist sans-serif that is suitable for headlines or body text.
- Use gentle, nature-inspired icons (moon, lanterns, plants) with an emphasis on rounded, soft edges.
- Mobile-first design with a clean, spacious layout; uses plenty of whitespace and soft gradients (deep blues, purples, soft greens) to create a calming environment.
- Subtle CSS animations (e.g., floating elements, gentle transitions) to enhance user experience without being distracting.