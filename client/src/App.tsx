import { VStack, Container, Divider } from '@chakra-ui/react'
import ColorModeSwitcher from './components/ColorModeSwitcher'
import SendETH from './components/SendTransaction'

export default function App() {
  return (
    <VStack minH="100vh">
      <ColorModeSwitcher ml="auto" />
      <Container maxW="xl" centerContent>
        <SendETH />
        <Divider my="10" />
      </Container>
    </VStack>
  )
}
