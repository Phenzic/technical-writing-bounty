import { FuelProvider } from "@fuels/react";
import {
  FuelWalletConnector,
  FuelWalletDevelopmentConnector,
  FueletWalletConnector,
} from "@fuels/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./components/Home";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <FuelProvider
      fuelConfig={{
        connectors: [
          new FuelWalletConnector(),
          new FuelWalletDevelopmentConnector(),
          new FueletWalletConnector(),
        ],
      }}
    >
      <Home />
    </FuelProvider>
  </QueryClientProvider>
);

export default App;
