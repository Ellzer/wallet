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
  Link,
  LinkBox,
  LinkOverlay,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { FaCheckSquare, FaEthereum, FaTimes } from 'react-icons/fa'
import { useAccount } from 'wagmi'

export default function Transactions() {
  const bg = useColorModeValue('gray.200', 'gray.700')
  const { address } = useAccount()
  const [transactions, setTransactions] = useState([])
  useEffect(() => {
    if (address) {
      const fetchTransactions = async () => {
        const result = await axios.get(`http://localhost:3001/transactions/${address}`)
        setTransactions(result.data)
      }

      fetchTransactions()
    }
  }, [address])

  const truncateString = (s: string) => {
    return `${s.substring(0, 4)}...${s.substring(s.length - 4)}`
  }

  return (
    <>
      <Heading as="h1" p="5" pt="0" fontSize="2xl" letterSpacing="wide" mr="auto">
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
                    <LinkOverlay href={`https://goerli.etherscan.io/tx/${hash}`} isExternal>
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
                    {status === 1 ? (
                      <Icon
                        ml="auto"
                        as={FaCheckSquare}
                        color="green.400"
                        position="relative"
                        top="0.5"
                      />
                    ) : (
                      <Icon as={FaTimes} color="red" position="relative" top="0.5" />
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
  )
}