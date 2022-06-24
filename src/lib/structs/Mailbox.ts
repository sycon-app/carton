/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RawApplicant } from "../types/RawApplicant";
import type {
  RawApplicantBusinessMember,
  RawApplicantBusiness,
} from "../types/RawApplicantBusiness";
import type { RawApplicantMinor } from "../types/RawApplicantMinor";
import type { RawMailbox } from "../types/RawMailbox";

import { Applicant } from "./Applicant";
import type { ApplicantData } from "./Applicant";
import type { ApplicantBusiness } from "./ApplicantBusiness";
import type { ApplicantMinor } from "./ApplicantMinor";

export interface MailboxData {
  id: number;
  number: number;
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  type: "PERSONAL" | "BUSINESS";
  size: "VIRTUAL" | "SMALL" | "MEDIUM" | "LARGE";
  primaryApplicantId: number;
  startDate: Date;
  endDate: Date;
  hasRenewal: boolean;
  autoRenew: boolean;
  applicants: ApplicantData[];
}

export class Mailbox {
  id: number;

  number: number;

  status: "ACTIVE" | "PENDING" | "INACTIVE";

  type: "PERSONAL" | "BUSINESS";

  size: "VIRTUAL" | "SMALL" | "MEDIUM" | "LARGE";

  primaryApplicantId: number;

  startDate: Date;

  endDate: Date;

  hasRenewal: boolean;

  autoRenew: boolean;

  applicants: Applicant[];

  constructor(data: RawMailbox) {
    this.id = data.MailboxAgreementID;
    this.number = data.MailboxNumber;
    this.status = data.MailboxAgreementStatus.toUpperCase() as any;
    this.type = data.CustomerTypeDescription.toUpperCase() as any;
    this.size = data.MailboxSize.toUpperCase() as any;
    this.primaryApplicantId = data.BoxHolderID;
    this.startDate = new Date(Number(data.StartDate.match(/\d+/)?.[0] || 0));
    this.endDate = new Date(Number(data.EndDate.match(/\d+/)?.[0] || 0));
    this.hasRenewal = data.HasRenewalAgreement;
    this.autoRenew = data.AutoRenew;
    this.applicants = data.AdditionalApplicants.map(
      (rawApplicant) => new Applicant(rawApplicant)
    );
  }

  static fromJSON(data: MailboxData) {
    return new Mailbox({
      MailboxAgreementID: data.id,
      MailboxNumber: data.number,
      MailboxAgreementStatus: data.status,
      CustomerTypeDescription: data.type,
      MailboxSize: data.size,
      BoxHolderID: data.primaryApplicantId,
      StartDate: new Date(data.startDate).valueOf().toString(),
      EndDate: new Date(data.endDate).valueOf().toString(),
      HasRenewalAgreement: data.hasRenewal,
      AutoRenew: data.autoRenew,
      AdditionalApplicants: data.applicants.map(
        (applicant) =>
          ({
            MailboxHolderID: applicant.id,
            FirstName: applicant.name.first,
            MiddleName: applicant.name.middle,
            LastName: applicant.name.last,
            HomePhone: applicant.phoneNumber.home,
            CellPhone: applicant.phoneNumber.cell,
            WorkPhone: applicant.phoneNumber.work,
            FaxPhone: applicant.phoneNumber.fax,
            Email: applicant.email,
            Address: applicant.address,
            IsPrimaryBoxHolder: applicant.isPrimary,
            MailboxApplicantBusinesses: applicant.businesses.map(
              (business) =>
                ({
                  MailboxApplicantBusinessID: business.id,
                  Name: business.name,
                  Address: business.address,
                  PhoneNumber: business.phoneNumber,
                  IsRegisteredCorporation: business.isRegisteredCorporation,
                  MailboxBusinessMembers: business.members.map(
                    (member) =>
                      ({
                        MailboxBusinessMemberID: member.id,
                        FirstName: member.name.first,
                        MiddleName: member.name.middle,
                        LastName: member.name.last,
                      } as Partial<RawApplicantBusinessMember>)
                  ),
                } as Partial<RawApplicantBusiness>)
            ),
            MailboxApplicantMinors: applicant.minors.map(
              (minor) =>
                ({
                  MailboxApplicantMinorID: minor.id,
                  FirstName: minor.name.first,
                  MiddleName: minor.name.middle,
                  LastName: minor.name.last,
                } as Partial<RawApplicantMinor>)
            ),
          } as Partial<RawApplicant>)
      ),
    } as any);
  }

  get primaryHolder(): Applicant {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.applicants.find(
      (applicant) => applicant.id === this.primaryApplicantId
    )!;
  }

  get minors(): ApplicantMinor[] {
    return this.applicants.flatMap((applicant) => applicant.minors);
  }

  get businesses(): ApplicantBusiness[] {
    return this.applicants.flatMap((applicant) => applicant.businesses);
  }

  json(): MailboxData {
    return {
      id: this.id,
      number: this.number,
      status: this.status,
      type: this.type,
      size: this.size,
      primaryApplicantId: this.primaryApplicantId,
      startDate: this.startDate,
      endDate: this.endDate,
      hasRenewal: this.hasRenewal,
      autoRenew: this.autoRenew,
      applicants: this.applicants.map((applicant) => applicant.json()),
    };
  }
}
