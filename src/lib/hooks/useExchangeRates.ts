import { useState, useEffect, useCallback } from 'react';

const DUMMY_RATES: Record<string, number> = {
  PEN: 3.45,
  PHP: 59.81,
  IDR: 16980,
  MXN: 17.68,
  COP: 3701,
};

export function useExchangeRates() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setRates(DUMMY_RATES);
    setLastUpdated(new Date());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void fetchRates();
  }, [fetchRates]);

  return { rates, isLoading, error, lastUpdated, refetch: fetchRates };
}
