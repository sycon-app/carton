import type { Name } from "../types/Name";
import type { PhoneNumberVariants } from "../types/PhoneNumberVariants";
import type { RawApplicant } from "../types/RawApplicant";
import type {
  RawApplicantBusiness,
  RawApplicantBusinessMember,
} from "../types/RawApplicantBusiness";
import type { RawApplicantMinor } from "../types/RawApplicantMinor";

import { ApplicantBusiness } from "./ApplicantBusiness";
import type { ApplicantBusinessData } from "./ApplicantBusiness";
import { ApplicantMinor } from "./ApplicantMinor";
import type { ApplicantMinorData } from "./ApplicantMinor";

export interface ApplicantData {
  id: number;
  name: Name;
  phoneNumber: PhoneNumberVariants;
  email?: string;
  address?: string;
  isPrimary?: boolean;
  businesses: ApplicantBusinessData[];
  minors: ApplicantMinorData[];
}

export class Applicant {
  id: number;

  name: Name;

  phoneNumber: PhoneNumberVariants;

  email?: string;

  address?: string;

  isPrimary: boolean;

  businesses: ApplicantBusiness[];

  minors: ApplicantMinor[];

  constructor(data: RawApplicant) {
    this.id = data.MailboxHolderID;
    this.name = {
      first: data.FirstName.toUpperCase(),
      middle: data.MiddleName?.toUpperCase() ?? undefined,
      last: data.LastName.toUpperCase(),
      full: `${data.FirstName} ${data.LastName}`,
    };
    this.phoneNumber = {
      home: data.HomePhone,
      cell: data.CellPhone ?? undefined,
      work: data.WorkPhone ?? undefined,
      fax: data.FaxPhone ?? undefined,
    };
    this.email = data.Email ?? undefined;
    this.address = data.Address ?? undefined;
    this.isPrimary = data.IsPrimaryBoxHolder;
    this.businesses = data.MailboxApplicantBusinesses.map(
      (rawBusiness) => new ApplicantBusiness(rawBusiness)
    );
    this.minors = data.MailboxApplicantMinors.map(
      (rawMinor) => new ApplicantMinor(rawMinor)
    );
  }

  static fromJson(data: ApplicantData): Applicant {
    return new Applicant({
      MailboxHolderID: data.id,
      FirstName: data.name.first,
      MiddleName: data.name.middle,
      LastName: data.name.last,
      HomePhone: data.phoneNumber.home,
      CellPhone: data.phoneNumber.cell,
      WorkPhone: data.phoneNumber.work,
      FaxPhone: data.phoneNumber.fax,
      Email: data.email,
      Address: data.address,
      IsPrimaryBoxHolder: data.isPrimary,
      MailboxApplicantBusinesses: data.businesses.map(
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
      MailboxApplicantMinors: data.minors.map(
        (minor) =>
          ({
            MailboxApplicantMinorID: minor.id,
            FirstName: minor.name.first,
            MiddleName: minor.name.middle,
            LastName: minor.name.last,
          } as Partial<RawApplicantMinor>)
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  }

  json(): ApplicantData {
    return {
      id: this.id,
      name: this.name,
      phoneNumber: this.phoneNumber,
      email: this.email,
      address: this.address,
      isPrimary: this.isPrimary,
      businesses: this.businesses.map((business) => business.json()),
      minors: this.minors.map((minor) => minor.json()),
    };
  }
}
