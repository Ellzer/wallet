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
import axios from 'axios'
import { utils } from 'ethers'
import { FC, useEffect, useState } from 'react'
import {
  useAccount,
  useBalance,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from 'wagmi'
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

  // const { config, data, status, error } = usePrepareSendTransaction({
  const { config } = usePrepareSendTransaction({
    request: {
      to: to,
      value: amount ? utils.parseEther(amount) : undefined,
      gasLimit: 0,
    },
  })

  // const { sendTransaction, data, isLoading } = useSendTransaction({
  // const { sendTransaction, status } = useSendTransaction({
  const { sendTransaction, isLoading } = useSendTransaction({
    ...config,
    // async onSettled(data, error) {
    //   await data?.wait(0)
    //   console.log('onSettled 0 block', data)
    //   await data?.wait(1)
    //   console.log('onSettled 1 block', data)
    // },
    async onSuccess(data) {
      const test = await axios.post('http://localhost:3001/transactions', {
        hash: data.hash,
      })
      console.log('test', test)
    },
    async onError(error) {
      const test = await axios.get('http://localhost:3001')
      console.log('test', test)
    },
  })

  // const {
  //   status: wftStatus,
  //   data: wftData,
  //   isError: wftError,
  //   isLoading: wftIsLoading,
  //   isFetched: wftIsFetched,
  //   isIdle: wftIsIdle,
  //   isSuccess: wftIsSuccess,
  // } = useWaitForTransaction({
  //   hash: data?.hash,
  // })

  // useEffect(() => {
  //   console.log('useEffect', wftData)
  // }, [wftData])

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
        {/* <Button
          onClick={async () => {
            const test = await axios('http://localhost:3001')
            console.log('test', test)
          }}
        ></Button> */}
        {/* <Heading as="h1" fontSize="2xl" letterSpacing="wide">
          hash: {JSON.stringify(data?.hash)}
        </Heading>
        <Heading as="h1" fontSize="2xl" letterSpacing="wide">
          wftStatus: {wftStatus}
        </Heading>
        <Heading as="h1" fontSize="2xl" letterSpacing="wide">
          wftError: {JSON.stringify(wftError)}
        </Heading>
        <Heading as="h1" fontSize="2xl" letterSpacing="wide">
          wftIsLoading: {JSON.stringify(wftIsLoading)}
        </Heading>
        <Heading as="h1" fontSize="2xl" letterSpacing="wide">
          wftIsFetched: {JSON.stringify(wftIsFetched)}
        </Heading>
        <Heading as="h1" fontSize="2xl" letterSpacing="wide">
          wftIsIdle: {JSON.stringify(wftIsIdle)}
        </Heading>
        <Heading as="h1" fontSize="2xl" letterSpacing="wide">
          wftIsSuccess: {JSON.stringify(wftIsSuccess)}
        </Heading> */}
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

export default SendETH
