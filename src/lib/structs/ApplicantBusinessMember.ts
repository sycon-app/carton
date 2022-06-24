import type { Name } from "../types/Name";
import type { RawApplicantBusinessMember } from "../types/RawApplicantBusiness";

export interface ApplicantBusinessMemberData {
  id: number;
  name: Name;
}

export class ApplicantBusinessMember {
  id: number;

  name: Name;

  constructor(data: RawApplicantBusinessMember) {
    this.id = data.MailboxBusinessMemberID;
    this.name = {
      first: data.FirstName.toUpperCase(),
      middle: data.MiddleName?.toUpperCase() ?? undefined,
      last: data.LastName.toUpperCase(),
      full: `${data.FirstName} ${data.LastName}`,
    };
  }

  json(): ApplicantBusinessMemberData {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
