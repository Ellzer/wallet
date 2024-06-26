import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  TableContainer,
  Heading,
  Icon,
  LinkBox,
  LinkOverlay,
  Text,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { FaCheckSquare, FaEthereum, FaTimes } from "react-icons/fa";
import { useAccount, useWaitForTransaction } from "wagmi";

const Transactions: FC<{
  refreshTransactions: boolean;
  setRefreshTransactions: (arg: boolean) => void;
}> = ({ refreshTransactions, setRefreshTransactions }) => {
  const { address } = useAccount();
  const [pendingHash, setPendingHash] = useState<`0x${string}`>();
  const [transactions, setTransactions] = useState([]);
  const bg = useColorModeValue("gray.200", "gray.700");

  // if there is a pending tx, wait for it to be resolved then refresh transactions
  useWaitForTransaction({
    confirmations: 1,
    hash: pendingHash ? pendingHash : undefined,
    onSettled() {
      setRefreshTransactions(true);
    },
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      const result = await axios.get(
        `http://localhost:3001/transactions/${address}`,
      );
      setTransactions(result.data);
      setRefreshTransactions(false);

      if (result.data.length > 0) {
        const transaction = result.data.find(
          ({ status }: { status: number }) => status === 2,
        );
        if (transaction?.hash) {
          setPendingHash(transaction.hash);
        }
      }
    };

    if (address || (refreshTransactions && address)) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [address, refreshTransactions, setRefreshTransactions]);

  const truncateString = (s: string) => {
    return `${s.substring(0, 4)}...${s.substring(s.length - 4)}`;
  };

  return (
    <>
      <Heading
        as="h1"
        p="5"
        pt="0"
        fontSize="2xl"
        letterSpacing="wide"
        mr="auto"
      >
        Transactions
      </Heading>
      {transactions.length > 0 ? (
        <TableContainer w="full">
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>hash</Th>
                <Th>from</Th>
                <Th>to</Th>
                <Th>amount</Th>
                <Th>status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map(({ hash, from, to, amount, status }) => (
                <LinkBox as={Tr} key={hash} _hover={{ bg }}>
                  <Td>
                    <LinkOverlay
                      href={`https://sepolia.etherscan.io/tx/${hash}`}
                      isExternal
                    >
                      {truncateString(hash)}
                    </LinkOverlay>
                  </Td>
                  <Td>{truncateString(from)}</Td>
                  <Td>{truncateString(to)}</Td>
                  <Td>
                    {amount}
                    <Icon as={FaEthereum} position="relative" top="0.5" />
                  </Td>
                  <Td textAlign="center">
                    {status === 0 ? (
                      <Icon
                        as={FaTimes}
                        color="red"
                        position="relative"
                        top="0.5"
                      />
                    ) : status === 1 ? (
                      <Icon
                        as={FaCheckSquare}
                        color="green.400"
                        position="relative"
                        top="0.5"
                      />
                    ) : (
                      <Spinner
                        size="xs"
                        color="orange"
                        position="relative"
                        top="1px"
                      />
                    )}
                  </Td>
                </LinkBox>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Text>There are no transactions to display</Text>
      )}
    </>
  );
};

export default Transactions;
