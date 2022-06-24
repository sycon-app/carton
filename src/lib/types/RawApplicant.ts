import type { Nullable } from "./Nullable";
import type { RawApplicantBusiness } from "./RawApplicantBusiness";
import type { RawApplicantMinor } from "./RawApplicantMinor";

export interface RawApplicant {
  MailboxHolderID: number;
  AddressID: 0;
  CenterNumber: 0;

  MailboxID: 0;
  MailboxNumber: 0;
  MailboxHolderStatusID: 0;
  MailboxAgreementID: 0;
  MailboxAgreementStartDate: string;
  MailboxAgreementEndDate: string;
  MailboxAgreementInactiveDate: Nullable<string>;
  MailboxAgreementStatusID: 0;
  MailHandlingStatusID: 0;

  FirstName: string;
  MiddleName: Nullable<string>;
  LastName: string;
  DateOfBirth: Nullable<string>;
  HomePhone: string;
  CellPhone: Nullable<string>;
  WorkPhone: Nullable<string>;
  FaxPhone: Nullable<string>;
  Email: Nullable<string>;

  IsPrimaryBoxHolder: boolean;
  IsMinor: Nullable<boolean>;
  AcceptRestrictedDelivery: Nullable<boolean>;
  ReceiveServiceReminderEmail: Nullable<boolean>;
  ReceiveServiceReminderTextMessage: Nullable<boolean>;
  Form1583SignedDate: Nullable<string>;
  Form1583FileStoreGuid: Nullable<string>;
  AckFormSignedDate: Nullable<string>;
  TextMessageAddress: Nullable<string>;
  Address: Nullable<string>;

  ModifiedDate: string;
  ModifiedUserID: 0;
  DeletedDate: Nullable<string>;
  DeletedUserID: 0;

  FullName: string;

  MailboxApplicantBusinesses: RawApplicantBusiness[];
  MailboxApplicantMinors: RawApplicantMinor[];
}
