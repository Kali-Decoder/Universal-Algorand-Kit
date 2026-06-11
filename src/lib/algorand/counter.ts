import { intentConfig } from '../intentConfig';

type GlobalStateEntry = {
  key: string;
  value: { type: number; uint?: number };
};

type ApplicationResponse = {
  params?: {
    'global-state'?: GlobalStateEntry[];
  };
};

const COUNTER_STATE_KEY = btoa('counter');

export async function fetchAlgorandCounterValue(
  appId = intentConfig.counterAppId,
  algodUrl = intentConfig.algodUrl
): Promise<number | null> {
  const res = await fetch(`${algodUrl}/v2/applications/${appId}`);
  if (!res.ok) {
    throw new Error(`Algod request failed (${res.status})`);
  }

  const data = (await res.json()) as ApplicationResponse;
  const globalState = data.params?.['global-state'] ?? [];
  const counterEntry = globalState.find((entry) => entry.key === COUNTER_STATE_KEY);

  if (!counterEntry?.value?.uint && counterEntry?.value?.uint !== 0) {
    return null;
  }

  return counterEntry.value.uint;
}

export async function waitForCounterChange(
  previousValue: number,
  options?: { timeoutMs?: number; intervalMs?: number; appId?: number }
): Promise<{ value: number; elapsedMs: number }> {
  const timeoutMs = options?.timeoutMs ?? 30_000;
  const intervalMs = options?.intervalMs ?? 2_000;
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    const current = await fetchAlgorandCounterValue(options?.appId);
    if (current !== null && current !== previousValue) {
      return { value: current, elapsedMs: Date.now() - started };
    }
  }

  throw new Error('Timed out waiting for Algorand counter update. Is the relayer running?');
}
