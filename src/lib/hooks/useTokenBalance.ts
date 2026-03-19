import { useMemo } from 'react'
import { ADDRESSES } from '../contracts'

export function useTokenBalance(tokenAddress: `0x${string}`) {
  const { balance, symbol } = useMemo(() => {
    const dummyBalances: Record<string, { amount: number; symbol: string }> = {
      [ADDRESSES.USDC]: { amount: 12500.23, symbol: 'USDC' },
      [ADDRESSES.USDT]: { amount: 8300.5, symbol: 'USDT' },
    }
    const entry = dummyBalances[tokenAddress] ?? { amount: 0, symbol: 'TOKEN' }
    return {
      balance: BigInt(Math.round(entry.amount * 1_000_000)),
      symbol: entry.symbol,
    }
  }, [tokenAddress])

  const whole = balance / 1_000_000n
  const frac = balance % 1_000_000n
  const fracStr = frac.toString().padStart(6, '0').slice(0, 2)
  const formatted = `${whole.toString()}.${fracStr}`

  return { balance, formatted, symbol, isLoading: false, refetch: () => {} }
}
