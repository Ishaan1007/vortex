import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy - VORTEX '26",
  description: "Refund and cancellation policy for VORTEX '26 registrations.",
};

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Refunds"
      title="Refund and Cancellation Policy"
      intro="This page explains the expected handling of refunds, cancellations, duplicate payments, and organizer-side event changes for VORTEX '26 registrations."
      sections={[
        {
          title: "Participant cancellations",
          paragraphs: [
            "The organizer should publish the final cancellation cut-off and refund eligibility rules before accepting live payments.",
            "If participant-initiated cancellations are allowed, the refund window, deduction policy, and expected processing time should be clearly stated on this page and followed consistently.",
          ],
        },
        {
          title: "Duplicate or failed fulfilment cases",
          paragraphs: [
            "If a participant is charged more than once for the same booking, or if payment succeeds but a valid ticket is not issued, the organizer should verify the transaction and process an appropriate correction or refund.",
            "Participants should contact the organizer with their payment reference, registration name, and selected event details for faster resolution.",
          ],
        },
        {
          title: "Organizer cancellations",
          paragraphs: [
            "If an event is cancelled by the organizer, affected participants should be informed of the available options, which may include rescheduling, replacement entry, or refund handling according to the organizer's published policy.",
            "The organizer should ensure that the final refund policy shown here matches the policy declared to the payment gateway and to participants.",
          ],
        },
      ]}
    />
  );
}
