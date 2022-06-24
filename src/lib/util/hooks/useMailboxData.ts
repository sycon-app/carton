import { useWorker, createWorkerFactory } from "@shopify/react-web-worker";
import { useEffect, useState } from "react";

import type { MailboxData } from "../../structs/Mailbox";
import type { MailboxDBSchema } from "../../types/MailboxDBSchema";

import useIndexedDB from "./useIndexedDB";

const createWorker = createWorkerFactory(
  () => import("../../workers/mailboxes.worker")
);

export default function useMailboxData(centerNumber?: string) {
  const [rawMailboxDataStr, setRawMailboxDataStr] = useState("[]");
  const [mailboxes, setMailboxes] = useState<MailboxData[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isValidData, setIsValidData] = useState<boolean | null>(null);
  const [report, setReport] = useState("");
  const { indexedDB: mailboxDB } = useIndexedDB<MailboxDBSchema>(
    `mbs_data_${centerNumber || 0}`,
    "mailboxes",
    [["by-number", "number"]]
  );
  const [isRunningDBTransaction, setIsRunningDBTransaction] = useState(false);
  const worker = useWorker(createWorker);

  const updateReport = async (data: MailboxData[]) => {
    setReport(await worker.generateReport(data));
  };

  useEffect(() => {
    if (rawMailboxDataStr === "[]") return;

    (async () => {
      setIsParsing(true);

      try {
        const parsedJSON = await worker.parseRawMailboxJSON(rawMailboxDataStr);
        const newMailboxes = await worker.getMailboxes(parsedJSON);

        setMailboxes(newMailboxes);

        setIsValidData(true);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        setIsValidData(false);
      }

      setIsParsing(false);
    })();
  }, [worker, rawMailboxDataStr]);

  // DB caching
  useEffect(() => {
    if (mailboxes.length === 0 || !mailboxDB || isRunningDBTransaction) return;

    setIsRunningDBTransaction(true);

    (async () => {
      await mailboxDB.clear("mailboxes");

      const transaction = mailboxDB.transaction("mailboxes", "readwrite");

      await Promise.all([
        ...mailboxes.map((mailbox) => transaction.store.put(mailbox)),
        transaction.done,
      ]);

      await updateReport(mailboxes);

      setIsRunningDBTransaction(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mailboxes, mailboxDB]);

  // DB initial setting
  useEffect(() => {
    if (!mailboxDB || isRunningDBTransaction) return;

    setIsRunningDBTransaction(true);

    (async () => {
      const mailboxData = await mailboxDB.getAllFromIndex(
        "mailboxes",
        "by-number"
      );

      setIsRunningDBTransaction(false);

      setMailboxes(mailboxData);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mailboxDB]);

  return {
    mailboxes,
    setMailboxes,
    mailboxDB,
    setRawMailboxDataStr,
    isParsing,
    isValidData,
    report,
    worker,
  };
}
