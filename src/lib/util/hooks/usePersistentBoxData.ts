/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import { boxDefaults } from "../boxDefaults";
import type { BoxData } from "lib/structs/BoxData";
import type { BoxDBSchema } from "lib/types/BoxesDBSchema";

import useIndexedDB from "./useIndexedDB";

export default function usePersistentBoxData(noDbWrite = false) {
    const [boxes, setBoxes] = useState<BoxData[]>();
    const { indexedDB: boxDB } = useIndexedDB<BoxDBSchema>("carton", "boxes");
    const [isRunningDBTransaction, setIsRunningDBTransaction] = useState(false);

    const initializeDB = async () => {
        if (noDbWrite || !boxDB) return;

        if (localStorage.getItem("initial_set")) return;
        localStorage.setItem("initial_set", "true");

        setIsRunningDBTransaction(true);

        const transaction = boxDB.transaction("boxes", "readwrite");

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
            const dbData = await boxDB.getAll("boxes");

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
            await boxDB.clear("boxes");

            const transaction = boxDB.transaction("boxes", "readwrite");

            await Promise.all([
                ...boxes.map((box) => transaction.store.put(box)),
                transaction.done,
            ]);

            setIsRunningDBTransaction(false);
        })();
    }, [boxes, boxDB]);

    return { boxes, setBoxes, isRunningDBTransaction };
}
