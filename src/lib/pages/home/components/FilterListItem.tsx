import {
  AccordionItem,
  AccordionButton,
  Box,
  Heading,
  AccordionIcon,
  AccordionPanel,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";

import type { Mailbox } from "../../../structs/Mailbox";

export default function FilterListItem({
  mailbox,
  colorMode,
}: {
  mailbox: Mailbox;
  colorMode: "light" | "dark";
}) {
  return (
    <AccordionItem>
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
                <Th color={colorMode === "light" ? "blue.500" : "blue.400"}>
                  Applicants
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {mailbox.applicants.map((applicant) => (
                <Tr key={applicant.id}>
                  <Td>{applicant.name.full}</Td>
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
                  <Th color={colorMode === "light" ? "blue.500" : "blue.400"}>
                    Minors
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {mailbox.minors.map((minor) => (
                  <Tr key={minor.id}>
                    <Td>{minor.name.full}</Td>
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
                  <Th color={colorMode === "light" ? "blue.500" : "blue.400"}>
                    Businesses
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {mailbox.businesses.map((business) => (
                  <Tr key={business.id}>
                    <Td>{business.name}</Td>
                  </Tr>
                ))}
                {mailbox.businesses.flatMap((business) =>
                  business.members.map((member) => (
                    <Tr key={member.id}>
                      <Td
                        color={
                          colorMode === "light"
                            ? "blackAlpha.800"
                            : "whiteAlpha.800"
                        }
                      >
                        - {member.name.full}
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
}
