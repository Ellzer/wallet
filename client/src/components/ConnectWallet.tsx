import { FC } from "react";
import { sepolia, useAccount, useConnect, useDisconnect } from "wagmi";
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { FaSignOutAlt } from "react-icons/fa";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

const ConnectWallet: FC = () => {
  const { address, isConnected } = useAccount();
  const { connect, isLoading } = useConnect({
    connector: new MetaMaskConnector({
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    chainId: sepolia.id,
  });
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <Popover placement="bottom" matchWidth>
        <PopoverTrigger>
          <Button w="40">{`${address.substring(0, 5)}...${address.substring(
            address.length - 4,
          )}`}</Button>
        </PopoverTrigger>
        <PopoverContent w="fit-content" _focus={{ boxShadow: "none" }}>
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
    );
  } else {
    return (
      <Button isLoading={isLoading} w="40" onClick={() => connect()}>
        {!isLoading ? "Connect wallet" : "pending"}
      </Button>
    );
  }
};

export default ConnectWallet;
