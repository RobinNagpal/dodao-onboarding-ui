import { ethers } from 'ethers';

export const formatWallet = async wallet => {
  let tokenName = null;
  let tokenSymbol = null;
  let formattedBalance: string | null = null;
  const provider = ethers.getDefaultProvider(ethers.providers.getNetwork(wallet.chainId));

  // The ERC-20 Contract ABI, which is a common contract interface
  // for tokens (this is the Human-Readable ABI format)
  const daiAbi = [
    // Some details about the token
    'function name() view returns (string)',
    'function symbol() view returns (string)',

    // Get the account balance
    'function balanceOf(address) view returns (uint)',

    // Send some of your tokens to someone else
    'function transfer(address to, uint amount)',

    // An event triggered whenever anyone transfers to someone else
    'event Transfer(address indexed from, address indexed to, uint amount)'
  ];

  // The Contract object
  const tokenContract = new ethers.Contract(wallet.tokenContractAddress, daiAbi, provider);

  console.log('tokenContract', tokenContract);
  try {
    // Get the ERC-20 token name
    tokenName = await tokenContract?.name();
  } catch (e) {
    console.error(e);
  }
  try {
    // Get the ERC-20 token symbol (for tickers and UIs)
    tokenSymbol = await tokenContract?.symbol();
  } catch (e) {
    console.error(e);
  }

  try {
    // Get the balance of an address
    const balance = await tokenContract?.balanceOf(wallet.walletAddress);
    // { BigNumber: "3118000455884268201631" }

    // Format the Token for displaying to the user
    formattedBalance = ethers.utils.formatUnits(balance, 18);
  } catch (e) {
    console.error(e);
  }
  return {
    ...wallet,
    tokenName,
    tokenSymbol,
    balance: formattedBalance
  };
}