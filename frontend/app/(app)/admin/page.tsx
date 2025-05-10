'use client';

import { useState } from 'react';
import { useSolanaWallets } from '@privy-io/react-auth';
import { useSendTransaction } from '@privy-io/react-auth/solana';
import { 
  useInitialiseTransaction, 
} from '@/services/solana/mutation';
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { useProgramAuthority } from '@/services/solana/query';
import { useCreateDomainTransaction } from '@/services/solana/mutation';
import { DomainsList } from '@/components/admin/domain';
export default function Admin() {
  const { wallets, ready } = useSolanaWallets();
  const [domainName, setDomainName] = useState('');
  const [description, setDescription] = useState('');
  
  const solanaWallet = wallets[0];
  const {sendTransaction} = useSendTransaction();
  const {mutate, isPending, isSuccess} = useInitialiseTransaction({address: ready ? solanaWallet.address : '', sendTransaction});
  const {data: programAuthority, isLoading} = useProgramAuthority( ready ? solanaWallet.address : '');
  const {mutate: createDomainMutation, isPending: createDomainPending, isSuccess: createDomainSuccess } = useCreateDomainTransaction(
    {address: ready ? solanaWallet.address : '', sendTransaction}, 
    {name: domainName, description: description}
  );
  const handleInitialize = () => {
    if (!solanaWallet) {
      toast.error("Please connect your Solana wallet first");
      return;
    }
    mutate();
  };

  const handleCreateDomain = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!solanaWallet) {
      toast.error("Please connect your Solana wallet first");
      return;
    }
    createDomainMutation();
  };

  if (!ready) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
        <p className="ml-2">Loading wallet information...</p>
      </div>
    );
  }

  if (!solanaWallet) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p>Please connect your Solana wallet to continue.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <p>{isLoading ? "Loading..." : `Program admin: ${programAuthority}`}</p>
      <p>You are: {solanaWallet.address}</p>
      <br></br>
      <Card className="mb-8 p-6">
        <h2 className="text-xl font-semibold mb-4">Initialize Program</h2>
        <p className="mb-4">
          This action needs to be performed only once to set up the program authority.
          Wallet connected: {solanaWallet.address.substring(0, 8)}...
        </p>
        <Button 
          onClick={handleInitialize} 
          disabled={isPending}
        >
          {isPending ? 'Initializing...' : 'Initialize Program'}
        </Button>
        {isSuccess && (
          <p className="text-green-500 mt-2">
            Program initialized successfully!
          </p>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Create New Domain</h2>
        <form onSubmit={handleCreateDomain}>
          <div className="mb-4">
            <label className="block mb-2">Domain Name</label>
            <Input 
              value={domainName} 
              onChange={(e) => setDomainName(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Description</label>
            <Textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>
          <Button 
            type="submit" 
            disabled={createDomainPending}
          >
            {createDomainPending ? 'Creating...' : 'Create Domain'}
          </Button>
        </form>
        {createDomainSuccess && (
          <div className="mt-4 p-4 bg-green-50 text-green-700 rounded">
            <p>Domain created successfully!</p>
            <p className="text-sm mt-1">Transaction signature: {createDomainSuccess}</p>
            <p className="text-sm mt-1">Domain address: {createDomainSuccess}</p>
          </div>
        )}
      </Card>
      <DomainsList walletAddress={solanaWallet.address} />
    </div>
  );
}