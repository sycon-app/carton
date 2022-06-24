import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  useDisclosure,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  Accordion,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { ForceColorMode } from "lib/components/ForceColorMode";
import type { MailboxData } from "lib/structs/Mailbox";
import { Mailbox } from "lib/structs/Mailbox";

import FilterListItem from "./FilterListItem";

export default function BoxFilter({
  colorMode,
  mailboxes,
}: {
  colorMode: "light" | "dark";
  mailboxes: MailboxData[];
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const searchOptimizedMailboxes = useMemo(
    () =>
      mailboxes.map((mailbox) => ({
        id: mailbox.id,
        persons: [
          ...mailbox.applicants.flatMap((applicant) => [
            applicant.name.full.toUpperCase(),
            ...applicant.minors.map((minor) => minor.name.full.toUpperCase()),
            ...applicant.businesses.flatMap((business) =>
              business.members.map((member) => member.name.full.toUpperCase())
            ),
          ]),
        ],
        businesses: [
          ...mailbox.applicants.flatMap((applicant) =>
            applicant.businesses.map((business) => business.name.toUpperCase())
          ),
        ],
      })),
    [mailboxes]
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<
    "ALL" | "PERSONS" | "BUSINESSES"
  >("ALL");

  const filteredMailboxes = useMemo(() => {
    return searchOptimizedMailboxes
      .filter((data) => {
        let isValid = false;

        if (searchTerm === "") {
          return isValid;
        }

        if (searchType === "PERSONS" || searchType === "ALL") {
          isValid = data.persons.some((person) => person.includes(searchTerm));
        }

        if (searchType === "BUSINESSES" || (searchType === "ALL" && !isValid)) {
          isValid = data.businesses.some((business) =>
            business.includes(searchTerm)
          );
        }

        return isValid;
      })
      .flatMap((data) => {
        const match = mailboxes.find((mb) => mb.id === data.id);
        if (!match) return [];

        return [Mailbox.fromJSON(match)];
      });
  }, [searchTerm, searchType, mailboxes, searchOptimizedMailboxes]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody pt={4}>
            <InputGroup>
              <Input
                placeholder="Search mailboxes by..."
                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
              />
              <InputRightAddon>
                <Select
                  border="none"
                  onChange={(e) =>
                    setSearchType(
                      e.target.value as "ALL" | "PERSONS" | "BUSINESSES"
                    )
                  }
                >
                  <option value="ALL">Any name</option>
                  <option value="PERSONS">Person name</option>
                  <option value="BUSINESSES">Business name</option>
                </Select>
              </InputRightAddon>
            </InputGroup>
            <Accordion mt={4}>
              {filteredMailboxes.slice(0, 20).map((mailbox) => (
                <FilterListItem
                  key={mailbox.id}
                  mailbox={mailbox}
                  colorMode={colorMode}
                />
              ))}
            </Accordion>
          </ModalBody>
        </ModalContent>
      </Modal>

      <ForceColorMode darkMode={colorMode === "light"}>
        <Button colorScheme="blue" onClick={onOpen} w="full">
          Search mailbox applicants
        </Button>
      </ForceColorMode>
    </>
  );
}
