/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable react-hooks/exhaustive-deps */
import { CheckIcon } from "@chakra-ui/icons";
import {
  Button,
  Code,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Spinner,
  useDisclosure,
  VStack,
  Text,
  useClipboard,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { BsArrowRight } from "react-icons/bs";
import { FiUpload, FiDownload } from "react-icons/fi";
import { TbDevices } from "react-icons/tb";
import { useSearchParams } from "react-router-dom";

import type { MailboxData } from "../../../structs/Mailbox";
import {
  useDirectTransferReceiver,
  useDirectTransferSender,
} from "../../../util/hooks/useDirectTransfer";

export function WRTCDataShareButtonSend({
  mailboxes,
}: {
  mailboxes: MailboxData[];
}) {
  const {
    requestDirectTransferForSender,
    peerClientId,
    isAcceptingConnections,
    isTransferingData,
    currentTransferIndex,
    dataLength,
    cleanUp,
  } = useDirectTransferSender<MailboxData>();
  const shareUrl = useMemo(() => {
    return `${window.location.protocol}//${window.location.host}${
      window.location.pathname
    }?transferFrom=${peerClientId ?? ""}`;
  }, [peerClientId]);

  const { hasCopied: hasCopiedId, onCopy: onCopyId } = useClipboard(
    peerClientId ?? "",
    1000
  );
  const { hasCopied: hasCopiedUrl, onCopy: onCopyUrl } = useClipboard(
    shareUrl,
    1000
  );

  return (
    <>
      <Modal
        isOpen={isAcceptingConnections}
        onClose={() => cleanUp()}
        size="sm"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody px={5}>
            <VStack spacing={4} mx={2}>
              <HStack>
                <Icon as={TbDevices} boxSize="1.5em" />
                <Icon as={BsArrowRight} boxSize="1.2em" />
                <Icon as={TbDevices} boxSize="1.2em" />
              </HStack>
              <Text textAlign="center">Connect using the code below:</Text>
              <Tooltip label={hasCopiedId ? "Copied!" : "Copy"} hasArrow>
                <Code
                  py={2}
                  px={5}
                  borderRadius="md"
                  borderWidth="thin"
                  style={{ letterSpacing: "0.1em" }}
                  color="orange.500"
                  onClick={() => peerClientId && onCopyId()}
                  borderColor={hasCopiedId ? "orange.500" : undefined}
                  userSelect="none"
                >
                  {peerClientId ? (
                    (peerClientId.match(/.{1,4}/g) ?? [peerClientId]).map(
                      (chars) => (
                        <span
                          style={{ marginLeft: "0.3em", marginRight: "0.3em" }}
                        >
                          {chars}
                        </span>
                      )
                    )
                  ) : (
                    <Spinner />
                  )}
                </Code>
              </Tooltip>
              {isTransferingData && dataLength && (
                <HStack w="full" spacing={4}>
                  <Spinner size="sm" />
                  <Progress
                    w="full"
                    value={((currentTransferIndex + 1) / dataLength) * 100}
                    borderRadius="md"
                  />
                </HStack>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter mt={4}>
            <Button onClick={onCopyUrl} mr={2} size="sm">
              {hasCopiedUrl && <CheckIcon mr={2} />}
              Copy URL
            </Button>
            <Button colorScheme="red" onClick={() => cleanUp()} size="sm">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button
        w="full"
        size="sm"
        colorScheme="blue"
        onClick={() => requestDirectTransferForSender(mailboxes)}
      >
        <Icon as={FiUpload} mr={2} /> Share mailbox data wirelessly
      </Button>
    </>
  );
}

export function WRTCDataShareButtonReceive({
  setMailboxes,
}: {
  setMailboxes: Dispatch<SetStateAction<MailboxData[]>>;
}) {
  const {
    requestDirectTransferForReceiver,
    isAcceptingConnections,
    isTransferingData,
    dataReceived,
    dataLength,
    cleanUp,
  } = useDirectTransferReceiver<MailboxData>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [input, setInput] = useState("");
  const [searchParams] = useSearchParams();

  const focusRef = useRef(null);

  useEffect(() => {
    setInput(input.replace(/\s+/g, "").replace(/[^\w-]+/g, ""));
  }, [input]);

  useEffect(() => {
    const providedId = searchParams.get("transferFrom");

    if (!providedId) return;

    onOpen();
    setInput(providedId);
    requestDirectTransferForReceiver(providedId);
  }, [searchParams]);

  useEffect(() => {
    if (
      dataLength === 0 ||
      dataReceived.length === 0 ||
      dataReceived.length !== dataLength
    )
      return;

    setInput("");
    setMailboxes(dataReceived);
    onClose();
  }, [dataReceived]);

  return (
    <>
      <Modal
        initialFocusRef={focusRef}
        isOpen={isOpen}
        onClose={() => {
          setInput("");
          cleanUp();
          onClose();
        }}
        size="sm"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody px={5}>
            <VStack spacing={4} mx={2}>
              <HStack>
                <Icon as={TbDevices} boxSize="1.2em" />
                <Icon as={BsArrowRight} boxSize="1.2em" />
                <Icon as={TbDevices} boxSize="1.5em" />
              </HStack>
              <Text textAlign="center">Enter your connection code:</Text>
              <Input
                ref={focusRef}
                py={2}
                px={5}
                borderRadius="md"
                borderWidth="thin"
                style={{ letterSpacing: "0.1em" }}
                color="blue.500"
                fontFamily="mono"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck={false}
                textAlign="center"
              />
              {isTransferingData && dataLength ? (
                <HStack w="full" spacing={4}>
                  <Spinner size="sm" />
                  <Progress
                    w="full"
                    value={((dataReceived.length + 1) / dataLength) * 100}
                    borderRadius="md"
                  />
                </HStack>
              ) : (
                <Button
                  isLoading={isAcceptingConnections}
                  onClick={() => {
                    requestDirectTransferForReceiver(input);
                  }}
                >
                  Connect
                </Button>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter mt={4}>
            <Button
              colorScheme="red"
              onClick={() => {
                setInput("");
                cleanUp();
                onClose();
              }}
              size="sm"
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button w="full" size="sm" colorScheme="blue" onClick={onOpen}>
        <Icon as={FiDownload} mr={2} /> Get data wirelessly
      </Button>
    </>
  );
}
