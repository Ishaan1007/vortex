import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Contact VORTEX '26",
  description: "Support and organizer contact information for VORTEX '26 registrations.",
};

export default function ContactPage() {
  return (
    <PolicyPage
      eyebrow="Support"
      title="Contact Us"
      intro="Participants can use this page to understand how to reach the VORTEX '26 organizing team for registration issues, ticket corrections, and payment-related support."
      sections={[
        {
          title: "Support scope",
          paragraphs: [
            "Support requests may include ticket booking questions, duplicate payments, participant name corrections, and event-registration clarifications.",
            "Payment gateway reviewers generally expect the same contact details to appear on the website and inside the merchant profile. Update this page with the final organizer contact details before requesting approval.",
          ],
        },
        {
          title: "Organizer contact details",
          paragraphs: [
            "Organizing Team: VORTEX '26 Indoor Games Organizing Team",
            "Organizing Unit: CSE Department",
            "Support Email: add your official support email here before resubmitting for payment approval.",
            "Support Phone: add your official support number here before resubmitting for payment approval.",
          ],
        },
        {
          title: "Response expectations",
          paragraphs: [
            "The organizing team should aim to respond within a reasonable time for payment, refund, and event-entry concerns.",
            "If a payment is completed but a ticket is not issued, the participant should share the payment reference and registration name with the organizer for manual verification.",
          ],
        },
      ]}
    />
  );
}
