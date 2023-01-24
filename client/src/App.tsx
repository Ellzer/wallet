import { VStack, Container, Divider } from '@chakra-ui/react'
import { useState } from 'react'
import ColorModeSwitcher from './components/ColorModeSwitcher'
import SendTransaction from './components/SendTransaction'
import Transactions from './components/Transactions'

export default function App() {
  const [refreshTransactions, setRefreshTransactions] = useState(false)
  return (
    <VStack minH="100vh">
      <ColorModeSwitcher ml="auto" />
      <Container maxW="xl" centerContent>
        <SendTransaction setRefreshTransactions={setRefreshTransactions} />
        <Divider my="10" />
        <Transactions
          setRefreshTransactions={setRefreshTransactions}
          refreshTransactions={refreshTransactions}
        />
      </Container>
    </VStack>
  )
}
