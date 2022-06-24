import {
  AccordionItem,
  AccordionButton,
  Box,
  Heading,
  AccordionIcon,
  AccordionPanel,
  Input,
  Accordion,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useMemo, useReducer } from "react";

import type { Mailbox } from "../../../structs/Mailbox";
import { ForceColorMode } from "lib/components/ForceColorMode";

export default function MetaSearch({
  colorMode,
  mailboxes,
}: {
  colorMode: "light" | "dark";
  mailboxes: Mailbox[];
}) {
  const boxNumberIndexedMailboxes = useMemo(() => {
    const obj: { [key: number]: Mailbox[] } = {};

    mailboxes.forEach((mb) => {
      if (!obj[mb.number]) {
        obj[mb.number] = [];
      }

      obj[mb.number].push(mb);
    });

    return obj;
  }, [mailboxes]);

  const [foundMailboxes, findBoxesByNumber] = useReducer(
    (state: Mailbox[], searchTerm: number) => {
      return boxNumberIndexedMailboxes[searchTerm] ?? [];
    },
    []
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent pt={4}>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Search by box number"
              onChange={(e) => findBoxesByNumber(Number(e.target.value))}
            />
            <Accordion mt={4}>
              {foundMailboxes.map((mailbox) => (
                <AccordionItem key={mailbox.id}>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Heading as="h5" size="sm">
                        {mailbox.number} - {mailbox.primaryHolder.name.full}
                      </Heading>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <TableContainer>
                      <Table size="sm">
                        <Thead>
                          <Tr>
                            <Th
                              color={
                                colorMode === "light" ? "blue.500" : "blue.400"
                              }
                            >
                              Applicants
                            </Th>
                            <Th>Home</Th>
                            <Th>Cell</Th>
                            <Th>Work</Th>
                            <Th>Fax</Th>
                            <Th>Email</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {mailbox.applicants.map((applicant) => (
                            <Tr key={applicant.id}>
                              <Td>{applicant.name.full}</Td>
                              <Td>{applicant.phoneNumber.home || ""}</Td>
                              <Td>{applicant.phoneNumber.cell || ""}</Td>
                              <Td>{applicant.phoneNumber.work || ""}</Td>
                              <Td>{applicant.phoneNumber.fax || ""}</Td>
                              <Td>{applicant.email || ""}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                    {mailbox.minors.length > 0 && (
                      <TableContainer>
                        <Table size="sm">
                          <Thead>
                            <Tr>
                              <Th
                                color={
                                  colorMode === "light"
                                    ? "blue.500"
                                    : "blue.400"
                                }
                              >
                                Minors
                              </Th>
                              <Th>Home</Th>
                              <Th>Cell</Th>
                              <Th>Work</Th>
                              <Th>Fax</Th>
                              <Th>Email</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {mailbox.minors.map((minor) => (
                              <Tr key={minor.id}>
                                <Td>{minor.name.full}</Td>
                                <Td />
                                <Td />
                                <Td />
                                <Td />
                                <Td />
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    )}
                    {mailbox.businesses.length > 0 && (
                      <TableContainer>
                        <Table size="sm">
                          <Thead>
                            <Tr>
                              <Th
                                color={
                                  colorMode === "light"
                                    ? "blue.500"
                                    : "blue.400"
                                }
                              >
                                Businesses
                              </Th>
                              <Th>Home</Th>
                              <Th>Cell</Th>
                              <Th>Work</Th>
                              <Th>Fax</Th>
                              <Th>Email</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {mailbox.businesses.map((business) => (
                              <Tr key={business.id}>
                                <Td>{business.name}</Td>
                                <Td />
                                <Td />
                                <Td>{business.phoneNumber || ""}</Td>
                                <Td />
                                <Td />
                              </Tr>
                            ))}
                            {mailbox.businesses.flatMap((business) =>
                              business.members.map((member) => (
                                <Tr
                                  key={member.id}
                                  color={
                                    colorMode === "light"
                                      ? "blackAlpha.800"
                                      : "whiteAlpha.800"
                                  }
                                >
                                  <Td>- {member.name.full}</Td>
                                  <Td />
                                  <Td />
                                  <Td />
                                  <Td />
                                  <Td />
                                </Tr>
                              ))
                            )}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    )}
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </ModalBody>
        </ModalContent>
      </Modal>

      <ForceColorMode darkMode={colorMode === "light"}>
        <Button colorScheme="blue" onClick={onOpen} w="full">
          Find box by Number
        </Button>
      </ForceColorMode>
    </>
  );
}
