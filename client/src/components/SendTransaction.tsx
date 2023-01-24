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
  Icon,
} from '@chakra-ui/react'
import axios from 'axios'
import { utils } from 'ethers'
import { FC, useState } from 'react'
import { FaEthereum } from 'react-icons/fa'
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
      {isLoading ? (
        'Fetching balance...'
      ) : (
        <>
          Balance: {balance?.formatted} <Icon as={FaEthereum} position="relative" top="0.5" />
        </>
      )}
    </Text>
  )
}

const SendTransaction: FC<{ setRefreshTransactions: (arg: boolean) => void }> = ({
  setRefreshTransactions,
}) => {
  const { address, isConnected } = useAccount()
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')

  const { config } = usePrepareSendTransaction({
    request: {
      to: to,
      value: amount ? utils.parseEther(amount) : undefined,
      gasLimit: 0,
    },
  })

  const { sendTransaction, isLoading } = useSendTransaction({
    ...config,
    async onSuccess(data) {
      await axios.post('http://localhost:3001/transactions', {
        hash: data.hash,
      })
      setRefreshTransactions(true)
      await data.wait(1)
      setRefreshTransactions(true)
    },
  })

  function handleAmountOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    let formattedValue = e.target.value.replace(/[^0-9.]|\.(?=.*\.)/g, '')
    const [integer, decimals] = formattedValue.split('.')
    setAmount(decimals?.length > -1 ? `${integer}.${decimals.slice(0, 18)}` : integer)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    sendTransaction?.()
  }

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
      <form onSubmit={handleSubmit}>
        <CardBody>
          <Stack w="sm" mx="auto" spacing="6">
            <Flex justify="space-between" align="baseline">
              <Heading as="h2" fontWeight="normal" fontSize="xl">
                Send ETH
              </Heading>
              {address && <Balance address={address} />}
            </Flex>
            <FormControl>
              <FormLabel htmlFor="amount">Amount</FormLabel>
              <Input
                name="amount"
                fontSize="sm"
                type="text"
                onChange={handleAmountOnChange}
                value={amount}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="address">Address</FormLabel>
              <Input
                name="address"
                fontSize="sm"
                type="text"
                onChange={(e) => setTo(e.target.value)}
                value={to}
              />
            </FormControl>
          </Stack>
        </CardBody>
        <CardFooter>
          <Button
            type="submit"
            isDisabled={!isConnected || !sendTransaction || !to || !amount}
            isLoading={isLoading}
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

export default SendTransaction
