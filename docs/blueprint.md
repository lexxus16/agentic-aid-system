# **App Name**: Alert Karachi

## Core Features:

- Reddit Post Fetcher: Fetches new posts from r/Karachi using the Reddit API to identify potential incidents.
- Incident Summarizer: Uses Gemini API as a tool to create concise summaries of incidents extracted from Reddit posts.
- Alert Broadcaster: Simulates sending incident alerts and confirmation requests to relevant authorities and collects verification feedback. Includes status tracking of responses.
- Incident Forwarder: Implements a system to forward verified incidents to NGOs and media outlets.
- Data Archiver: Stores incident data, including Reddit posts, Gemini summaries, and verification status, for auditing.
- Incident Dashboard: Provides an interface to monitor incident status (Pending, Verified, Fake, On Hold), review incident details (original Reddit post and AI-generated summary), and includes a manual override and resend option for notifications.

## Style Guidelines:

- Primary color: Vivid coral (#FF806E) to represent urgency and immediate attention.
- Background color: Soft beige (#F5F5DC) provides a neutral backdrop to highlight critical information.
- Accent color: Sky blue (#87CEEB) is used to denote informative elements and calls to action.
- Body and headline font: 'Inter' sans-serif for readability and a neutral, informative style.
- Use clear, universal icons from a set like Font Awesome for incident types and status indicators.
- Card-based layout for clear, prioritized display of incidents. Cards should have a distinct visual hierarchy: title, summary, status, actions.
- Subtle transitions (fade-ins, slide-ins) to smoothly update the dashboard and to provide a fluid experience when new incidents are reported.