import React, { useEffect, useState, useRef } from "react";
import { useConnectUI, useIsConnected, useWallet } from "@fuels/react";
import { ContractAbi__factory } from "../contracts-api";
import { ProposalInput } from "../contracts-api/contracts/ContractAbi";
import type { ContractAbi } from "../contracts-api/contracts/ContractAbi";
import { fetchBalance, getUserAddress } from "./contractUtils"; 
import ProposalCount from "./proposalCount";
import styles from "./styles";

const CONTRACT_ID = "";


const Home: React.FC = () => {
  const [userAddress, setUserAddress] = useState<string>("");
  const [contract, setContract] = useState<ContractAbi>();
  const [showProposalCount, setShowProposalCount] = useState(false);
  const [proposalIdInput, setProposalIdInput] = useState<string>("");
  const [proposals, setProposals] = useState<any[]>([]); 
  const { connect, isConnecting } = useConnectUI();
  const { isConnected } = useIsConnected();
  const { wallet } = useWallet();
  const [acceptancePercentage, setAcceptancePercentage] = useState<number>(50);
  const [duration, setDuration] = useState<number>(7);
  const [proposalTransaction, setProposalTransaction] = useState<ProposalInput>({
    amount: 0,
    asset: { value: "" },
    call_data: { arguments: 0, function_selector: 0, id: { value: "" } },
    gas: 10000,
  });
  const [activeTab, setActiveTab] = useState<string>('create');
  const [userBalance, setUserBalance] = useState<number>(0);

  // useRef to persist isInitialized value across renders
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isConnected && wallet && !isInitializedRef.current) {
      const initializeContract = async () => {
        try {
          const contractInstance = ContractAbi__factory.connect(CONTRACT_ID, wallet);
          setContract(contractInstance);
          await fetchBalance(contractInstance, setUserBalance);
          const address = await getUserAddress(wallet);
          setUserAddress(address);
          isInitializedRef.current = true;
        } catch (error) {
          console.error("Error initializing contract:", error);
        }
      };

      initializeContract();
    }
  }, [isConnected, wallet]);

  

  const fetchProposals = async (
    contractInstance: ContractAbi,
    proposalId: string
  ) => {
    try {
      const proposal = await contractInstance.functions
        .proposal(proposalId)
        .call();
      if (proposal) {
        setProposals([proposal]);
      } else {
        setProposals([]);
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
  };

  const createProposal = async () => {
    try {
      if (!contract) throw new Error("Contract instance is not available");

 
      if (!wallet || !wallet.address) throw new Error("Wallet address is not available");
      const setProposalTransaction = {
        amount: acceptancePercentage,
        asset: { value: wallet.address.toB256() },
        call_data: {
          arguments: 123,
          function_selector: 456,
          id: { value: wallet.address.toB256()},
        },
        gas: 10000,
      };
      contract.functions.create_proposal(
        acceptancePercentage,
        duration,
        setProposalTransaction
      ).call();
      console.log("Proposal created successfully");
    } catch (error) {
      console.error("Error creating proposal:", error);
    }
  };

  const voteOnProposal = async (proposalId: string) => {
    try {
      const voteAmount = await getVoteAmount();
      contract?.functions.vote(true, proposalId, voteAmount);
    } catch (error) {
      console.error("Error voting on proposal:", error);
    }
  };

  const getVoteAmount = async () => {
    return 0;
  };


  // const handleFetchProposalCount = () => {
  //   setShowProposalCount(true);
  // };

  return (
    <div style={styles.root}>
      <div style={styles.container}>
      {isConnected && wallet && <ProposalCount wallet={wallet} />}
        {/* Rest of your component */}
        {/* Display proposal count */}
        {/* <div style={{ ...styles.userInfo, position: 'absolute', top: '10px', right: '10px' }}>Total Proposals: {ProposalCount}</div> */}
        {/* Display user address if connected */}
        {isConnected && userAddress && <div style={{ ...styles.userInfo, marginBottom: '10px' }}>User Address: {userAddress}</div>}
        {/* Display user balance */}
        {userBalance !== null && <div style={styles.userInfo}>User Balance: {userBalance}</div>}
        {isConnected ? (
          <>
            <div style={styles.tabContainer}>
              <div
              className="text=3xl"
                style={{
                  ...styles.tab,
                  ...(activeTab === "create" && styles.activeTab),
                }}
                onClick={() => setActiveTab("create")}
              >
                Create Proposal
              </div>
              <div
                style={{
                  ...styles.tab,
                  ...(activeTab === "vote" && styles.activeTab),
                }}
                onClick={() => setActiveTab("vote")}
              >
                Vote on Proposals
              </div>
            </div>
            {activeTab === "create" && (
              <>
                <label>Acceptance Percentage:</label>
                <input
                  type="number"
                  value={acceptancePercentage}
                  onChange={(e) =>
                    setAcceptancePercentage(parseInt(e.target.value))
                  }
                />
                <label>Duration:</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                />
                <label>Proposal Amount:</label>
                <input
                  type="number"
                  value={proposalTransaction.amount.toString()}
                  onChange={(e) =>
                    setProposalTransaction({
                      ...proposalTransaction,
                      amount: parseInt(e.target.value),
                    })
                  }
                />
                <button onClick={createProposal}>Create Proposal</button>
              </>
            )}
            {activeTab === "vote" && (
              <>
                <h3 style={styles.label}>Available Proposals</h3>
                <div>
                  <label>Proposal ID:</label>
                  <input
                    type="text"
                    value={proposalIdInput}
                    onChange={(e) => setProposalIdInput(e.target.value)}
                  />
                  <button
                    onClick={() =>
                      contract && fetchProposals(contract, proposalIdInput)
                    }
                  >
                    Fetch Proposal
                  </button>
                </div>
                {proposals.map((proposal: any) => (
                  <div key={proposal.id} style={{ marginBottom: "10px" }}>
                    <div>{proposal.text}</div>
                    <button
                      onClick={() => voteOnProposal(proposal.id)}
                      style={styles.button}
                    >
                      Vote
                    </button>
                  </div>
                ))}
              </>
            )}
          </>
        ) : (
          <button onClick={connect} style={styles.button}>
            {isConnecting ? "Connecting" : "Connect"}
          </button>
        )}
      </div>
    </div>
  );  
};

export default Home;
