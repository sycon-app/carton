import type { Nullable } from "./Nullable";

export interface RawApplicantMinor {
  MailboxApplicantMinorID: number;
  MailboxHolderID: 0;
  CenterNumber: 0;
  FirstName: string;
  MiddleName: Nullable<string>;
  LastName: string;
}
