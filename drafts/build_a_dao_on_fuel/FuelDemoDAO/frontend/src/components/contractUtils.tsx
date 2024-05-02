import { ContractAbi } from "../contracts-api";

export const fetchBalance = async (contractInstance: ContractAbi, setUserBalance: (balance: number) => void) => {
  try {
    const balance = await contractInstance.functions.balance().call();
    setUserBalance(Number(balance));
  } catch (error) {
    console.error("Error fetching user balance:", error);
  }
};

// export const withdrawFunds = async (contractInstance: ContractAbi, amount: number, userAddress: string) => {
//   try {
//     // Call the withdrawal function on the smart contract with the specified amount and user address
//     const tx = await contractInstance.functions.withdraw(amount).call();
//     console.log("Withdrawal transaction hash:", tx.transactionResponse);
//     return tx.transactionResponse;
//   } catch (error) {
//     console.error("Error withdrawing funds:", error);
//     throw new Error("Failed to withdraw funds");
//   }
// };


export const getUserAddress = async (wallet: any): Promise<string> => {
  if (wallet) {
    return wallet.address.toAddress();
  } else {
    throw new Error('User wallet is not connected.');
  }
};

export const fetchProposalCount = async (contractInstance: ContractAbi) => {
    try {
      const count = await contractInstance.functions.proposal_count().call();
      console.log(count)
      return count
    } catch (error) {
      console.error("Error fetching proposal count:", error);
    }
  };
