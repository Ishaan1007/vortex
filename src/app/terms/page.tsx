import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Terms and Conditions - VORTEX '26",
  description: "Terms and conditions for bookings made on the VORTEX '26 website.",
};

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Terms"
      title="Terms and Conditions"
      intro="These terms govern participant use of the VORTEX '26 registration website and the purchase of event tickets through this platform."
      sections={[
        {
          title: "Booking terms",
          paragraphs: [
            "A booking is considered confirmed only after successful payment authorization and ticket generation on the website.",
            "Participants are responsible for entering accurate registration details before completing payment. Incorrect participant information may delay ticket issuance or support resolution.",
          ],
        },
        {
          title: "Permitted use",
          paragraphs: [
            "This website may be used only for genuine registration into the listed VORTEX '26 indoor games events.",
            "Users must not attempt fraudulent payments, abuse promotional or booking flows, or interfere with the website, payment verification, or ticket-generation systems.",
          ],
        },
        {
          title: "Event and organizer rights",
          paragraphs: [
            "The organizer may revise schedules, venue details, event rules, or participation limits when reasonably necessary for event administration.",
            "If a game is postponed, cancelled, or materially changed, the organizer should communicate the next steps to affected participants through the official support channels published on this website.",
          ],
        },
      ]}
    />
  );
}
