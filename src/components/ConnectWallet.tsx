import { FC } from 'react'
import { goerli, useAccount, useBalance, useConnect, useDisconnect } from 'wagmi'
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react'
import { FaSignOutAlt } from 'react-icons/fa'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

const ConnectWallet: FC = () => {
  const { address, isConnected } = useAccount()
  const { connect, isLoading } = useConnect({
    connector: new MetaMaskConnector({
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    chainId: goerli.id,
  })
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <Popover placement="bottom" matchWidth>
        <PopoverTrigger>
          <Button w="40">{`${address?.slice(0, 6)}...${address?.slice(38, 42)}`}</Button>
        </PopoverTrigger>
        <PopoverContent w="fit-content" _focus={{ boxShadow: 'none' }}>
          <PopoverArrow />
          <Button
            w="40"
            size="sm"
            onClick={() => disconnect()}
            variant="ghost"
            leftIcon={<FaSignOutAlt />}
          >
            Disconnect
          </Button>
        </PopoverContent>
      </Popover>
    )
  } else {
    return (
      <Button isLoading={isLoading} w="40" onClick={() => connect()}>
        {!isLoading ? 'Connect wallet' : 'pending'}
      </Button>
    )
  }
}

export default ConnectWallet
