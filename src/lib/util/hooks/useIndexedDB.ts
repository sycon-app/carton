import { openDB } from "idb";
import type { IDBPDatabase, StoreNames, IndexNames } from "idb";
import { useEffect, useState } from "react";

export default function useIndexedDB<T>(
    name: string,
    storeName: StoreNames<T>,
    additionalIndexes: [IndexNames<T, StoreNames<T>>, string][] = [],
    version = 1
) {
    const [indexedDB, setIndexedDB] = useState<IDBPDatabase<T> | null>(null);

    useEffect(() => {
        (async () => {
            setIndexedDB(
                await openDB<T>(name, version, {
                    upgrade(database) {
                        const store = database.createObjectStore(storeName, {
                            keyPath: "_id",
                            autoIncrement: true,
                        });

                        additionalIndexes.forEach((index) =>
                            store.createIndex(index[0], index[1])
                        );
                    },
                })
            );
        })();

        return () => {
            (async () => {
                await indexedDB?.close();

                setIndexedDB(null);
            })();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { indexedDB };
}
