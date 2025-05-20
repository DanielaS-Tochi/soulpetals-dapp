interface EthereumRequestArguments {
  method: string;
  params?: unknown[];
}

interface EthereumProvider {
  request: (args: EthereumRequestArguments) => Promise<unknown>;
  on: (eventName: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (eventName: string, handler: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
}

interface Window {
  ethereum?: EthereumProvider;
} 