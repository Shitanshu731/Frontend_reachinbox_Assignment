// Re-defining for the frontend. In a monorepo, this could be a shared package.
export type EmailCategory =
  | "Interested"
  | "Meeting Booked"
  | "Not Interested"
  | "Spam"
  | "Out of Office"
  | "Uncategorized";

export interface Email {
  id: number | string;
  from: string;
  subject: string;
  body: string;
  date: Date | string;
  aiCategory: string;
  account: string;
  suggestedReplies?: string[];
}
