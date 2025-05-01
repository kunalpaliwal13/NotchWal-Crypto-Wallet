import { ethers } from "ethers";
import React, { useState } from 'react';





const WalletManager = () => {
  const [isVisible, SetisVisible] =useState(false)
  const [wallets, setWallets] = useState([]);
  const [network, setNetwork] = useState('solana');
  const [mnemonics, SetMnemonics] = useState(["1", "2", "1", "2","1", "2","1", "2","1", "2","1", "2",]);
  

  const generatekey = (mnemonic, i) => {
    const mnemonicStr = Array.isArray(mnemonic) ? mnemonic.join(" ") : mnemonic;
    console.log(mnemonicStr)

    console.log(mnemonicStr)
    const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonicStr);
    const childNode = hdNode.derivePath(`${i}`);
    // console.log(`Wallet ${i + 1}: ${childNode.address} ${childNode.privateKey}`);
  
    return {
      address: childNode.address,
      privateKey: childNode.privateKey,
      mnemonicWords: mnemonicStr.split(" "),
    };
  };
  
  const addFirstWallet = () => {
    const wallet = ethers.Wallet.createRandom();
    const mnemonic = wallet.mnemonic.phrase;
    const walletData =  generatekey( mnemonic,wallets.length);
    SetMnemonics(walletData.mnemonicWords);
    SetisVisible(true);

    const newWallet = {
      id: Date.now(),
      publicKey: walletData.address,
      privateKey: walletData.privateKey,
    };
    setWallets([...wallets, newWallet]);
  };


  const addWallet = () => {
    if(wallets.length==0){
      addFirstWallet()
    }else{    
      console.log("here")
      const walletData = generatekey( mnemonics,wallets.length);
      SetMnemonics(walletData.mnemonicWords);
      SetisVisible(true);
    
      const newWallet = {
        id: Date.now(),
        publicKey: walletData.address,
        privateKey: walletData.privateKey,
      };
      setWallets([...wallets, newWallet]);
  };}


  const clearWallets = () => {
    setWallets([]);
  };

  const Copy=(text)=>{
    navigator.clipboard.writeText(text)
  }

  const deleteWallet = (id) => {
    setWallets(wallets.filter(wallet => wallet.id !== id));
  };

  const toggleNetwork = () => {
    setNetwork(prev => (prev === 'solana' ? 'ethereum' : 'solana'));
  };

  return (
    <div className='container flex justify-center align-middle bg-black w-screen'>
    <div className=" text-white min-h-screen p-6  flex-col w-[80%] container bg-black">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-5">
          <span>NotchWal</span>
          <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">v1.3</span>
        </h1>
        <button onClick={toggleNetwork} className="bg-gray-800 px-4 py-1 rounded-full">
          {network === 'solana' ? 'Solana' : 'Ethereum'}
        </button>
      </div>

      {/* Secret Phrase Section */}
      <div className={`bg-black drop-shadow-[0_0px_5px_rgba(255,255,255,0.25)] p-4 mb-20 rounded-sm ${isVisible ? 'visible' : 'hidden'}`} id="keys" style = {{height: "280px"}}>
        <h2 className="text-xl font-medium mb-4">Your Secret Phrase</h2>
        <div className="grid grid-cols-4 gap-3 text-sm">
        {mnemonics.map((word, idx) => (
        <div
          key={idx}
          className="bg-zinc-900 h-11 flex justify-center items-center rounded cursor-pointer hover:bg-zinc-700"
          style={{ fontSize: '15px' }}
          onClick={() => {
            Copy(word);
          }}
        >
          {word}
        </div>
      ))}
        </div>
        <p className="text-xs mt-2 text-gray-400">Click Anywhere To Copy</p>
      </div>

      {/* Wallet Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{network.charAt(0).toUpperCase() + network.slice(1)} Wallet</h2>
          <div className="space-x-2">
          <button onClick={addWallet }  className="bg-white h-8 text-black px-4 py-1 rounded-sm hover:bg-gray-200">Add Wallet</button>
          <button onClick={clearWallets} className="bg-red-600 h-8 text-color px-4 py-1 rounded-sm hover:bg-red-500">Clear Wallets</button>

          </div>
        </div>

        {/* Wallet List */}
        {wallets.map((wallet, index) => (
          <div key={wallet.id} className="bg-zinc-900 p-4 rounded mb-4 relative">
            <button
              onClick={() => deleteWallet(wallet.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-400"
            >
              🗑️
            </button>
            <h3 className="text-3xl font-semibold mb-2">Wallet {index + 1}</h3>
            <p className="text-sm"><strong>Public Key:</strong> {wallet.publicKey}</p>
            <p className="text-sm mt-2"><strong>Private Key:</strong> ••••••••••••••••••••••••••••••••••••</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-xs text-gray-400">
        Designed and Developed by Kunal
      </footer>
    </div>
    </div>
  );
};

export default WalletManager;
