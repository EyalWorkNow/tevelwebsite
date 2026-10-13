// The cloud mailbox protocol, version 1 (mirrored in crm-fusion src/server/relay/protocol.ts).

export type FieldType = "TEXT" | "MULTILINE" | "NUMBER" | "DATE" | "CHECKBOX" | "CHOICE" | "IMAGE" | "SIGNATURE" | "INITIALS" | "STAMP" | "ID_NUMBER";

// A field the customer fills (the business's own fields are already printed in the PDF).
export type RelayField = { key: string; type: FieldType; label: string; required: boolean; options: string[] };

export type Signature =
  | { kind: "DRAWN"; paths: string[]; width: number; height: number }
  | { kind: "TYPED"; text: string }
  | { kind: "IMAGE"; dataUrl: string };

export type FieldValue = string | boolean | Signature | null;

export type RelayManifest = {
  v: 1;
  tokenHash: string;
  // SIGN: fields + consent + accept / decline. VIEW: look and download only (invoices, accepted quotes).
  mode: "SIGN" | "VIEW";
  title: string;
  number: string;
  kindLabel: string; // "הצעת מחיר", "חשבונית", "מסמך לחתימה"
  business: { name: string; accent: string | null; website: string | null };
  signerName: string;
  consentText: string;
  contentHash: string;
  createdAt: string;
  expiresAt: string;
  commercial: { kind: "QUOTE" | "INVOICE"; total: string } | null;
  fields: RelayField[];
  values: Record<string, FieldValue>; // prefilled customer values
  doc: { parts: number; size: number; sha256: string; fileName: string } | null; // null = still being prepared
};

export type RelayEvidence = { ip: string | null; userAgent: string | null; viewedAt: string | null; consentHash: string | null; contentHash: string | null; site: string };

export type RelayEvent =
  | { id: string; type: "viewed"; at: string; tokenHash: string; evidence: RelayEvidence }
  | { id: string; type: "signed"; at: string; tokenHash: string; signerName: string; values: Record<string, FieldValue>; consent: true; evidence: RelayEvidence }
  | { id: string; type: "declined"; at: string; tokenHash: string; reason: string; evidence: RelayEvidence }
  | { id: string; type: "lead"; at: string; lead: Record<string, unknown> };

// The customer's one action on a package (write-once).
export type RelayAction = { type: "signed" | "declined"; at: string; signerName?: string };

export type SignedMeta = { parts: number; size: number; sha256: string; fileName: string; at: string };
