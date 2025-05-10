'use client';

import { useGetAllDomains } from '@/services/solana/query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface Domain {
  publicKey: string;
  name: string;
  description: string;
  authority: string;
}

interface DomainsListProps {
  walletAddress: string;
}

export function DomainsList({ walletAddress }: DomainsListProps) {
  const { data, isLoading, isError, error, refetch } = useGetAllDomains(walletAddress);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Spinner />
        <p className="ml-2">Loading domains...</p>
      </div>
    );
  }
  
  if (isError) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Domains</span>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded text-red-600">
            Failed to load domains: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!data?.domains || data.domains.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Domains</span>
            <Button variant="outline" onClick={() => refetch()}>
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-6">
            No domains found. Create your first domain above!
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Domains ({data.domains.length})</span>
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.domains.map((domain: Domain) => (
            <div 
              key={domain.publicKey} 
              className="border rounded-md p-4 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{domain.name}</h3>
                <span className="text-sm text-gray-500">
                  {domain.authority === walletAddress ? 'You are admin' : 'View only'}
                </span>
              </div>
              <p className="text-gray-700 mt-2">{domain.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                <div className="flex gap-2">
                  <span className="font-medium">Address:</span> 
                  <span className="font-mono">{domain.publicKey.substring(0, 8)}...{domain.publicKey.substring(domain.publicKey.length - 8)}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium">Authority:</span> 
                  <span className="font-mono">{domain.authority.substring(0, 8)}...{domain.authority.substring(domain.authority.length - 8)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}