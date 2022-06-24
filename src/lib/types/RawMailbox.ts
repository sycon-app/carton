import type { Nullable } from "./Nullable";
import type { RawApplicant } from "./RawApplicant";
import type { RawApplicantBusiness } from "./RawApplicantBusiness";
import type { RawApplicantMinor } from "./RawApplicantMinor";

export interface RawMailbox {
  MailboxAgreementID: number;
  MailboxAgreementStatus: "Active" | "Pending" | "Inactive";
  MailboxAgreementStatusID: number;

  CustomerTypeID: number;
  CustomerTypeDescription: "Personal" | "Business";

  MailboxNumber: number;
  MailboxSize: "Virtual" | "Small" | "Medium" | "Large";

  BusinessID: RawApplicantBusiness["MailboxApplicantBusinessID"];
  BusinessName: RawApplicantBusiness["Name"];
  BusinessPhone: RawApplicantBusiness["PhoneNumber"];

  IsBoxHolderPrimary: boolean;
  BoxHolderID: RawApplicant["MailboxHolderID"];
  BoxHolderFirstName: RawApplicant["FirstName"];
  BoxHolderMiddleName: RawApplicant["MiddleName"];
  BoxHolderLastName: RawApplicant["LastName"];
  BoxHolderPhone: RawApplicant["HomePhone"];

  MemberID: Nullable<number>;
  MemberFirstName: Nullable<string>;
  MemberMiddleName: Nullable<string>;
  MemberLastName: Nullable<string>;

  MinorID: RawApplicantMinor["MailboxApplicantMinorID"];
  MinorFirstName: RawApplicantMinor["FirstName"];
  MinorMiddleName: RawApplicantMinor["MiddleName"];
  MinorLastName: RawApplicantMinor["LastName"];

  StartDate: string;
  EndDate: string;
  StartDateAsString: string;
  EndDateAsString: string;

  BoxHolderFullName: string;
  MemberFullName: string;
  MinorFullName: string;

  PackageOnly: null;

  HasRenewalAgreement: boolean;

  InactiveReasonID: Nullable<number>;
  InactiveDate: Nullable<string>;
  TerminatedDate: Nullable<string>;
  TerminatedUserID: Nullable<number>;
  TerminatedMailHandlingStatusID: Nullable<number>;

  AdditionalApplicants: RawApplicant[];

  AutoRenew: boolean;
  AutoRenewalStatusID: Nullable<number>;
  AutoRenewalCustomerID: Nullable<number>;

  IsFullService: boolean;
}
