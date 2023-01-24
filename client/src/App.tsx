import { VStack, Container, Divider } from '@chakra-ui/react'
import ColorModeSwitcher from './components/ColorModeSwitcher'
import SendTransaction from './components/SendTransaction'
import Transactions from './components/Transactions'

export default function App() {
  return (
    <VStack minH="100vh">
      <ColorModeSwitcher ml="auto" />
      <Container maxW="xl" centerContent>
        <SendTransaction />
        <Divider my="10" />
        <Transactions />
      </Container>
    </VStack>
  )
}
