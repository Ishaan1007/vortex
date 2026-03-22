import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "About VORTEX '26",
  description: "About the VORTEX '26 college event registration website and organizer details.",
};

export default function AboutPage() {
  return (
    <PolicyPage
      eyebrow="Organizer"
      title="About VORTEX '26"
      intro="VORTEX '26 is presented as a college indoor games event registration website. Participants can choose events, pay the listed participation fee, and receive their ticket after successful payment verification."
      sections={[
        {
          title: "What this website is for",
          paragraphs: [
            "This website is intended for event registration and ticket booking for VORTEX '26 indoor games activities such as Ludo, Chess, Carrom, and Badminton.",
            "The website does not solicit donations, charitable crowdfunding, multi-level marketing participation, adult content transactions, or any restricted category described in payment-gateway policies.",
          ],
        },
        {
          title: "Organizer information",
          paragraphs: [
            "The event is displayed as an activity organized by the CSE department. The website is used only for collecting participation fees for listed games and issuing participant tickets.",
            "Before using this site for production approvals, the organizer should ensure that the final institution name, event coordinator name, support email address, and support phone number are shown consistently on this website and in the payment account profile.",
          ],
        },
        {
          title: "Fulfilment model",
          paragraphs: [
            "After a successful payment, the participant receives a generated ticket and can use that ticket as proof of registration for the selected game entries.",
            "No physical goods are sold or shipped through this website. The fulfilment is digital ticket issuance for event participation.",
          ],
        },
      ]}
    />
  );
}
