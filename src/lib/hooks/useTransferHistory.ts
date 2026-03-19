import { useState, useEffect, useCallback } from 'react'
import { ADDRESSES, CORRIDORS, corridorId } from '../contracts'
import { formatUSDC } from '../utils/format'

interface ParsedTransfer {
  transferId: string
  sender: string
  recipient: string
  token: string
  tokenSymbol: string
  amountIn: string
  amountOut: string
  fee: string
  corridorId: string
  corridorLabel: string
  blockNumber: string
  txHash: string
}

function getTokenSymbol(tokenAddress: string): string {
  const lower = tokenAddress.toLowerCase()
  if (lower === ADDRESSES.USDC.toLowerCase()) return 'USDC'
  if (lower === ADDRESSES.USDT.toLowerCase()) return 'USDT'
  return 'Unknown'
}

function getCorridorLabel(corridorHex: string): string {
  for (const c of CORRIDORS) {
    if (corridorId(c.id).toLowerCase() === corridorHex.toLowerCase()) {
      return c.label
    }
  }
  return corridorHex.slice(0, 10) + '...'
}

export function useTransferHistory() {
  const [transfers, setTransfers] = useState<ParsedTransfer[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchLogs = useCallback(async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 350))

    const dummy: ParsedTransfer[] = [
      {
        transferId: '0x9f3b2c7a1a4c9d0f2f1e3d4c5b6a79801234567890abcdef1234567890abcd',
        sender: '0x1b2f3a4c5d6e7f8091a2b3c4d5e6f70918273645',
        recipient: '0x8f7e6d5c4b3a29180796a5b4c3d2e1f0a9b8c7d6',
        token: '0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B',
        tokenSymbol: getTokenSymbol('0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B'),
        amountIn: formatUSDC(450_000_000n),
        amountOut: '1500',
        fee: formatUSDC(1_350_000n),
        corridorId: corridorId('US_PE'),
        corridorLabel: getCorridorLabel(corridorId('US_PE')),
        blockNumber: '142903',
        txHash: '0x2a9d6f7c8b0e1f23456789abcdef0123456789abcdef0123456789abcdef01',
      },
      {
        transferId: '0x7c2b1a0f9e8d7c6b5a493827161514131211100ffedcba9876543210fedcba',
        sender: '0x1b2f3a4c5d6e7f8091a2b3c4d5e6f70918273645',
        recipient: '0x0d1e2f3a4b5c6d7e8f901234567890abcdef1234',
        token: '0x2bd8AbEB2F5598f8477560C70c742aFfc22912de',
        tokenSymbol: getTokenSymbol('0x2bd8AbEB2F5598f8477560C70c742aFfc22912de'),
        amountIn: formatUSDC(120_000_000n),
        amountOut: '7180',
        fee: formatUSDC(360_000n),
        corridorId: corridorId('US_PH'),
        corridorLabel: getCorridorLabel(corridorId('US_PH')),
        blockNumber: '142712',
        txHash: '0x6f5e4d3c2b1a0099887766554433221100ffeeddccbbaa998877665544332211',
      },
      {
        transferId: '0x5e4d3c2b1a0099887766554433221100ffeeddccbbaa998877665544332211aa',
        sender: '0x1b2f3a4c5d6e7f8091a2b3c4d5e6f70918273645',
        recipient: '0xaabbccddeeff00112233445566778899aabbccdd',
        token: '0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B',
        tokenSymbol: getTokenSymbol('0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B'),
        amountIn: formatUSDC(980_000_000n),
        amountOut: '3460',
        fee: formatUSDC(2_940_000n),
        corridorId: corridorId('US_MX'),
        corridorLabel: getCorridorLabel(corridorId('US_MX')),
        blockNumber: '142600',
        txHash: '0x9a8b7c6d5e4f30123456789abcdef0123456789abcdef0123456789abcdefab',
      },
    ]

    setTransfers(dummy)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    void fetchLogs()
  }, [fetchLogs])

  return { transfers, isLoading, refetch: fetchLogs }
}
