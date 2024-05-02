import React, { useEffect, useState } from "react";
import { ContractAbi__factory } from "../contracts-api";
import { fetchProposalCount } from "./contractUtils";

interface ProposalCountProps {
  wallet: any; // Adjust the type of wallet as per your application
}

const CONTRACT_ID = "";

const ProposalCount: React.FC<ProposalCountProps> = ({ wallet }) => {
  const [proposalCount, setProposalCount] = useState<number | null>(null);

  const handleFetchProposalCount = async () => {
    try {
      if (!wallet) throw new Error("Wallet is not available");
      const contractInstance = ContractAbi__factory.connect(CONTRACT_ID, wallet);
      const count = await fetchProposalCount(contractInstance);
      setProposalCount(Number(count));
    } catch (error) {
      console.error("Error fetching proposal count:", error);
    }
  };

  // Fetch proposal count on component mount
  useEffect(() => {
    handleFetchProposalCount();
  }, [wallet]);

  return (
    <div>
      {proposalCount !== null && (
        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
          Total Proposals: {proposalCount}
        </div>
      )}
    </div>
  );
};

export default ProposalCount;
