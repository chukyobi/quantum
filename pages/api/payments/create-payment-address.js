// pages/api/payment/create-payment-address.js
import { v4 as uuidv4 } from 'uuid';
import bitcoin from 'bitcoinjs-lib';
import ethers from 'ethers';

// Function to generate a Bitcoin wallet
function generateBitcoinWallet() {
  const keyPair = bitcoin.ECPair.makeRandom();
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
  return { address, privateKey: keyPair.toWIF() };
}

// Function to generate an Ethereum wallet
function generateEthereumWallet() {
  const wallet = ethers.Wallet.createRandom();
  return { address: wallet.address, privateKey: wallet.privateKey };
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Generate a new wallet for the user
    const walletType = req.body.walletType; // "BTC" or "ETH"
    let wallet;
    
    if (walletType === 'BTC') {
      wallet = generateBitcoinWallet();
    } else if (walletType === 'ETH') {
      wallet = generateEthereumWallet();
    }

    const transactionId = uuidv4(); // Unique transaction ID

    // In a real app, store wallet details and transaction info in the database here

    // Send the wallet address to the user
    res.status(200).json({
      transactionId,
      walletAddress: wallet.address,
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
