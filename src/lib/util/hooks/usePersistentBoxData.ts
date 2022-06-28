/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import type { BoxDimensions } from "../../structs/BoxDimensions";
import type { BoxDBSchema } from "lib/types/BoxesDBSchema";

import useIndexedDB from "./useIndexedDB";

export default function usePersistentBoxData() {
    const [boxes, setBoxes] = useState<BoxDimensions[]>();
    const { indexedDB: boxDB } = useIndexedDB<BoxDBSchema>("carton", "boxes");
    const [isRunningDBTransaction, setIsRunningDBTransaction] = useState(false);

    // Load from DB on page load
    useEffect(() => {
        if (isRunningDBTransaction || !boxDB) return;

        setIsRunningDBTransaction(true);

        (async () => {
            const dbData = await boxDB.getAll("boxes");

            setBoxes(dbData);

            setIsRunningDBTransaction(false);
        })();
    }, [boxDB]);

    // Update DB whenever boxes state is updated
    useEffect(() => {
        if (isRunningDBTransaction || !boxDB || !boxes || boxes.length === 0)
            return;

        setIsRunningDBTransaction(true);

        const transaction = boxDB.transaction("boxes", "readwrite");

        (async () => {
            await Promise.all([
                ...boxes.map((box) => transaction.store.put(box)),
                transaction.done,
            ]);

            setIsRunningDBTransaction(false);
        })();
    }, [boxes, boxDB]);

    return { boxes, setBoxes };
}
