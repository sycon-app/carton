/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type Peer from "peerjs";
import { useReducer, useState } from "react";

type ReceiverMessage = {
  type: "CHUNK_REQUEST";
  data: {
    index: number;
  };
};
function isReceiverMessage(data: any): data is ReceiverMessage {
  const validTypes: ReceiverMessage["type"][] = ["CHUNK_REQUEST"];

  return validTypes.includes(data.type);
}

type SenderMessage<T = unknown> =
  | {
      type: "SENDER_READY";
      data: {
        totalChunks: number;
      };
    }
  | {
      type: "CHUNK";
      data: {
        chunk: T;
        index: number;
        totalChunks: number;
      };
    }
  | {
      type: "TRANSFER_FINISHED";
    };
function isSenderMessage<T = unknown>(data: any): data is SenderMessage<T> {
  const validTypes: SenderMessage["type"][] = [
    "CHUNK",
    "SENDER_READY",
    "TRANSFER_FINISHED",
  ];

  return validTypes.includes(data.type);
}

export function useDirectTransfer<T>() {
  const [peerClient, setPeerClient] = useState<Peer>();
  const [peerClientId, setPeerClientId] = useState<string>();

  const [isAcceptingConnections, setIsAcceptingConnections] = useState(false);

  const [isTransferingData, setIsTransferingData] = useState(false);
  const [dataLength, setDataLength] = useState<number>();
  const [currentTransferIndex, setCurrentTransferIndex] = useState(0);

  const [dataReceived, updateDataReceived] = useReducer(
    (currentDataReceived: T[], newData: T | null) => {
      if (newData === null) {
        return [];
      }

      return [...currentDataReceived, newData];
    },
    []
  );

  const cleanUp = () => {
    if (peerClient) {
      peerClient.disconnect();
      peerClient.destroy();
    }

    setPeerClient(undefined);
    setPeerClientId(undefined);
    setIsAcceptingConnections(false);
    setIsTransferingData(false);
    setDataLength(0);
    setCurrentTransferIndex(0);
    updateDataReceived(null);

    // console.log("[DATA] Connection terminated.");
  };

  return {
    peerClient,
    setPeerClient,
    peerClientId,
    setPeerClientId,
    isAcceptingConnections,
    setIsAcceptingConnections,
    isTransferingData,
    setIsTransferingData,
    dataLength,
    setDataLength,
    currentTransferIndex,
    setCurrentTransferIndex,
    dataReceived,
    updateDataReceived,
    cleanUp,
  };
}

export function useDirectTransferReceiver<T>() {
  const {
    peerClient,
    setPeerClient,
    isAcceptingConnections,
    setIsAcceptingConnections,
    isTransferingData,
    setIsTransferingData,
    dataLength,
    setDataLength,
    currentTransferIndex,
    setCurrentTransferIndex,
    dataReceived,
    updateDataReceived,
    cleanUp,
  } = useDirectTransfer<T>();

  const requestDirectTransferForReceiver = async (id: string) => {
    if (isAcceptingConnections) return;
    setIsAcceptingConnections(true);

    import("peerjs").then(({ default: PeerClient }) => {
      // console.log("[DATA] Creating data transfer receiver client...");

      const peer =
        peerClient ??
        new PeerClient({
          host: "wrtc.api.sycon.app",
          key: "mbs-webrtc-1",
          secure: true,
          // debug: 3,
        });

      peer.once("open", () => {
        setPeerClient(peer);

        // console.log(`[DATA] Attempting to connect to peer with ID ${id}...`);

        const conn = peer.connect(id, { serialization: "json" });

        conn.once("open", () => {
          // console.log("[DATA] Connection open.");

          conn.on("data", (message) => {
            if (!isSenderMessage<T>(message)) {
              // console.warn("[DATA] Unsupported message type!", message);

              return;
            }

            // console.log(`[DATA] Message from peer: ${message.type}.`);

            switch (message.type) {
              case "SENDER_READY": {
                setIsTransferingData(true);
                setDataLength(message.data.totalChunks);
                setCurrentTransferIndex(0);

                conn.send({
                  type: "CHUNK_REQUEST",
                  data: {
                    index: 0,
                  },
                } as ReceiverMessage);

                break;
              }
              case "CHUNK": {
                /* console.log(
                  `[DATA] Received chunk ${message.data.index + 1}/${
                    message.data.totalChunks
                  } from peer.`
                ); */

                updateDataReceived(message.data.chunk);

                /* console.log(
                  `[DATA] Requesting chunk ${message.data.index + 2}/${
                    message.data.totalChunks
                  } from peer...`
                ); */

                setCurrentTransferIndex(message.data.index + 1);

                conn.send({
                  type: "CHUNK_REQUEST",
                  data: {
                    index: message.data.index + 1,
                  },
                } as ReceiverMessage);

                break;
              }
              case "TRANSFER_FINISHED": {
                // console.log("[DATA] Received final chunk. Cleaning up...");

                cleanUp();

                break;
              }
              default: {
                // console.warn("[DATA] Unsupported message type!", message);
              }
            }
          });
        });
      });

      peer.on("disconnected", () => {
        // console.log("[DATA] Disconnected.");
        cleanUp();
      });

      peer.on("close", () => {
        // console.log("[DATA] Connection closed remotely.");
        cleanUp();
      });

      peer.on("error", (error) => {
        console.error("[DATA] Fatal error!", error);
        cleanUp();
      });
    });
  };

  return {
    requestDirectTransferForReceiver,
    currentTransferIndex,
    isAcceptingConnections,
    isTransferingData,
    dataReceived,
    dataLength,
    cleanUp,
  };
}

export function useDirectTransferSender<T>() {
  const {
    peerClient,
    setPeerClient,
    peerClientId,
    setPeerClientId,
    isAcceptingConnections,
    setIsAcceptingConnections,
    isTransferingData,
    currentTransferIndex,
    setCurrentTransferIndex,
    dataLength,
    setDataLength,
    setIsTransferingData,
    cleanUp,
  } = useDirectTransfer<T>();

  const requestDirectTransferForSender = (data: T[]) => {
    if (isAcceptingConnections) return;
    setIsAcceptingConnections(true);

    import("peerjs").then(({ default: PeerClient }) => {
      // console.log("[DATA] Creating data transfer sender client...");

      setDataLength(data.length);

      const peer =
        peerClient ??
        new PeerClient({
          host: "wrtc.api.sycon.app",
          key: "mbs-webrtc-1",
          secure: true,
          // debug: 3,
        });

      peer.once("open", (id) => {
        setPeerClient(peer);
        setPeerClientId(id);
      });

      peer.once("connection", (conn) => {
        // console.log("[DATA] Received connection.");

        conn.once("open", () => {
          // console.log("[DATA] Connection open.");

          setIsTransferingData(true);

          conn.on("data", (message) => {
            if (!isReceiverMessage(message)) {
              // console.warn("[DATA] Unsupported message type!", message);

              return;
            }

            // console.log(`[DATA] Message from peer: ${message.type}.`);

            // eslint-disable-next-line sonarjs/no-small-switch
            switch (message.type) {
              case "CHUNK_REQUEST": {
                if (message.data.index >= data.length) {
                  /* console.log(
                    "[DATA] Sending TRANSFER_FINISHED message to peer. Cleaning up..."
                  ); */

                  conn.send({
                    type: "TRANSFER_FINISHED",
                  } as SenderMessage<T>);

                  cleanUp();

                  return;
                }

                /* console.log(
                  `[DATA] Sending chunk ${message.data.index + 1}/${
                    data.length
                  } to peer...`
                ); */

                setCurrentTransferIndex(message.data.index);

                conn.send({
                  type: "CHUNK",
                  data: {
                    chunk: data[message.data.index],
                    index: message.data.index,
                    totalChunks: data.length,
                  },
                } as SenderMessage<T>);

                break;
              }
              default: {
                // console.warn("[DATA] Unsupported message type!", message);
              }
            }
          });

          // Let the receiver know the sender is ready to send data
          conn.send({
            type: "SENDER_READY",
            data: {
              totalChunks: data.length,
            },
          } as SenderMessage<T>);
        });
      });

      peer.on("disconnected", () => {
        // console.log("[DATA] Disconnected.");
        cleanUp();
      });

      peer.on("close", () => {
        // console.log("[DATA] Connection closed remotely.");
        cleanUp();
      });

      peer.on("error", (error) => {
        console.error("[DATA] Fatal error!", error);
        cleanUp();
      });
    });
  };

  return {
    requestDirectTransferForSender,
    peerClientId,
    isAcceptingConnections,
    setIsAcceptingConnections,
    isTransferingData,
    currentTransferIndex,
    dataLength,
    cleanUp,
  };
}
