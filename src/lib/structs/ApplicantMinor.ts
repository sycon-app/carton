import type { Name } from "../types/Name";
import type { RawApplicantMinor } from "../types/RawApplicantMinor";

export interface ApplicantMinorData {
  id: number;
  name: Name;
}

export class ApplicantMinor {
  id: number;

  name: Name;

  constructor(data: RawApplicantMinor) {
    this.id = data.MailboxApplicantMinorID;
    this.name = {
      first: data.FirstName.toUpperCase(),
      middle: data.MiddleName?.toUpperCase() ?? undefined,
      last: data.LastName.toUpperCase(),
      full: `${data.FirstName} ${data.LastName}`,
    };
  }

  json(): ApplicantMinorData {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
