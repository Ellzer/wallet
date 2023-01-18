import {
  VStack,
  Card,
  Stack,
  Heading,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  CardHeader,
  CardFooter,
  Container,
} from '@chakra-ui/react'
import ColorModeSwitcher from './components/ColorModeSwitcher'
import ConnectWallet from './components/ConnectWallet'

export default function App() {
  return (
    <VStack minH="100vh">
      <ColorModeSwitcher ml="auto" />
      <Container maxW="xl" centerContent>
        <Card shadow="xl" w="full">
          <CardHeader>
            <Flex justify="space-between" align="baseline">
              <Heading as="h1" fontSize="2xl" letterSpacing="wide">
                Wallet
              </Heading>
              <ConnectWallet />
            </Flex>
          </CardHeader>
          <form>
            <CardBody>
              <Stack w="sm" mx="auto" spacing="6">
                <Heading as="h2" fontWeight="normal" fontSize="xl">
                  Send ETH
                </Heading>
                <FormControl>
                  <FormLabel size="xl">Amount</FormLabel>
                  <Input type="text" borderRadius="6px" />
                </FormControl>
                <FormControl>
                  <FormLabel size="sm">Address</FormLabel>
                  <Input type="text" borderRadius="6px" />
                </FormControl>
              </Stack>
            </CardBody>
            <CardFooter>
              <Button colorScheme="orange" size="lg" w="sm" mx="auto">
                Send
              </Button>
            </CardFooter>
          </form>
        </Card>
      </Container>
    </VStack>
  )
}
