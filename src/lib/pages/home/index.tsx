/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
import {
  AddIcon,
  QuestionOutlineIcon,
  ExternalLinkIcon,
  CheckIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useColorMode,
  useToast,
  VStack,
  Text,
  HStack,
  Spacer,
  Spinner,
  Link,
  Kbd,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useClipboard,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { ForceColorMode } from "../../components/ForceColorMode";
import useFileHandler, {
  downloadTextFile,
  getTextFromFile,
} from "../../util/hooks/useFileHandler";
import useMailboxData from "../../util/hooks/useMailboxData";
import { Mailbox } from "lib/structs/Mailbox";

import BoxFilter from "./components/BoxFilter";
import MetaSearch from "./components/MetaSearch";
import {
  WRTCDataShareButtonReceive,
  WRTCDataShareButtonSend,
} from "./components/WRTCDataShareButton";

const openFile = (filename: string, text: string) => {
  const printwindow = window.open("", "PRINT", "height=400,width=600");

  if (!printwindow) return;

  printwindow.document.write("<head></head><body><pre>");
  printwindow.document.write(text);
  printwindow.document.write("</pre></body></html>");
  printwindow.document.close(); // necessary for IE >= 10
  printwindow.focus(); // necessary for IE >= 10
  printwindow.print();
  printwindow.close();
};

const validationColor = (
  isValidData: boolean | null,
  colorMode: "light" | "dark",
  defaultCallback?: (colorMode: "light" | "dark") => string
) => {
  if (isValidData === null) return defaultCallback?.(colorMode);

  const suffix = colorMode === "light" ? "400" : "500";
  const prefix = isValidData === true ? "green" : "red";

  return `${prefix}.${suffix}`;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const Home = () => {
  const { centerNum } = useParams();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const [fileName, setFileName] = useState("");
  const {
    mailboxes,
    setMailboxes,
    setRawMailboxDataStr,
    isParsing,
    isValidData,
    report,
  } = useMailboxData(centerNum);
  const nonInactiveMailboxes = useMemo(
    () =>
      mailboxes.filter(
        (mailbox) => mailbox.status === "ACTIVE" || mailbox.status === "PENDING"
      ),
    [mailboxes]
  );

  const [isReportLoading] = useState(false);
  const [reportViewContent, setReportViewContent] = useState("");
  const { hasCopied, onCopy } = useClipboard(report);
  const { onChange, onDragOver, onDrop } = useFileHandler({
    allowedFileTypes: ["application/json"],
    badFileTypeCallback: () =>
      toast({
        status: "error",
        title: "File error",
        description: "File must be JSOn",
      }),
    fileSuccessCallbad: async (file) => {
      setFileName(file.name);

      const result = await getTextFromFile(file);

      setRawMailboxDataStr(result);
    },
  });

  useEffect(() => {
    setReportViewContent(report);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /* DEV
  useEffect(() => {
    console.log(mailboxes);
  }, [mailboxes]);
  */

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onCloseComplete={() => setReportViewContent("")}
        scrollBehavior="inside"
        size="full"
      >
        <ModalOverlay />
        <ModalContent height="full">
          <ModalHeader>MBS Report</ModalHeader>
          <ModalCloseButton />
          <ModalBody height="full">
            {reportViewContent.length === 0 ? (
              <Spinner />
            ) : (
              <Textarea
                height="full"
                resize="none"
                isReadOnly
                fontFamily="mono"
                value={reportViewContent}
              />
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex flexWrap="wrap">
        <Box
          flexGrow={2}
          flexShrink={1}
          m={2}
          mx={[0, 2]}
          p={4}
          borderRadius="md"
          backgroundColor={colorMode === "light" ? "gray.800" : "gray.100"}
          color={colorMode === "light" ? "white" : "black"}
        >
          <HStack mb={4}>
            <Heading as="h3" size="sm">
              Upload mailbox data
            </Heading>
            <Spacer />
            <Spinner hidden={!isParsing} />
          </HStack>
          <FormControl mb={4}>
            <FormLabel
              htmlFor="file-input"
              w="full"
              onDragOver={onDragOver}
              onDrop={onDrop}
            >
              <Flex
                direction="column"
                align="center"
                w="full"
                borderRadius="md"
                borderStyle="dotted"
                borderWidth="thin"
                borderColor={validationColor(isValidData, colorMode, (cm) =>
                  cm === "light" ? "gray.200" : "gray.700"
                )}
                p={4}
                transition="0.1s"
                cursor="pointer"
                _hover={{
                  backgroundColor:
                    colorMode === "light" ? "whiteAlpha.100" : "blackAlpha.100",
                }}
                _active={{
                  backgroundColor:
                    colorMode === "light" ? "whiteAlpha.200" : "blackAlpha.200",
                }}
              >
                <AddIcon
                  mb={2}
                  color={validationColor(isValidData, colorMode, (cm) =>
                    cm === "light" ? "gray.200" : "gray.700"
                  )}
                />
                {fileName ? (
                  <Text
                    fontSize="sm"
                    color={validationColor(isValidData, colorMode, (cm) =>
                      cm === "light" ? "gray.200" : "gray.700"
                    )}
                  >
                    {fileName}
                  </Text>
                ) : isValidData !== null ? (
                  <Text
                    fontSize="sm"
                    color={validationColor(isValidData, colorMode, (cm) =>
                      cm === "light" ? "gray.200" : "gray.700"
                    )}
                  >
                    [Pasted from clipboard]
                  </Text>
                ) : (
                  <Text>Upload file</Text>
                )}
              </Flex>
            </FormLabel>
            <Input
              display="none"
              id="file-input"
              type="file"
              onChange={onChange}
            />
          </FormControl>
          <HStack mb={4}>
            <Text>or</Text>
            <ForceColorMode darkMode={colorMode === "light"}>
              <Button
                size="xs"
                variant="outline"
                colorScheme="blue"
                onClick={async () => {
                  const result = await navigator.clipboard
                    .readText()
                    .catch(() => {});

                  if (!result) return;

                  setRawMailboxDataStr(result);
                }}
              >
                Get data from clipboard
              </Button>
            </ForceColorMode>
          </HStack>
          <Text fontSize="xs" mb={1}>
            We recognize your data is private. Nothing will ever be sent to our
            servers.
          </Text>
          <Text fontSize="xs">Current data size: {mailboxes.length} items</Text>
          <VStack mt={4} spacing={2} align="start">
            {mailboxes.length !== 0 && (
              <WRTCDataShareButtonSend mailboxes={mailboxes} />
            )}
            <WRTCDataShareButtonReceive setMailboxes={setMailboxes} />
          </VStack>
        </Box>
        {mailboxes.length > 0 && (
          <Box
            flexGrow={1}
            m={2}
            mx={[0, 2]}
            p={4}
            borderRadius="md"
            backgroundColor={colorMode === "light" ? "gray.800" : "gray.100"}
            color={colorMode === "light" ? "white" : "black"}
          >
            <ForceColorMode darkMode={colorMode === "light"}>
              <HStack mb={4}>
                <Heading as="h3" size="sm">
                  Actions
                </Heading>
                <Spacer />
                <Spinner hidden={!isReportLoading} />
              </HStack>
              <VStack>
                <Button
                  colorScheme="blue"
                  w="full"
                  isDisabled={mailboxes.length < 1}
                  onClick={onOpen}
                >
                  View report
                </Button>
                <Button
                  colorScheme="blue"
                  w="full"
                  isDisabled={mailboxes.length < 1}
                  onClick={() => {
                    openFile(`mbs_report_${Date.now()}.txt`, report);
                  }}
                >
                  Print report
                </Button>
                <Button
                  colorScheme="blue"
                  w="full"
                  isDisabled={mailboxes.length < 1}
                  onClick={() => {
                    downloadTextFile(`mbs_report_${Date.now()}.txt`, report);
                  }}
                >
                  Download report
                </Button>
                <Button
                  colorScheme="blue"
                  w="full"
                  isDisabled={mailboxes.length < 1}
                  onClick={onCopy}
                >
                  {hasCopied ? <CheckIcon /> : "Copy report to clipboard"}
                </Button>
              </VStack>
            </ForceColorMode>
          </Box>
        )}
        {mailboxes.length > 0 && (
          <Box
            flexGrow={1}
            m={2}
            mx={[0, 2]}
            p={4}
            borderRadius="md"
            backgroundColor={colorMode === "light" ? "gray.800" : "gray.100"}
            color={colorMode === "light" ? "white" : "black"}
          >
            <ForceColorMode darkMode={colorMode === "light"}>
              <Heading as="h3" size="sm" mb={4}>
                Tools
              </Heading>
            </ForceColorMode>
            <VStack>
              <BoxFilter
                colorMode={colorMode}
                mailboxes={nonInactiveMailboxes}
              />
              <MetaSearch
                colorMode={colorMode}
                mailboxes={nonInactiveMailboxes.map((mailbox) =>
                  Mailbox.fromJSON(mailbox)
                )}
              />
            </VStack>
          </Box>
        )}
        <Box
          flexBasis="100%"
          m={2}
          mx={[0, 2]}
          p={4}
          borderRadius="md"
          borderWidth="thin"
        >
          <HStack>
            <QuestionOutlineIcon mb={1} />
            <Heading as="h4" size="sm">
              How do I use this?
            </Heading>
          </HStack>
          <Text>
            Make sure you&apos;re signed into{" "}
            <Link
              href="https://manage.theupsstore.com"
              isExternal
              color="teal.500"
            >
              Center Management <ExternalLinkIcon />
            </Link>
            .
            <br />
            Once you are, click{" "}
            <Link
              href="https://manage.theupsstore.com/Mailbox/GetMailboxAgreementList"
              isExternal
              color="teal.500"
            >
              here <ExternalLinkIcon />
            </Link>{" "}
            and save the data by pressing{" "}
            <span>
              <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>
            </span>{" "}
            (or{" "}
            <span>
              <Kbd>Command</Kbd> + <Kbd>S</Kbd>
            </span>{" "}
            on MacOS). Once you have downloaded your data file, upload it here
            using the file upload box above.
            <br />
            Alternatively, you can simply copy all the data on the page using{" "}
            <span>
              <Kbd>Ctrl</Kbd> + <Kbd>A</Kbd> then <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd>
            </span>{" "}
            and then press <strong>Get data from clipboard</strong> in the box
            above.
            <br />
            <br />
            If you need to send mailbox data from one device to another, simply
            press the appropirate buttons at the bottom of the{" "}
            <strong>Upload mailbox data</strong> box. All data is sent via{" "}
            <Link href="https://webrtc.org" isExternal color="teal.500">
              WebRTC <ExternalLinkIcon />
            </Link>
            , meaning your data never touches our servers and gets sent directly
            from one device to another.
          </Text>
        </Box>
      </Flex>
    </>
  );
};

export default Home;
