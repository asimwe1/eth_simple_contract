import { useState, useEffect } from "react";
import Web3 from "web3";
import Storage from "./contracts/Storage.json"; // Now works

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [storedValue, setStoredValue] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        // 1. Connect to Ganache
        const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
        const web3Instance = new Web3(provider);
  
        // Verify connection
        const networkId = await web3Instance.eth.net.getId();
        console.log("Connected to network ID:", networkId);
  
        // 2. Get accounts
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length === 0) throw new Error("No accounts found");
        setAccount(accounts[0]);
  
        // 3. Load contract
        const deployedNetwork = Storage.networks[networkId];
        if (!deployedNetwork) throw new Error("Contract not deployed on current network");
        
        const contractInstance = new web3Instance.eth.Contract(
          Storage.abi,
          deployedNetwork.address
        );
        setContract(contractInstance);
  
        // 4. Initial value
        const value = await contractInstance.methods.get().call();
        setStoredValue(value);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    init();
  }, []);

  const updateValue = async () => {
    const newValue = Math.floor(Math.random() * 100);
    await contract.methods.set(newValue).send({ from: account });
    setStoredValue(newValue);
  };

  return (
    <div>
      <p>Stored Value: {storedValue}</p>
      <button onClick={updateValue}>Update Value</button>
    </div>
  );
}

export default App;