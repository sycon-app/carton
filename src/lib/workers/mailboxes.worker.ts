import { table } from "table";

import type { MailboxData } from "../structs/Mailbox";
import { Mailbox } from "../structs/Mailbox";
import { MailboxGroup } from "../structs/MailboxGroup";
import type { RawMailbox } from "../types/RawMailbox";

const tableConfig = {
  drawVerticalLine: () => false,
  drawHorizontalLine: () => false,
};

export function getMailboxes(data: RawMailbox[]): MailboxData[] {
  const mailboxGroup = new MailboxGroup();

  data.forEach((rawMailbox) => {
    const mb = new Mailbox(rawMailbox);

    if (mb.status === "INACTIVE") return;

    mailboxGroup.add(mb);
  });

  return mailboxGroup.mailboxes.map((mailbox) => mailbox.json());
}

export function parseRawMailboxJSON(str: string): RawMailbox[] {
  return JSON.parse(str).data;
}

export function parseJSON(str: string): MailboxData[] {
  return JSON.parse(str);
}

function makeMailboxTable(name: string, mailboxes: Mailbox[]) {
  return table(
    [
      [name],
      [""],
      // TODO
      // eslint-disable-next-line sonarjs/cognitive-complexity
      ...mailboxes.map((mailbox) => [
        table(
          [
            [
              `[${mailbox.number}]`,
              mailbox.primaryHolder.name.full,
              `${mailbox.hasRenewal ? "(renewed)" : ""}`,
            ],
            ...mailbox.applicants.flatMap((applicant) => {
              const rows = [["A", applicant.name.full, ""]];
              const hasMinors = applicant.minors.length > 0;
              const hasBusinesses = applicant.businesses.length > 0;

              if (hasMinors) {
                rows.push(
                  ...applicant.minors.map((minor, i) => [
                    `${hasBusinesses ? "│" : ""}${
                      i === applicant.minors.length - 1 ? "└" : "├"
                    } M`,
                    `${hasBusinesses ? "│" : ""}${
                      i === applicant.minors.length - 1 ? "└" : "├"
                    } ${minor.name.full}`,
                    "",
                  ])
                );
              }

              if (hasBusinesses) {
                rows.push(
                  ...applicant.businesses.flatMap((business, i) => {
                    const businessRows: string[][] = [
                      [
                        `${
                          i === applicant.businesses.length - 1 ? "└" : "├"
                        } B`,
                        `${i === applicant.businesses.length - 1 ? "└" : "├"} ${
                          business.name
                        }`,
                        "",
                      ],
                    ];
                    const hasBusinessMembers = business.members.length > 0;

                    if (hasBusinessMembers) {
                      businessRows.push(
                        ...business.members.map((member, memberIndex) => [
                          "",
                          `  ${
                            memberIndex === business.members.length - 1
                              ? "└"
                              : "├"
                          } ${member.name.full}`,
                          "",
                        ])
                      );
                    }

                    return businessRows;
                  })
                );
              }

              rows.push(["", "", ""]);

              return rows;
            }),
            ["Started   :", mailbox.startDate.toLocaleDateString(), ""],
            ["Ends      :", mailbox.endDate.toLocaleDateString(), ""],
            [
              "Remaining :",
              `${Math.round(
                (mailbox.endDate.valueOf() - Date.now()) / (1000 * 3600 * 24)
              )} days`,
              "",
            ],
          ],
          {
            ...tableConfig,
            drawHorizontalLine: (index, count) => index < 2 || index === count,
            drawVerticalLine: (index, count) => index === 0 || index === count,
          }
        ),
      ]),
    ],
    { ...tableConfig, drawHorizontalLine: (index) => index === 1 }
  );
}

export function generateReport(data: MailboxData[]) {
  const mailboxes = data.map((mailboxData) => Mailbox.fromJSON(mailboxData));
  const pendingMailboxes = mailboxes.filter(
    (mailbox) => mailbox.status === "PENDING"
  );
  const activeMailboxes = mailboxes.filter(
    (mailbox) => mailbox.status === "ACTIVE"
  );
  const expiredMailboxes = mailboxes.filter(
    (mailbox) =>
      (mailbox.endDate.valueOf() - Date.now()) / (1000 * 3600 * 24) < 0
  );

  const headerTable = table(
    [
      ["MBS Report", "", new Date().toLocaleDateString()],
      ["", "", ""],
      ["Generated by https://mbs.sycon.app", "", ""],
      ["", "", ""],
      ["A :: Applicant", "", ""],
      ["M :: Minor", "", ""],
      ["B :: Business", "", ""],
    ],
    {
      ...tableConfig,
      drawHorizontalLine: (index) => index < 2,
    }
  );

  const metaTable = table(
    [
      ["Active mailboxes", `: ${activeMailboxes.length}`],
      ["Pending mailboxes", `: ${pendingMailboxes.length}`],
      ...pendingMailboxes.map((mailbox, i) => [
        `${i === pendingMailboxes.length - 1 ? "└" : "├"} [${mailbox.number}]`,
        "",
      ]),
      ["Expired mailboxes", `: ${expiredMailboxes.length}`],
      ...expiredMailboxes.map((mailbox, i) => [
        `${i === expiredMailboxes.length - 1 ? "└" : "├"} [${
          mailbox.number
        }] by ${
          Math.round(
            (mailbox.endDate.valueOf() - Date.now()) / (1000 * 3600 * 24)
          ) * -1
        } days`,
        `${
          pendingMailboxes.some((mb) => mb.id === mailbox.id) ? "(pending)" : ""
        } ${mailbox.hasRenewal ? "(renewed)" : ""}`.trim(),
      ]),
    ],
    {
      ...tableConfig,
    }
  );

  const activeMailboxesTable = makeMailboxTable(
    "ACTIVE MAILBOXES",
    activeMailboxes
  );

  const pendingMailboxesTable = makeMailboxTable(
    "PENDING MAILBOXES",
    pendingMailboxes
  );

  return `${headerTable}\n${metaTable}\n\n${activeMailboxesTable}\n\n${pendingMailboxesTable}`;
}