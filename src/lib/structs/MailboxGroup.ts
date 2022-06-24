import type { RawMailbox } from "../types/RawMailbox";

import { Mailbox } from "./Mailbox";

export class MailboxGroup {
  mailboxes: Mailbox[];

  constructor(mailboxes: Mailbox[] = []) {
    this.mailboxes = mailboxes;
  }

  static fromRaw(data: RawMailbox[]) {
    const mailboxes = data.map((rawMailbox) => new Mailbox(rawMailbox));

    return new MailboxGroup(mailboxes);
  }

  get(id: number) {
    return this.mailboxes.find((mailbox) => mailbox.id === id);
  }

  has(id: number) {
    return this.mailboxes.some((mailbox) => mailbox.id === id);
  }

  add(mailbox: Mailbox) {
    if (this.has(mailbox.id)) return undefined;

    this.mailboxes.push(mailbox);

    return mailbox;
  }

  remove(id: number) {
    if (!this.has(id)) return undefined;

    const mailboxIndex = this.mailboxes.findIndex(
      (mailbox) => mailbox.id === id
    );

    return this.mailboxes.splice(mailboxIndex, 1)[0];
  }

  filter(predicate: (mailbox: Mailbox) => boolean) {
    return this.mailboxes.filter(predicate);
  }
}
