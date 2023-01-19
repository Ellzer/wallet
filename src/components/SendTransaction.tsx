import {
  Card,
  CardHeader,
  Flex,
  Heading,
  CardBody,
  Stack,
  FormControl,
  FormLabel,
  Input,
  CardFooter,
  Button,
  Text,
} from '@chakra-ui/react'
import { utils } from 'ethers'
import { FC, useState } from 'react'
import { useAccount, useBalance, usePrepareSendTransaction, useSendTransaction } from 'wagmi'
import ConnectWallet from './ConnectWallet'

const Balance: FC<{ address: `0x${string}` }> = ({ address }) => {
  const { data: balance, isLoading } = useBalance({
    address,
    watch: true,
    onError(error) {
      console.error('Error fetching balance: ', error)
    },
  })

  return (
    <Text fontSize="xs">
      {isLoading ? 'Fetching balance...' : `Balance: ${balance?.formatted} ${balance?.symbol}`}
    </Text>
  )
}

const SendETH: FC = () => {
  const { address, isConnected } = useAccount()
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')

  const { config } = usePrepareSendTransaction({
    request: {
      to: to,
      value: amount ? utils.parseEther(amount) : undefined,
    },
  })
  const { sendTransaction } = useSendTransaction(config)

  return (
    <Card shadow="xl" w="full">
      <CardHeader>
        <Flex justify="space-between" align="baseline">
          <Heading as="h1" fontSize="2xl" letterSpacing="wide">
            Wallet
          </Heading>
          <ConnectWallet />
        </Flex>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          sendTransaction?.()
        }}
      >
        <CardBody>
          <Stack w="sm" mx="auto" spacing="6">
            <Flex justify="space-between" align="baseline">
              <Heading as="h2" fontWeight="normal" fontSize="xl">
                Send ETH
              </Heading>
              {address && <Balance address={address} />}
            </Flex>
            <FormControl>
              <FormLabel>Amount</FormLabel>
              <Input
                fontSize="sm"
                type="text"
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input fontSize="sm" type="text" onChange={(e) => setTo(e.target.value)} value={to} />
            </FormControl>
          </Stack>
        </CardBody>
        <CardFooter>
          <Button
            type="submit"
            isDisabled={!isConnected || !sendTransaction || !to || !amount}
            colorScheme="orange"
            size="lg"
            w="sm"
            mx="auto"
          >
            Send
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default SendETH
