import type { RawApplicantBusiness } from "../types/RawApplicantBusiness";

import { ApplicantBusinessMember } from "./ApplicantBusinessMember";
import type { ApplicantBusinessMemberData } from "./ApplicantBusinessMember";

export interface ApplicantBusinessData {
  id: number;
  name: string;
  address?: string;
  phoneNumber?: string;
  isRegisteredCorporation?: boolean;
  members: ApplicantBusinessMemberData[];
}

export class ApplicantBusiness {
  id: number;

  name: string;

  address?: string;

  phoneNumber?: string;

  isRegisteredCorporation: boolean;

  members: ApplicantBusinessMember[];

  constructor(data: RawApplicantBusiness) {
    this.id = data.MailboxApplicantBusinessID;
    this.name = data.Name;
    this.address = data.Address ?? undefined;
    this.phoneNumber = data.PhoneNumber ?? undefined;
    this.isRegisteredCorporation = data.IsRegisteredCorporation;
    this.members = data.MailboxBusinessMembers.map(
      (businessMember) => new ApplicantBusinessMember(businessMember)
    );
  }

  json(): ApplicantBusinessData {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
      phoneNumber: this.phoneNumber,
      isRegisteredCorporation: this.isRegisteredCorporation,
      members: this.members.map((member) => member.json()),
    };
  }
}
