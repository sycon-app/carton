import type { DBSchema } from "idb";

import type { MailboxData } from "../structs/Mailbox";

export interface MailboxDBSchema extends DBSchema {
  mailboxes: {
    value: MailboxData;
    key: string;
    indexes: { "by-number": number };
  };
}
