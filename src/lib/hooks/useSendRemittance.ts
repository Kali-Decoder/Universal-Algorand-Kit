import { useState } from 'react'

type Step = 'idle' | 'approving' | 'sending' | 'confirming' | 'success' | 'error'

interface QuoteResult {
  fee: bigint
  netAmount: bigint
  amountOut: bigint
}

interface SendParams {
  token: `0x${string}`
  corridorId: string
  amountIn: bigint
  recipient: `0x${string}`
}

export function useSendRemittance() {
  const [step, setStep] = useState<Step>('idle')
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
  const [transferId, setTransferId] = useState<`0x${string}` | undefined>()
  const [error, setError] = useState<string | undefined>()

  const isLoading = step === 'approving' || step === 'sending' || step === 'confirming'

  const CORRIDOR_RATES: Record<string, { currency: string; rate: number }> = {
    US_PE: { currency: 'PEN', rate: 3.45 },
    US_PH: { currency: 'PHP', rate: 59.81 },
    US_ID: { currency: 'IDR', rate: 16980 },
    US_MX: { currency: 'MXN', rate: 17.68 },
    US_CO: { currency: 'COP', rate: 3701 },
  }

  function toQuote(
    corridorIdStr: string,
    amountIn: bigint,
  ): QuoteResult {
    const amountNum = Number(amountIn) / 1e6
    const feeNum = amountNum * 0.003
    const netNum = Math.max(amountNum - feeNum, 0)
    const corridor = CORRIDOR_RATES[corridorIdStr] ?? CORRIDOR_RATES.US_PE
    const amountOutNum = netNum * corridor.rate
    const amountOut = corridor.currency === 'IDR'
      ? BigInt(Math.round(amountOutNum))
      : BigInt(Math.round(amountOutNum * 1e6))
    return {
      fee: BigInt(Math.round(feeNum * 1e6)),
      netAmount: BigInt(Math.round(netNum * 1e6)),
      amountOut,
    }
  }

  function makeFakeHash(): `0x${string}` {
    const rand = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    return `0x${rand}` as `0x${string}`
  }

  async function getQuote(
    corridorIdStr: string,
    amountIn: bigint,
    token: `0x${string}`,
  ): Promise<QuoteResult> {
    void token
    return toQuote(corridorIdStr, amountIn)
  }

  async function send(params: SendParams): Promise<void> {
    try {
      setError(undefined)
      setStep('approving')
      await new Promise((resolve) => setTimeout(resolve, 500))
      setStep('sending')
      void params
      await new Promise((resolve) => setTimeout(resolve, 600))
      setStep('confirming')
      await new Promise((resolve) => setTimeout(resolve, 700))
      const fakeTx = makeFakeHash()
      setTxHash(fakeTx)
      setTransferId(makeFakeHash())
      setStep('success')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(msg)
      setStep('error')
    }
  }

  function reset() {
    setStep('idle')
    setTxHash(undefined)
    setTransferId(undefined)
    setError(undefined)
  }

  return { step, txHash, transferId, error, isLoading, getQuote, send, reset }
}
