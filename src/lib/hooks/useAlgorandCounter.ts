import { useQuery } from '@tanstack/react-query';
import { fetchAlgorandCounterValue } from '../algorand/counter';
import { intentConfig } from '../intentConfig';

export function useAlgorandCounter(pollIntervalMs = 4000) {
  return useQuery({
    queryKey: ['algorand-counter', intentConfig.counterAppId],
    queryFn: fetchAlgorandCounterValue,
    refetchInterval: pollIntervalMs,
    staleTime: 2000,
    retry: 2,
  });
}
