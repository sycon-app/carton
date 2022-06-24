import type { Nullable } from "./Nullable";

export interface RawApplicantBusiness {
  MailboxApplicantBusinessID: number;
  MailboxHolderID: 0;
  CenterNumber: 0;
  Name: string;
  AddressID: 0;
  Address: Nullable<string>;
  PhoneNumber: Nullable<string>;
  BusinessType: Nullable<string>;
  IsRegisteredCorporation: boolean;
  RegistrationState: Nullable<string>;
  RegistrationCounty: Nullable<string>;
  RegistrationDate: Nullable<string>;
  MailboxBusinessMembers: RawApplicantBusinessMember[];
}

export interface RawApplicantBusinessMember {
  MailboxBusinessMemberID: number;
  MailboxApplicantBusinessID: number;
  CenterNumber: 0;
  FirstName: string;
  MiddleName: Nullable<string>;
  LastName: string;
}
