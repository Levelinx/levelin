"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LockIcon } from "lucide-react";
import Link from "next/link";

export default function ReviewPage() {
  // In a real implementation, this would come from the user's profile/data
  const [userTokens] = useState(250);
  const requiredTokens = 1000;
  const isEligible = userTokens >= requiredTokens;

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <Link href="/new">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="bg-card rounded-xl border shadow-md p-8">
        <div className="flex flex-col items-center text-center">
          {!isEligible ? (
            <>
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                <LockIcon className="h-8 w-8 text-amber-600" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Review Access Locked</h1>
              <p className="text-muted-foreground mb-6 max-w-md">
                You need at least 1,000 tokens to be eligible for reviewing challenge submissions. 
                Continue completing challenges to earn more tokens!
              </p>
              <div className="w-full max-w-md bg-muted rounded-lg p-6 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Your progress</span>
                  <span className="text-sm font-medium">{userTokens} / {requiredTokens} tokens</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div 
                    className="bg-primary rounded-full h-2.5" 
                    style={{ width: `${Math.min(100, (userTokens / requiredTokens) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <Link href="/challenges">
                <Button className="gap-2">
                  Find Challenges
                </Button>
              </Link>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-4">You&apos;re Eligible to Review!</h1>
              <p className="text-muted-foreground mb-6">
                You can now review challenge submissions from other users. Your feedback helps the community grow!
              </p>
              <div className="grid gap-4 w-full max-w-md">
                {/* This would be populated with actual submissions to review */}
                <p className="text-center text-muted-foreground py-8">
                  No submissions to review at the moment. Check back soon!
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 