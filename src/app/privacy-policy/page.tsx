import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy - VORTEX '26",
  description: "Privacy policy for the VORTEX '26 event registration website.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Privacy"
      title="Privacy Policy"
      intro="This Privacy Policy explains the information collected through the VORTEX '26 registration website and how that information is used for event participation and ticket management."
      sections={[
        {
          title: "Information collected",
          paragraphs: [
            "The website may collect participant information such as name, selected games, ticket quantity, payment identifiers, and related registration metadata necessary to create orders and issue tickets.",
            "Sensitive card or bank credentials are not stored directly by this website. Payments are processed through Razorpay and its checkout flow.",
          ],
        },
        {
          title: "How information is used",
          paragraphs: [
            "Participant information is used to create registration records, verify successful payments, generate tickets, and respond to support requests related to the booking.",
            "The website may also use booking data to prevent duplicate entries, reconcile payments, and maintain an accurate participant list for event operations.",
          ],
        },
        {
          title: "Sharing and retention",
          paragraphs: [
            "Information is shared only to the extent necessary for payment processing, ticket generation, and event administration.",
            "The organizer should retain participant information only for as long as it is reasonably required for event execution, payment reconciliation, and legal or administrative obligations.",
          ],
        },
      ]}
    />
  );
}
