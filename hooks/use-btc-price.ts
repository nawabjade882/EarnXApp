'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

export function useBtcPrice() {
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPrice = useCallback(async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const price = data.bitcoin?.inr;
      if (price) {
        setBtcPrice(price);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        throw new Error('Price not found in API response');
      }
    } catch (error) {
      console.error("Failed to fetch BTC price:", error);
      toast({
        variant: 'destructive',
        title: "API Error",
        description: "Could not fetch BTC price.",
      });
      setBtcPrice(null);
    }
  }, [toast]);

  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  return { btcPrice, lastUpdated, refreshPrice: fetchPrice };
}
