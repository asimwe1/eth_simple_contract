"use client"

import { useState, useEffect } from "react"
import Web3 from "web3"
import Storage from "./Storage.json"
import { ArrowDownUp, RotateCcw, Calculator } from "lucide-react"

export default function EthereumCalculator() {
  const [account, setAccount] = useState("")
  const [contract, setContract] = useState(null)
  const [storedValue, setStoredValue] = useState(0)
  const [num1, setNum1] = useState("")
  const [num2, setNum2] = useState("")
  const [operation, setOperation] = useState("add")
  const [isLoading, setIsLoading] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true)
        const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545")
        const web3Instance = new Web3(provider)

        const networkId = await web3Instance.eth.net.getId()
        console.log("Connected to network ID:", networkId)

        const accounts = await web3Instance.eth.getAccounts()
        if (accounts.length === 0) throw new Error("No accounts found")
        setAccount(accounts[0])

        const deployedNetwork = Storage.networks[networkId]
        if (!deployedNetwork) throw new Error("Contract not deployed on current network")

        const contractInstance = new web3Instance.eth.Contract(Storage.abi, deployedNetwork.address)
        setContract(contractInstance)

        const value = await contractInstance.methods.get().call()
        setStoredValue(value)
      } catch (error) {
        console.error("Initialization error:", error)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const performCalculation = async () => {
    if (!contract || !num1 || !num2) return
    const n1 = Number.parseInt(num1)
    const n2 = Number.parseInt(num2)
    try {
      setIsCalculating(true)
      switch (operation) {
        case "add": await contract.methods.add(n1, n2).send({ from: account }); break
        case "subtract": await contract.methods.subtract(n1, n2).send({ from: account }); break
        case "multiply": await contract.methods.multiply(n1, n2).send({ from: account }); break
        case "divide": await contract.methods.divide(n1, n2).send({ from: account }); break
        default: return
      }
      const newValue = await contract.methods.get().call()
      setStoredValue(newValue)
    } catch (error) {
      console.error("Calculation error:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  const resetValue = async () => {
    if (!contract) return
    try {
      setIsResetting(true)
      await contract.methods.reset().send({ from: account })
      setStoredValue(0)
    } catch (error) {
      console.error("Reset error:", error)
    } finally {
      setIsResetting(false)
    }
  }

  const getOperationSymbol = () => {
    switch (operation) {
      case "add": return "+"
      case "subtract": return "-"
      case "multiply": return "×"
      case "divide": return "÷"
      default: return ""
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #343434, #000000)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ maxWidth: '28rem', width: '100%', background: 'rgba(60, 60, 61, 0.2)', backdropFilter: 'blur(4px)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(98, 169, 255, 0.2)', boxShadow: '0 0 15px rgba(98, 169, 255, 0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <Calculator style={{ height: '32px', width: '32px', color: '#00A3FF', marginRight: '8px' }} />
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', backgroundClip: 'text', color: 'transparent', background: 'linear-gradient(to right, #62A9FF, #00A3FF)' }}>
            Ethereum Calculator
          </h1>
        </div>

        <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', border: '1px solid rgba(98, 169, 255, 0.1)' }}>
          <div style={{ fontSize: '14px', color: 'rgba(98, 169, 255, 0.7)', marginBottom: '4px' }}>Connected Account</div>
          <div style={{ fontFamily: 'monospace', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {isLoading ? (
              <div style={{ animation: 'pulse 2s infinite', height: '16px', background: 'rgba(98, 169, 255, 0.2)', borderRadius: '4px', width: '100%' }}></div>
            ) : (
              account || "Not connected"
            )}
          </div>
        </div>

        <div style={{ marginBottom: '32px', padding: '16px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', border: '1px solid rgba(98, 169, 255, 0.1)' }}>
          <div style={{ fontSize: '14px', color: 'rgba(98, 169, 255, 0.7)', marginBottom: '4px' }}>Stored Result</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#00A3FF' }}>
            {isLoading ? <div style={{ animation: 'pulse 2s infinite', height: '40px', background: 'rgba(98, 169, 255, 0.2)', borderRadius: '4px', width: '33%' }}></div> : storedValue}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', color: 'rgba(98, 169, 255, 0.7)', marginBottom: '4px' }}>First Number</label>
              <input
                type="number"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
                placeholder="0"
                style={{ width: '100%', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(98, 169, 255, 0.2)', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', color: 'rgba(98, 169, 255, 0.7)', marginBottom: '4px' }}>Second Number</label>
              <input
                type="number"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
                placeholder="0"
                style={{ width: '100%', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(98, 169, 255, 0.2)', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: 'rgba(98, 169, 255, 0.7)', marginBottom: '4px' }}>Operation</label>
            <div style={{ position: 'relative' }}>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                style={{ width: '100%', appearance: 'none', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(98, 169, 255, 0.2)', borderRadius: '8px', padding: '12px', color: '#fff', paddingRight: '40px', outline: 'none' }}
              >
                <option value="add">Addition (+)</option>
                <option value="subtract">Subtraction (-)</option>
                <option value="multiply">Multiplication (×)</option>
                <option value="divide">Division (÷)</option>
              </select>
              <ArrowDownUp style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', height: '20px', width: '20px', color: 'rgba(98, 169, 255, 0.5)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: '#62A9FF', margin: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0, 163, 255, 0.2)', border: '1px solid rgba(0, 163, 255, 0.3)' }}>
              {getOperationSymbol()}
            </div>
          </div>

          <button
            onClick={performCalculation}
            disabled={isCalculating || !num1 || !num2}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '8px', fontWeight: '500',
              background: isCalculating || !num1 || !num2 ? 'rgba(98, 169, 255, 0.2)' : 'linear-gradient(to right, #62A9FF, #00A3FF)',
              color: isCalculating || !num1 || !num2 ? 'rgba(255, 255, 255, 0.5)' : '#fff',
              cursor: isCalculating || !num1 || !num2 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {isCalculating ? "Processing Transaction..." : "Calculate on Blockchain"}
          </button>
        </div>

        <button
          onClick={resetValue}
          disabled={isResetting || storedValue === 0}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 16px', borderRadius: '8px', fontWeight: '500',
            background: isResetting || storedValue === 0 ? 'rgba(60, 60, 61, 0.3)' : 'rgba(60, 60, 61, 0.5)',
            color: isResetting || storedValue === 0 ? 'rgba(255, 255, 255, 0.5)' : '#fff',
            cursor: isResetting || storedValue === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <RotateCcw style={{ height: '16px', width: '16px', marginRight: '8px' }} />
          {isResetting ? "Resetting..." : "Reset Value"}
        </button>
      </div>

      <div style={{ marginTop: '24px', fontSize: '14px', color: 'rgba(98, 169, 255, 0.5)', maxWidth: '28rem', textAlign: 'center' }}>
        This calculator performs operations through smart contract transactions on the Ethereum blockchain. Each calculation is a transaction that updates the stored value on-chain.
      </div>
    </div>
  )
}