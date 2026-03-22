import fs from "fs/promises";
import path from "path";

const sequenceFilePath = path.join(process.cwd(), "data", "ticket-sequence.json");

type TicketSequenceState = {
  lastSequence: number;
};

async function ensureSequenceFile() {
  await fs.mkdir(path.dirname(sequenceFilePath), { recursive: true });

  try {
    await fs.access(sequenceFilePath);
  } catch {
    await fs.writeFile(sequenceFilePath, JSON.stringify({ lastSequence: -1 } satisfies TicketSequenceState, null, 2));
  }
}

export async function allocateTicketSequences(count: number) {
  await ensureSequenceFile();

  const raw = await fs.readFile(sequenceFilePath, "utf8");
  const parsed = JSON.parse(raw) as TicketSequenceState;
  const start = parsed.lastSequence + 1;
  const sequences = Array.from({ length: count }, (_, index) => start + index);

  await fs.writeFile(sequenceFilePath, JSON.stringify({ lastSequence: start + count - 1 } satisfies TicketSequenceState, null, 2));

  return sequences;
}
