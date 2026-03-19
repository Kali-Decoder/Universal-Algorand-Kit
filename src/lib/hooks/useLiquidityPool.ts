import { useMemo } from 'react'

interface PoolStats {
  totalAssets: bigint
  totalShares: bigint
  feesCollected: bigint
}

export function useLiquidityPool() {
  const { poolStats, userShares, apy } = useMemo(() => {
    const stats: PoolStats = {
      totalAssets: 12_500_000_000000n,
      totalShares: 12_250_000_000000n,
      feesCollected: 82_500_00000n,
    }
    return {
      poolStats: stats,
      userShares: 125_000_000000n,
      apy: '6.42%',
    }
  }, [])

  const userAssetValue =
    poolStats && poolStats.totalShares > 0n
      ? (userShares * poolStats.totalAssets) / poolStats.totalShares
      : 0n

  async function deposit(assets: bigint): Promise<void> {
    void assets
    await new Promise((resolve) => setTimeout(resolve, 600))
  }

  async function withdraw(assets: bigint): Promise<void> {
    void assets
    await new Promise((resolve) => setTimeout(resolve, 600))
  }

  return { poolStats, userShares, userAssetValue, apy, isLoading: false, deposit, withdraw }
}
