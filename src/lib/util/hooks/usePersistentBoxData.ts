/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import { boxDefaults } from "../boxDefaults";
import type { BoxData } from "lib/structs/BoxData";
import type { BoxDBSchema } from "lib/types/BoxesDBSchema";

import useIndexedDB from "./useIndexedDB";

export default function usePersistentBoxData(noDbWrite = false) {
    const [boxes, setBoxes] = useState<BoxData[]>();
    const { indexedDB: boxDB } = useIndexedDB<BoxDBSchema>(
        "carton",
        "boxes2",
        undefined,
        2
    );
    const [isRunningDBTransaction, setIsRunningDBTransaction] = useState(false);

    const initializeDB = async () => {
        if (noDbWrite || !boxDB) return;

        if (
            localStorage.getItem("db_version") &&
            localStorage.getItem("db_version") === "2"
        )
            return;
        localStorage.setItem("db_version", "2");

        setIsRunningDBTransaction(true);

        const transaction = boxDB.transaction("boxes2", "readwrite");

        await Promise.all([
            ...boxDefaults.map((box) => transaction.store.put(box)),
            transaction.done,
        ]);

        setIsRunningDBTransaction(false);
    };

    // Load from DB on page load
    useEffect(() => {
        if (isRunningDBTransaction || !boxDB) return;

        setIsRunningDBTransaction(true);

        (async () => {
            const dbData = await boxDB.getAll("boxes2");

            if (dbData.length > 0) {
                setBoxes(dbData);
            } else {
                await initializeDB();
            }

            setIsRunningDBTransaction(false);
        })();
    }, [boxDB]);

    // Update DB whenever boxes state is updated
    useEffect(() => {
        if (
            noDbWrite ||
            isRunningDBTransaction ||
            !boxDB ||
            !boxes ||
            boxes.length === 0
        )
            return;

        setIsRunningDBTransaction(true);

        (async () => {
            await boxDB.clear("boxes2");

            const transaction = boxDB.transaction("boxes2", "readwrite");

            await Promise.all([
                ...boxes.map((box) => transaction.store.put(box)),
                transaction.done,
            ]);

            setIsRunningDBTransaction(false);
        })();
    }, [boxes, boxDB]);

    return { boxes, setBoxes, isRunningDBTransaction };
}
