'use client';

import { useState } from 'react';

interface Account {
  type: 'current' | 'savings';
  balance: number;
}

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([
    { type: 'current', balance: 1000 },
    { type: 'savings', balance: 5000 }
  ]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [screen, setScreen] = useState('pin'); // pin, account, menu, withdrawal, deposit, balance
  const [depositAmount, setDepositAmount] = useState('');

  // Theme classes
  const mainBg = isDarkMode ? 'bg-gray-900' : 'bg-gray-200';
  const screenBg = isDarkMode ? 'bg-black' : 'bg-[#2d3436]';
  const textColor = 'text-green-500';
  const inputBg = 'bg-black';
  const buttonBg = 'bg-gray-700 hover:bg-gray-600 border-2 border-gray-600';

  const handlePinInput = (num: string) => {
    if (pin.length < 4) {
      setPin(pin + num);
    }
  };

  const handleLogin = () => {
    if (pin === '1234') { // Demo PIN
      setIsAuthenticated(true);
      setScreen('account');
    } else {
      alert('Invalid PIN');
      setPin('');
    }
  };

  const handleWithdraw = (amount: number) => {
    if (selectedAccount && selectedAccount.balance >= amount) {
      const updatedAccounts = accounts.map(acc => 
        acc.type === selectedAccount.type 
          ? { ...acc, balance: acc.balance - amount }
          : acc
      );
      setAccounts(updatedAccounts);
      setSelectedAccount({ ...selectedAccount, balance: selectedAccount.balance - amount });
      alert(`Successfully withdrawn $${amount}`);
      setScreen('menu');
    } else {
      alert('Insufficient funds');
    }
  };

  const handleDeposit = () => {
    const amount = Number(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    const updatedAccounts = accounts.map(acc => 
      acc.type === selectedAccount?.type 
        ? { ...acc, balance: acc.balance + amount }
        : acc
    );
    setAccounts(updatedAccounts);
    setSelectedAccount(selectedAccount ? { ...selectedAccount, balance: selectedAccount.balance + amount } : null);
    alert(`Successfully deposited $${amount}`);
    setDepositAmount('');
    setScreen('menu');
  };

  const renderPinScreen = () => (
    <div className="space-y-6">
      <div className={`${inputBg} p-4 rounded-lg border-4 border-gray-600 shadow-inner`}>
        <input
          type="password"
          value={pin}
          readOnly
          className={`w-full text-center text-2xl tracking-wider bg-transparent ${textColor} font-mono`}
          placeholder="Enter PIN"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((num, index) => (
          <button
            key={index}
            onClick={() => {
              if (num === '⌫') {
                setPin(pin.slice(0, -1));
              } else if (num !== '') {
                handlePinInput(num.toString());
              }
            }}
            className={`${buttonBg} text-white p-4 rounded-lg text-xl transition-colors transform active:scale-95 shadow-lg`}
          >
            {num}
          </button>
        ))}
      </div>
      <button
        onClick={handleLogin}
        className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-xl transition-colors transform active:scale-95 shadow-lg border-2 border-green-700"
      >
        Enter
      </button>
    </div>
  );

  const renderAccountSelection = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-green-500 text-center mb-6 font-mono">Select Account</h2>
      <div className="grid grid-cols-1 gap-4">
        {accounts.map((account) => (
          <button
            key={account.type}
            onClick={() => {
              setSelectedAccount(account);
              setScreen('menu');
            }}
            className="bg-gray-700 hover:bg-gray-600 text-green-500 p-6 rounded-lg text-xl transition-colors border-2 border-gray-600 transform active:scale-95 shadow-lg font-mono"
          >
            {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account
            <div className="text-sm mt-2 text-green-400">Balance: ${account.balance}</div>
          </button>
        ))}
      </div>
    </div>
  );

  // Add theme toggle button
  const renderThemeToggle = () => (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={`absolute top-4 right-4 p-2 rounded-full ${buttonBg} transition-colors`}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );

  const renderMenu = () => (
    <div className="space-y-4">
      <div className="bg-black p-4 rounded-lg text-green-500 text-center mb-6 border-2 border-gray-600 font-mono">
        <p className="text-lg">Available Balance</p>
        <p className="text-3xl font-bold">${selectedAccount?.balance || 0}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setScreen('withdrawal')}
          className="bg-gray-700 hover:bg-gray-600 text-green-500 p-6 rounded-lg text-xl transition-colors border-2 border-gray-600 transform active:scale-95 shadow-lg font-mono flex flex-col items-center justify-center min-h-[100px]"
        >
          <span className="text-2xl mb-1">↓</span>
          <span>WITHDRAW</span>
        </button>
        <button
          onClick={() => setScreen('deposit')}
          className="bg-gray-700 hover:bg-gray-600 text-green-500 p-6 rounded-lg text-xl transition-colors border-2 border-gray-600 transform active:scale-95 shadow-lg font-mono flex flex-col items-center justify-center min-h-[100px]"
        >
          <span className="text-2xl mb-1">↑</span>
          <span>DEPOSIT</span>
        </button>
        <button
          onClick={() => setScreen('balance')}
          className="bg-gray-700 hover:bg-gray-600 text-green-500 p-6 rounded-lg text-xl transition-colors border-2 border-gray-600 transform active:scale-95 shadow-lg font-mono flex flex-col items-center justify-center min-h-[100px]"
        >
          <span className="text-2xl mb-1">$</span>
          <span>BALANCE</span>
        </button>
        <button
          onClick={() => setScreen('account')}
          className="bg-gray-700 hover:bg-gray-600 text-green-500 p-6 rounded-lg text-xl transition-colors border-2 border-gray-600 transform active:scale-95 shadow-lg font-mono flex flex-col items-center justify-center min-h-[100px]"
        >
          <span className="text-2xl mb-1">⇄</span>
          <span>SWITCH</span>
        </button>
        <button
          onClick={() => {
            setIsAuthenticated(false);
            setPin('');
            setSelectedAccount(null);
            setScreen('pin');
          }}
          className="col-span-2 bg-red-800 hover:bg-red-700 text-white p-6 rounded-lg text-xl transition-colors border-2 border-red-900 transform active:scale-95 shadow-lg font-mono flex flex-col items-center justify-center"
        >
          <span className="text-2xl mb-1">✕</span>
          <span>EXIT</span>
        </button>
      </div>
    </div>
  );

  const renderWithdrawal = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {[20, 50, 100, 200, 500, 1000].map((amount) => (
          <button
            key={amount}
            onClick={() => handleWithdraw(amount)}
            className="bg-gray-700 hover:bg-gray-600 text-green-500 p-6 rounded-lg text-xl transition-colors border-2 border-gray-600 transform active:scale-95 shadow-lg font-mono"
          >
            ${amount}
          </button>
        ))}
      </div>
      <button
        onClick={() => setScreen('menu')}
        className="w-full bg-gray-700 hover:bg-gray-600 text-green-500 p-4 rounded-lg text-xl transition-colors border-2 border-gray-600 transform active:scale-95 shadow-lg font-mono"
      >
        Back
      </button>
    </div>
  );

  const renderDeposit = () => (
    <div className="space-y-4">
      <div className={`${inputBg} p-4 rounded-lg`}>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          className={`w-full text-center text-2xl tracking-wider bg-transparent ${textColor}`}
          placeholder="Enter amount"
        />
      </div>
      <button
        onClick={handleDeposit}
        className="w-full bg-gray-700 hover:bg-gray-600 text-green-500 p-4 rounded-lg text-xl transition-colors border-2 border-gray-600 transform active:scale-95 shadow-lg font-mono"
      >
        Deposit
      </button>
      <button
        onClick={() => {
          setDepositAmount('');
          setScreen('menu');
        }}
        className="w-full bg-gray-700 hover:bg-gray-600 text-green-500 p-4 rounded-lg text-xl transition-colors border-2 border-gray-600 transform active:scale-95 shadow-lg font-mono"
      >
        Back
      </button>
    </div>
  );

  return (
    <div className={`min-h-screen ${mainBg} flex items-center justify-center p-4 relative bg-gradient-to-b from-gray-800 to-gray-900`}>
      {renderThemeToggle()}
      <div className="max-w-md w-full bg-gradient-to-b from-gray-500 to-gray-700 p-12 rounded-3xl shadow-2xl border-8 border-gray-600 relative">
        {/* Card Slot */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-48 h-2 bg-gray-800 border-2 border-gray-600 rounded-t-lg"></div>
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-black rounded-t-lg"></div>
        
        {/* Receipt Slot */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-2 bg-gray-800 border-2 border-gray-600 rounded-b-lg"></div>
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-black rounded-b-lg"></div>

        {/* Main Screen Area */}
        <div className={`${screenBg} p-8 rounded-xl border-8 border-gray-600 shadow-inner mb-6`}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-500 font-mono">ATM MACHINE</h1>
            <p className="text-green-400 font-mono">Welcome to NextJS Bank</p>
          </div>
          <div className={`${screenBg} rounded-lg p-4`}>
            {screen === 'pin' && renderPinScreen()}
            {isAuthenticated && screen === 'account' && renderAccountSelection()}
            {isAuthenticated && screen === 'menu' && renderMenu()}
            {isAuthenticated && screen === 'withdrawal' && renderWithdrawal()}
            {isAuthenticated && screen === 'deposit' && renderDeposit()}
            {isAuthenticated && screen === 'balance' && (
              <div className="text-center space-y-4">
                <div className="bg-black p-6 rounded-lg text-green-500 border-2 border-gray-600 font-mono">
                  <p className="text-xl">{selectedAccount?.type ? selectedAccount.type.charAt(0).toUpperCase() + selectedAccount.type.slice(1) : ''} Account Balance</p>
                  <p className="text-4xl font-bold mt-2">${selectedAccount?.balance || 0}</p>
                </div>
                <button
                  onClick={() => setScreen('menu')}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-green-500 p-4 rounded-lg text-xl transition-colors border-2 border-gray-600 transform active:scale-95 shadow-lg font-mono"
                >
                  Back to Menu
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Side Function Buttons */}
        <div className="absolute right-0 top-1/2 transform translate-x-12 -translate-y-1/2 space-y-4">
          <button className="w-8 h-16 bg-gray-800 border-2 border-gray-600 rounded-r-lg shadow-lg"></button>
          <button className="w-8 h-16 bg-gray-800 border-2 border-gray-600 rounded-r-lg shadow-lg"></button>
          <button className="w-8 h-16 bg-gray-800 border-2 border-gray-600 rounded-r-lg shadow-lg"></button>
        </div>

        {/* Left Side Function Buttons */}
        <div className="absolute left-0 top-1/2 transform -translate-x-12 -translate-y-1/2 space-y-4">
          <button className="w-8 h-16 bg-gray-800 border-2 border-gray-600 rounded-l-lg shadow-lg"></button>
          <button className="w-8 h-16 bg-gray-800 border-2 border-gray-600 rounded-l-lg shadow-lg"></button>
          <button className="w-8 h-16 bg-gray-800 border-2 border-gray-600 rounded-l-lg shadow-lg"></button>
        </div>
      </div>
    </div>
  );
}
