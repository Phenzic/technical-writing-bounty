[note]: <> ("note to self and file editor, there are certain comments left throughout this file, for the sake of understanding the author's reason for using a certain method of approach, pls feel free to delete once acknowledged or reply edit with a better approach 🥂")

# How to build a DAO on the Fuel Blockchain.

## Introduction

A Decentralized Autonomous Organization (DAO) is considered quite an essential infrastructure in any blockchain.

It is a Decentralized technology that blockchains incorporate into their validation system to automate governance rules.
Precisely, it is an automated organization represented by rules encoded in a computer program that is transparent, controlled by the organization members, and not influenced by any central authority.

On completing this article you will learn how to build a full-stack DAO on the fuel blockchain, you will touch down on the following concepts of development;

1. Writing a DAO smart contract using the sway language.
2. Wallet configuration
3. Compiling and deploying to the fuel blockchain (testnet).
4. Creating your DAO front end.
5. Making contract calls on the frontend Using your contract ABI

## Prerequisites

To follow through this tutorial seamlessly, it is expected that you have the following checked out.

1. Installation of dependencies like `fuel`, `sway` extension on vscode, `rustc`, `cargo`, `rustup` `cargo-generate`.
2. You should have `wsl` installed, if not run `wsl --install`.
3. Knowledge of fuelVM and other fuel tools.
4. Basic concept of blockchain technology.
5. Writing, compiling, and deploying to any monolith blockchain (EVM or non-EVM compatible blockchain).
6. ABIs, Faucets, wallet connect <React or Frontend>.



## Getting Started

Before you delve into the juicy part, here are some concepts to jug your memory on the fuel ecosystem, and help you better understand words you will see throughout this tutorial.

**Fuel**: The Fuel Blockchain is a monolith non-EVM compatible blockchain that...

**FuelVM**: The Fuel Virtual Machnive responsible for 

**Sway**: The sway is a domain-specific language used for writing smart contracts on the fuel blockchain.

**ABI**: These are called Application Binary Interfaces, they are the blueprint, or interaction models of your smart contract, it is a layout of the detailed functionalities in your smart contract, and how to interact with it.

Now that settled, here's where the fun part starts, It's time to get your hands dirty with coding.

## Setting up your Environment

In the next few steps, you will set up your development environment to get started with building your smart contract and the front end of your Dao.

1. Go to your terminal and run the command `wsl` to start your `wsl` terminal

2. Next run the command to generate your new contract directory.

```bash
mkdir Fuel_Dao
cd Fuel_Dao
forc new contract
```

3. Go to your contract directory and run the command `tree .`, and you should get a response similar to the image below.



## Writing your Smart Contract

1. Head to the `main.sw` with the command `cd main.sw` contract file, where you will be implementing your main contracts. Following the next few steps, you will be replacing the code therein.

2. First you define the file as a contract file, and import other contract libraries and interfaces from the following `crates`.

    - `error` - define your error handlers for your contract.
    - `data_structre` - defines blablabla.
    - `events` - defines a library of multiple `structs` to **emit events** when certain instances, or functions are executed on-chain.

    - `utils` - instances that will be emitted on-chain certain events.
    - `interface` - 

    All of which will require you to create other types of sway contracts, hold that thought 👍.

    Copy and replace the existing code in your `main.sw` file with the one below.

[note]: <> (I use Rust for all snippets rather than sway since both languages are similar and Rust's is recognized on prettifier for markdown code snippets)
    
    ```rust 
    contract;

    mod data_structures;
    mod errors;
    mod events;
    mod interface;
    mod utils;
    ```

3.  Next, you will import the following modules from the sway standard library; 
    - `asset::transfer` - This provides the functionality for transferring asset
    - `auth::mes_sender` - The module retrieves the address of the sender of the contract or a transaction.
    - `block::height` - The module provides information about the current block height or block number
    - `call_frames::msg_asset_id`- This provides information about the asset (token) associated with the current sent transaction.
    - `context` - This module provides context-related functionality, related to the execution context of your contract.
    - `hash::Hash` - This simply provides hashing-related functionality, like integrity verification, cryptographic operations, and generating unique identifiers.

    Copy and add the code below to your `main.sw` contract
    
    ``` rust
    use std::{
        asset::transfer,
        auth::msg_sender,
        block::height,
        call_frames::msg_asset_id,
        context::{
            msg_amount,
            this_balance,
        },
        hash::Hash,
    };
    ```

4. Next, you will initialize a set of persisting storage that is needed throughout your contract.

    - `balances` - This variable stores an object of the user's identity (msg_sender) to the total amount of deposited tokens `64-unsigned int` they have your Dao.
    - `proposals` - This storage maps a `64-unsigned int` to a new proposal information `struct` keeping track of every new proposal in your DAO.
    - ` proposal_count` -  This defines a simple `64 unsigned int` that tracks the total number of proposals created uniquely in your DAO.
    - `state`:  This defines a state variable that tracks the state of the contract and is set to `NotInitialized` by default.
    - `asset` -  This variable stores the contract ID of a governance asset
    - `votes` - This storage also keeps an object of the user's identity `Identity` to their vote `64-unsigned int` for an opened proposal on your DAO. 
 

Copy and add the code below to your `main.sw` contract.

    ```rust
    storage {
    balances: StorageMap<Identity, u64> = StorageMap {},
    proposals: StorageMap<u64, ProposalInfo> = StorageMap {},
    proposal_count: u64 = 0,
    state: State = State::NotInitialized,
    asset: AssetId = AssetId::base_asset_id(),
    votes: StorageMap<(Identity, u64), Votes> = StorageMap {},
    }
    ```

5. Now define your `DaoVoting` contract with the following implementations. 
    - `constructor()` - The function initializes the contract. Then sets the initial state of the contract to `State::Initialized` and stores the provided `asset ID` as the governance asset. Finally logs an `InitializeEvent` to record initialization.

    - `create_proposal()` - This function creates a new proposal, and checks if the duration is greater than zero and the acceptance percentage is within the valid range (0-100). Then it constructs a `ProposalInfo` object and inserts it into the storage along with an increment to the proposal count. Finally, it logs a `CreateProposalEvent` to record the creation of the proposal.

    - `deposit()` - This function allows users to deposit governance coins into the contract. It checks that the contract is initialized if the asset being sent is correct, and if the amount being sent is greater than zero. Then it updates the user's balance in the contract storage and logs the `DepositEvent` event.

    - `withdraw()`- This function allows users to withdraw governance coins from the contract. It checks if the amount to withdraw is greater than zero and if the user has sufficient balance. It then updates the user's balance and transfers the requested amount back to the user. Finally, it logs the `WithdrawEvent` event.

    - `vote()` - This function allows users to vote on a proposal. It validates the proposal ID, then checks if the proposal has not expired, and verifies that the user has sufficient balance for voting. It then updates the proposal's vote count and the user's balance accordingly and logs the `VoteEvent` event.

    - `execute()` - This function executes a proposal if it meets the required conditions. It validates the `proposal ID`, checks if the proposal has not been executed and has expired, then verifies if the acceptance percentage condition is met. If conditions are met, it executes the proposal's transaction and emits and logs the `ExecuteEvent` event.

    - `unlock_votes()` - This function unlocks the votes of users on a proposal after it has expired. It validates the proposal ID, checks if the proposal has expired, and returns the votes to the users' balances. It logs an UnlockVotesEvent to record the unlocking of votes.
    
    Copy and add the code below to your `main.sw` contract file.

    [note]: <> (This contract needs shortening)

    ```rust
    impl DaoVoting for Contract {
    #[storage(read, write)]
    fn constructor(asset: AssetId) {
        require(
            storage
                .state
                .read() == State::NotInitialized,
            InitializationError::CannotReinitialize,
        );

        storage.asset.write(asset);
        storage.state.write(State::Initialized);

        log(InitializeEvent {
            author: msg_sender().unwrap(),
            asset,
        })
    }

    #[storage(read, write)]
    fn create_proposal(
        acceptance_percentage: u64,
        duration: u64,
        proposal_transaction: Proposal,
    ) {
        require(0 < duration, CreationError::DurationCannotBeZero);
        require(
            0 < acceptance_percentage && acceptance_percentage <= 100,
            CreationError::InvalidAcceptancePercentage,
        );

        let author = msg_sender().unwrap();
        let proposal = ProposalInfo::new(
            acceptance_percentage,
            author,
            duration,
            proposal_transaction,
        );
        storage
            .proposals
            .insert(storage.proposal_count.read(), proposal);
        storage
            .proposal_count
            .write(storage.proposal_count.read() + 1);

        log(CreateProposalEvent {
            proposal_info: proposal,
            id: storage.proposal_count.read() - 1,
        });
    }

    #[payable]
    #[storage(read, write)]
    fn deposit() {
        require(
            storage
                .state
                .read() == State::Initialized,
            InitializationError::ContractNotInitialized,
        );
        require(
            storage
                .asset
                .read() == msg_asset_id(),
            UserError::IncorrectAssetSent,
        );
        require(0 < msg_amount(), UserError::AmountCannotBeZero);

        let user = msg_sender().unwrap();

        storage
            .balances
            .insert(
                user,
                msg_amount() + storage
                    .balances
                    .get(user)
                    .try_read()
                    .unwrap_or(0),
            );

        log(DepositEvent {
            amount: msg_amount(),
            user,
        });
    }

    #[storage(read, write)]
    fn withdraw(amount: u64) {
        require(0 < amount, UserError::AmountCannotBeZero);
        let user = msg_sender().unwrap();

        let prev_balance = storage.balances.get(user).try_read().unwrap_or(0);
        require(amount <= prev_balance, UserError::InsufficientBalance);

        storage.balances.insert(user, prev_balance - amount);

        // Transfer the asset back to the user
        transfer(user, storage.asset.read(), amount);

        log(WithdrawEvent { amount, user })
    }

    #[storage(read, write)]
    fn vote(approve: bool, proposal_id: u64, vote_amount: u64) {
        validate_id(proposal_id, storage.proposal_count.read());
        require(0 < vote_amount, UserError::VoteAmountCannotBeZero);

        let mut proposal = storage.proposals.get(proposal_id).try_read().unwrap();
        require(
            proposal
                .deadline >= height()
                .as_u64(),
            ProposalError::ProposalExpired,
        );

        let user = msg_sender().unwrap();
        let user_balance = storage.balances.get(user).try_read().unwrap_or(0);

        require(vote_amount <= user_balance, UserError::InsufficientBalance);

        let mut votes = storage.votes.get((user, proposal_id)).try_read().unwrap_or(Votes::default());
        if approve {
            proposal.yes_votes += vote_amount;
            votes.yes_votes += vote_amount;
        } else {
            proposal.no_votes += vote_amount;
            votes.no_votes += vote_amount;
        };

        storage.balances.insert(user, user_balance - vote_amount);
        storage.votes.insert((user, proposal_id), votes);
        storage.proposals.insert(proposal_id, proposal);

        log(VoteEvent {
            id: proposal_id,
            user,
            vote_amount,
        });
    }

    #[storage(read, write)]
    fn execute(proposal_id: u64) {
        validate_id(proposal_id, storage.proposal_count.read());

        let mut proposal = storage.proposals.get(proposal_id).try_read().unwrap();
        require(!proposal.executed, ProposalError::ProposalExecuted);
        require(
            proposal
                .deadline < height()
                .as_u64(),
            ProposalError::ProposalStillActive,
        );

        let acceptance_percentage = proposal.yes_votes * 100 / (proposal.yes_votes + proposal.no_votes);
        require(
            proposal
                .acceptance_percentage <= acceptance_percentage,
            ProposalError::InsufficientApprovals,
        );

        proposal.executed = true;
        storage.proposals.insert(proposal_id, proposal);

        asm(
            call_data: proposal.proposal_transaction.call_data,
            amount: proposal.proposal_transaction.amount,
            asset: proposal.proposal_transaction.asset,
            gas: proposal.proposal_transaction.gas,
        ) {
            call call_data amount asset gas;
        }

        log(ExecuteEvent {
            user: msg_sender().unwrap(),
            acceptance_percentage,
            id: proposal_id,
        })
    }

    #[storage(read, write)]
    fn unlock_votes(proposal_id: u64) {
        validate_id(proposal_id, storage.proposal_count.read());

        let proposal = storage.proposals.get(proposal_id).try_read().unwrap();
        require(
            proposal
                .deadline < height()
                .as_u64(),
            ProposalError::ProposalStillActive,
        );

        let user = msg_sender().unwrap();
        let votes = storage.votes.get((user, proposal_id)).try_read().unwrap_or(Votes::default());

        storage.votes.insert((user, proposal_id), Votes::default());

        let vote_amount = votes.yes_votes + votes.no_votes;
        storage
            .balances
            .insert(
                user,
                storage
                    .balances
                    .get(user)
                    .try_read()
                    .unwrap_or(0) + vote_amount,
            );

        log(UnlockVotesEvent {
            id: proposal_id,
            user,
            vote_amount,
        });
    }
    }

    ```

6. Lastly, on your `main.sw` file, you will create an `Info` contract which will serve as your `abi` where each function provides information about the state of the DAO contract, including balances, votes, and proposals. It defines how external smart contracts can query the status and details of your DAO Contract.

    - `balance() -> u64`: The function retrieves the balance of governance coins held by the contract. It returns the total `balance` as a u64 integer.

    - `user_balance(user: Identity) -> u64`: The function retrieves the balance of governance coins held by a specific user. It takes the user's identity as a parameter and returns their `balance` as an u64 integer.

    - `user_votes(proposal_id: u64, user: Identity) -> Votes`: The function retrieves the votes cast by a specific user on a particular proposal. It takes the proposal ID and the user's identity as parameters and returns a `Votes` struct containing the user's vote information.

    - `proposal(proposal_id: u64) -> ProposalInfo`: This function retrieves information about a specific proposal. It takes the proposal ID as a parameter and returns a `ProposalInfo` struct containing details about the proposal.

    - `governance_asset_id() -> AssetId`: The function retrieves the asset ID of the governance asset used by the contract. It returns the asset ID as an `AssetId` type.

    - `proposal_count() -> u64`: This function retrieves the total number of proposals created in the contract. It returns the count of `proposals` as a u64 integer.


    Copy and add the code below to your smart contract.

    ```rust


    ```

7. The entirety of your sway contract should look like the one below.

[note]: <> (I tried using syntax for shortening code snippets, like the one used in the sway docs, perhaps it could be used here to shorten the entirety of the tutorial length.)

```rust
contract;

mod data_structures;
mod errors;
mod events;
mod interface;
mod utils;

use std::{
    asset::transfer,
    auth::msg_sender,
    block::height,
    call_frames::msg_asset_id,
    context::{
        msg_amount,
        this_balance,
    },
    hash::Hash,
};

use ::data_structures::{Proposal, ProposalInfo, State, Votes};
use ::errors::{CreationError, InitializationError, ProposalError, UserError};
use ::events::{
    CreateProposalEvent,
    DepositEvent,
    ExecuteEvent,
    InitializeEvent,
    UnlockVotesEvent,
    VoteEvent,
    WithdrawEvent,
};
use ::interface::{DaoVoting, Info};
use ::utils::validate_id;

storage {
    balances: StorageMap<Identity, u64> = StorageMap {},
    proposals: StorageMap<u64, ProposalInfo> = StorageMap {},
    proposal_count: u64 = 0,
    state: State = State::NotInitialized,
    asset: AssetId = AssetId::base_asset_id(),
    votes: StorageMap<(Identity, u64), Votes> = StorageMap {},
}

impl DaoVoting for Contract {
    #[storage(read, write)]
    fn constructor(asset: AssetId) {
        require(
            storage
                .state
                .read() == State::NotInitialized,
            InitializationError::CannotReinitialize,
        );

        storage.asset.write(asset);
        storage.state.write(State::Initialized);

        log(InitializeEvent {
            author: msg_sender().unwrap(),
            asset,
        })
    }

    #[storage(read, write)]
    fn create_proposal(
        acceptance_percentage: u64,
        duration: u64,
        proposal_transaction: Proposal,
    ) {
        require(0 < duration, CreationError::DurationCannotBeZero);
        require(
            0 < acceptance_percentage && acceptance_percentage <= 100,
            CreationError::InvalidAcceptancePercentage,
        );

        let author = msg_sender().unwrap();
        let proposal = ProposalInfo::new(
            acceptance_percentage,
            author,
            duration,
            proposal_transaction,
        );
        storage
            .proposals
            .insert(storage.proposal_count.read(), proposal);
        storage
            .proposal_count
            .write(storage.proposal_count.read() + 1);

        log(CreateProposalEvent {
            proposal_info: proposal,
            id: storage.proposal_count.read() - 1,
        });
    }

    #[payable]
    #[storage(read, write)]
    fn deposit() {
        require(
            storage
                .state
                .read() == State::Initialized,
            InitializationError::ContractNotInitialized,
        );
        require(
            storage
                .asset
                .read() == msg_asset_id(),
            UserError::IncorrectAssetSent,
        );
        require(0 < msg_amount(), UserError::AmountCannotBeZero);

        let user = msg_sender().unwrap();

        storage
            .balances
            .insert(
                user,
                msg_amount() + storage
                    .balances
                    .get(user)
                    .try_read()
                    .unwrap_or(0),
            );

        log(DepositEvent {
            amount: msg_amount(),
            user,
        });
    }

    #[storage(read, write)]
    fn withdraw(amount: u64) {
        require(0 < amount, UserError::AmountCannotBeZero);
        let user = msg_sender().unwrap();

        let prev_balance = storage.balances.get(user).try_read().unwrap_or(0);
        require(amount <= prev_balance, UserError::InsufficientBalance);

        storage.balances.insert(user, prev_balance - amount);

        transfer(user, storage.asset.read(), amount);

        log(WithdrawEvent { amount, user })
    }

    #[storage(read, write)]
    fn vote(approve: bool, proposal_id: u64, vote_amount: u64) {
        validate_id(proposal_id, storage.proposal_count.read());
        require(0 < vote_amount, UserError::VoteAmountCannotBeZero);

        let mut proposal = storage.proposals.get(proposal_id).try_read().unwrap();
        require(
            proposal
                .deadline >= height()
                .as_u64(),
            ProposalError::ProposalExpired,
        );

        let user = msg_sender().unwrap();
        let user_balance = storage.balances.get(user).try_read().unwrap_or(0);

        require(vote_amount <= user_balance, UserError::InsufficientBalance);

        let mut votes = storage.votes.get((user, proposal_id)).try_read().unwrap_or(Votes::default());
        if approve {
            proposal.yes_votes += vote_amount;
            votes.yes_votes += vote_amount;
        } else {
            proposal.no_votes += vote_amount;
            votes.no_votes += vote_amount;
        };

        storage.balances.insert(user, user_balance - vote_amount);
        storage.votes.insert((user, proposal_id), votes);
        storage.proposals.insert(proposal_id, proposal);

        log(VoteEvent {
            id: proposal_id,
            user,
            vote_amount,
        });
    }

    #[storage(read, write)]
    fn execute(proposal_id: u64) {
        validate_id(proposal_id, storage.proposal_count.read());

        let mut proposal = storage.proposals.get(proposal_id).try_read().unwrap();
        require(!proposal.executed, ProposalError::ProposalExecuted);
        require(
            proposal
                .deadline < height()
                .as_u64(),
            ProposalError::ProposalStillActive,
        );

        let acceptance_percentage = proposal.yes_votes * 100 / (proposal.yes_votes + proposal.no_votes);
        require(
            proposal
                .acceptance_percentage <= acceptance_percentage,
            ProposalError::InsufficientApprovals,
        );

        proposal.executed = true;
        storage.proposals.insert(proposal_id, proposal);

        asm(
            call_data: proposal.proposal_transaction.call_data,
            amount: proposal.proposal_transaction.amount,
            asset: proposal.proposal_transaction.asset,
            gas: proposal.proposal_transaction.gas,
        ) {
            call call_data amount asset gas;
        }

        // Users can now convert their votes back into assets
        log(ExecuteEvent {
            user: msg_sender().unwrap(),
            acceptance_percentage,
            id: proposal_id,
        })
    }

    #[storage(read, write)]
    fn unlock_votes(proposal_id: u64) {
        validate_id(proposal_id, storage.proposal_count.read());

        let proposal = storage.proposals.get(proposal_id).try_read().unwrap();
        require(
            proposal
                .deadline < height()
                .as_u64(),
            ProposalError::ProposalStillActive,
        );

        let user = msg_sender().unwrap();
        let votes = storage.votes.get((user, proposal_id)).try_read().unwrap_or(Votes::default());

        storage.votes.insert((user, proposal_id), Votes::default());

        let vote_amount = votes.yes_votes + votes.no_votes;
        storage
            .balances
            .insert(
                user,
                storage
                    .balances
                    .get(user)
                    .try_read()
                    .unwrap_or(0) + vote_amount,
            );

        log(UnlockVotesEvent {
            id: proposal_id,
            user,
            vote_amount,
        });
    }
}

impl Info for Contract {
    #[storage(read)]
    fn balance() -> u64 {
        this_balance(storage.asset.read())
    }

    #[storage(read)]
    fn user_balance(user: Identity) -> u64 {
        storage.balances.get(user).try_read().unwrap_or(0)
    }

    #[storage(read)]
    fn user_votes(proposal_id: u64, user: Identity) -> Votes {
        validate_id(proposal_id, storage.proposal_count.read());
        storage.votes.get((user, proposal_id)).try_read().unwrap_or(Votes::default())
    }

    #[storage(read)]
    fn proposal(proposal_id: u64) -> ProposalInfo {
        validate_id(proposal_id, storage.proposal_count.read());
        storage.proposals.get(proposal_id).try_read().unwrap()
    }

    #[storage(read)]
    fn governance_asset_id() -> AssetId {
        require(
            storage
                .state
                .read() == State::Initialized,
            InitializationError::ContractNotInitialized,
        );
        storage.asset.read()
    }

    #[storage(read)]
    fn proposal_count() -> u64 {
        storage.proposal_count.read()
    }
}
```


Now you have completed the implementation of your main contract, let's get back to the other contract types you imported earlier. You will complete the next steps in creating those contracts.

### The Other Contract Types

1. Run the command in your contract directory to create the files for the new library contracts.

```bash
cd src
mkdir errors.sw data_structires.sw events.sw interface.sw utils.sw
```

2. Go to your `error.sw` contract file where you will define a library of error enums for handling various error conditions that may occur during your contract execution.

Copy and paste the entire code below into the file.

[note]: <> (code snippet also needs shortening)

```rust
library;
pub enum CreationError {
    DurationCannotBeZero: (),
    InvalidAcceptancePercentage: (),
}

pub enum InitializationError {
    CannotReinitialize: (),
    ContractNotInitialized: (),
}

pub enum ProposalError {
    InsufficientApprovals: (),
    ProposalExecuted: (),
    ProposalExpired: (),
    ProposalStillActive: (),
}

pub enum UserError {
    AmountCannotBeZero: (),
    IncorrectAssetSent: (),
    InsufficientBalance: (),
    InvalidId: (),
    VoteAmountCannotBeZero: (),
}
```

3. Next, go to your `data_structures.sw` file to implement a new library contract that defines the data structures and associated functions to manage proposals and votes within a voting system. 
It provides functions to create proposals, record votes, and manage the state of the contract. It also includes utility functions and enums to handle errors and state transitions.

Copy and paste the entire code below into the file.

[note]: <> (code snippet needs shortening)

```rust
library;

use std::block::height;
use core::ops::Eq;

struct CallData {
    arguments: u64,
    function_selector: u64,
    id: ContractId,
}

pub struct Proposal {
    amount: u64,
    asset: AssetId,
    call_data: CallData,
    gas: u64,
}

pub struct ProposalInfo {
    acceptance_percentage: u64,
    author: Identity,
    deadline: u64,
    executed: bool,
    no_votes: u64,
    proposal_transaction: Proposal,
    yes_votes: u64,
}

impl ProposalInfo {

    pub fn new(
        acceptance_percentage: u64,
        author: Identity,
        duration: u64,
        proposal_transaction: Proposal,
    ) -> Self {
        ProposalInfo {
            acceptance_percentage,
            author,
            deadline: duration + height().as_u64(),
            executed: false,
            no_votes: 0,
            proposal_transaction,
            yes_votes: 0,
        }
    }
}

pub enum State {
    NotInitialized: (),
    Initialized: (),
}

impl Eq for State {
    fn eq(self, other: Self) -> bool {
        match (self, other) {
            (State::Initialized, State::Initialized) => true,
            (State::NotInitialized, State::NotInitialized) => true,
            _ => false,
        }
    }
}

pub struct Votes {
    no_votes: u64,
    yes_votes: u64,
}

impl Votes {
    pub fn default() -> Self {
        Self {
            no_votes: 0,
            yes_votes: 0,
        }
    }
}

```

4. Go to your `interface.sw` contract file, here you will create your `DaoVoting` `abi` with functionalities for managing proposals and voting within your DAO. It defines methods for initializing the DAO, creating proposals, depositing and withdrawing governance assets, voting on proposals, executing proposals, and unlocking votes.

    It will also consist of your `Info` ABI that provides methods to query information about the DAO, including the balance of governance coins in the contract, user balances, votes spent on proposals by users, proposal data, governance asset ID, and the number of proposals created.


Copy and add the code below in your `interface.sw` contract file.

```rust
library;

use ::data_structures::{Proposal, ProposalInfo, Votes};

abi DaoVoting {
   
    #[storage(read, write)]
    fn constructor(gov_asset: AssetId);

    
    #[storage(read, write)]
    fn create_proposal(
        acceptance_percentage: u64,
        duration: u64,
        proposal_transaction: Proposal,
    );

    
    #[payable, storage(read, write)]
    fn deposit();


    #[storage(read, write)]
    fn withdraw(amount: u64);

   
    #[storage(read, write)]
    fn vote(approve: bool, proposal_id: u64
    vote_amount: u64);

   
    #[storage(read, write)]
    fn execute(proposal_id: u64);

    
    #[storage(read, write)]
    fn unlock_votes(proposal_id: u64);
}

abi Info {
   
    #[storage(read)]
    fn balance() -> u64;

    
    #[storage(read)]
    fn user_balance(user: Identity) -> u64;

    
    #[storage(read)]
    fn user_votes(proposal_id: u64, user: Identity) -> Votes;

    
    #[storage(read)]
    fn proposal(id: u64) -> ProposalInfo;

    
    #[storage(read)]
    fn governance_asset_id() -> AssetId;

   
    #[storage(read)]
    fn proposal_count() -> u64;
}
```
5. Next, Go to your `event. sw` contract file where you will set event structs that are emitted during various actions within your DAO. Each event corresponds to a specific action or state change within the DAO.

Copy and Paste the code below in your `event.sw` contract file.

[note]: <> (Code snippet needs shortening)

```rust 
library;

use ::data_structures::ProposalInfo;

pub struct CreateProposalEvent {
    id: u64,
    proposal_info: ProposalInfo,
}

pub struct DepositEvent {
    amount: u64,
    user: Identity,
}

pub struct ExecuteEvent {
    acceptance_percentage: u64,
    id: u64,
    user: Identity,
}

pub struct InitializeEvent {
    author: Identity,
    asset: AssetId,
}

pub struct UnlockVotesEvent {
    id: u64,
    user: Identity,
    vote_amount: u64,
}

pub struct VoteEvent {
    id: u64,
    user: Identity,
    vote_amount: u64,
}

pub struct WithdrawEvent {
    amount: u64,
    user: Identity,
}

```

6. Finally, go to your `utils.sw` contract file, this library simply provides a function `validate_id` that validates whether a given ID is within a specified count range.

Copy and paste the code below into your `utils.sw` file.

```rust
library;

use ::errors::UserError;

pub fn validate_id(id: u64, count: u64) {
    require(id < count, UserError::InvalidId);
}
```

### Compiling your Smart Contract

First, ensure you are in your contract directory, and run the command `forc build`. you should get a response similar to the image below.


## Deploying your smart contract

Following through the next few steps you will deploy your contract to the Fuel `beta-4` testnet.

Assuming you already have your developer wallet configured locally, and your wallet details safely stored, including your password. If not, you can follow through the steps here or watch this.

1. First, you need to get your test faucets to deploy and make transactions, on your contract. Head over to the site to get your faucets.

2. Now, run the command `forc deploy --testnet`. You should get a response similar to the image below.

3. Copy your returned contract ID, you will need this for interacting with your contract from your front end.


## Building your DAO Frontend
