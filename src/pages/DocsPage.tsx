import { useState } from 'react';
import { Link } from 'react-router-dom';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right.js';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link.js';
import Menu from 'lucide-react/dist/esm/icons/menu.js';
import X from 'lucide-react/dist/esm/icons/x.js';
import Copy from 'lucide-react/dist/esm/icons/copy.js';
import Check from 'lucide-react/dist/esm/icons/check.js';
import BookOpen from 'lucide-react/dist/esm/icons/book-open.js';
import Code2 from 'lucide-react/dist/esm/icons/code-2.js';
import Network from 'lucide-react/dist/esm/icons/network.js';
import Globe2 from 'lucide-react/dist/esm/icons/globe.js';
import HelpCircle from 'lucide-react/dist/esm/icons/help-circle.js';
import Zap from 'lucide-react/dist/esm/icons/zap.js';
import Shield from 'lucide-react/dist/esm/icons/shield.js';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.js';

const sections = [
  { id: 'overview', label: 'Introduction', icon: <BookOpen size={15} /> },
  { id: 'contracts', label: 'System Architecture', icon: <Code2 size={15} /> },
  { id: 'xcm', label: 'Transaction Flow', icon: <Network size={15} /> },
  { id: 'architecture', label: 'Architecture Diagrams', icon: <Network size={15} /> },
  { id: 'corridors', label: 'Universal Algo Account', icon: <Globe2 size={15} /> },
  { id: 'faq', label: 'Problem & Solution', icon: <HelpCircle size={15} /> },
];

const EXPLORER = 'https://assethub-paseo.subscan.io';

const contractAddresses = [
  { name: 'Gateway Contract (Ethereum)', address: '0x9b2a7c1A3f9F0dB2c54a1a8a9eF1bE2a6c8d0e11', network: 'Ethereum' },
  { name: 'Gateway Contract (Polygon)', address: '0x3f91B5d8A0cE2e7f2a4d6B1B0D5e2a9b7C1dE0f2', network: 'Polygon' },
  { name: 'Gateway Contract (Avalanche)', address: '0x6a8c1b2D4e5f7A9b0C1d2E3f4A5b6c7d8E9f0A1b', network: 'Avalanche' },
  { name: 'Gateway Contract (BNB Chain)', address: '0x8d0e1f2A3b4C5d6E7f8A9b0C1d2E3f4A5b6C7d8E', network: 'BNB Chain' },
  { name: 'AlgoExecutor (Algorand)', address: '0xA1b2c3D4e5F60718293a4B5c6D7e8F9012345678', network: 'Algorand' },
  { name: 'Relayer Network', address: '0x0000000000000000000000000000000000000000', network: 'Off-chain' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-accent)] text-xs border border-white/[0.08] hover:border-[var(--accent-25)] px-3 py-1.5 rounded-lg transition-colors"
    >
      {copied ? <Check size={12} className="text-[var(--color-accent)]" /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function CodeBlock({ code, lang = '' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative bg-black border border-white/[0.08] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-white/[0.02]">
        <span className="text-[var(--color-muted)] text-xs font-mono">{lang || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-accent)] text-xs transition-colors"
        >
          {copied ? <Check size={12} className="text-[var(--color-accent)]" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="text-[var(--color-accent)] font-mono text-sm leading-loose overflow-x-auto p-4">{code}</pre>
    </div>
  );
}

const architectureCode = `SOURCE CHAINS                    RELAYER NETWORK                 ALGORAND
(Ethereum / Polygon)            (Off-chain service)              EXECUTION LAYER

User Wallet
│
│ 1. forwardIntent()
▼
┌──────────────┐
│ Gateway      │
│ Contract     │
└──────┬───────┘
│
│ 2. Intent Event
▼
┌──────────────┐
│ Relayer      │
│ Service      │
└──────┬───────┘
│
│ 3. Execution Tx
▼
┌──────────────┐
│ AlgoExecutor │
│ Contract     │
└──────┬───────┘
│
│ 4. Inner Transaction
▼
┌──────────────┐
│ Application  │
│ Contract     │
└──────────────┘`;

const interfaceCode = `Ethereum Address → Universal Algo Account
Polygon Address → Same Algo Account
BNB Address → Same Algo Account`;

const architectureHighLevel = `┌───────────────────────────────────────────────────────────────────────┐
│                        Cross-Chain Intent System                      │
└───────────────────────────────────────────────────────────────────────┘

SOURCE CHAIN                    OFF-CHAIN                  ALGORAND
(Ethereum/Somnia)               (Relayer)                 (Destination)
────────────────                ─────────                 ─────────────

┌──────────────┐                                         ┌──────────────┐
│              │                                         │              │
│     User     │                                         │   Counter    │
│   Wallet     │                                         │ (App Logic)  │
│              │                                         │              │
└──────┬───────┘                                         └──────▲───────┘
       │                                                        │
       │ 1. Sign Transaction                                   │
       │    forwardIntent()                                    │
       │                                                        │
       ▼                                                        │
┌──────────────┐               ┌──────────────┐         ┌─────┴────────┐
│              │               │              │         │              │
│  ArcGateway  │──────────────▶│   Relayer    │────────▶│ ArcExecutor  │
│   Contract   │  2. Emit      │   Service    │ 3. Call │   Contract   │
│              │     Event     │              │ execute()│              │
└──────────────┘               └──────────────┘         └──────────────┘

Event:                         Listens &                 Executes:
IntentForwarded()             Processes                  - Verifies relayer
                                                        - Calls target
                                                        - Emits result`;

const architectureFlow = `┌─────────────────────────────────────────────────────────────────────────┐
│                         Transaction Flow Timeline                        │
└─────────────────────────────────────────────────────────────────────────┘

T0: User initiates intent on Source Chain
    │
    ├─▶ User calls: gateway.forwardIntent(counterAddress)
    │   - Tx sent to source chain
    │   - Nonce incremented: nonces[user]++
    │
T1: Transaction confirmed on Source Chain
    │
    ├─▶ Event emitted: IntentForwarded(user, target, nonce, timestamp)
    │   - Recorded in blockchain logs
    │   - Gas cost: ~50k gas
    │
T2: Relayer detects event (polling interval: ~5 sec)
    │
    ├─▶ Relayer queries: gateway.queryFilter(IntentForwarded)
    │   - Reads event data from logs
    │   - Extracts: user, target, nonce
    │
T3: Relayer prepares execution on Algorand
    │
    ├─▶ Relayer checks: executor.authorizedRelayers(relayer)
    │   - Verify relayer has permission
    │   - If not authorized: ABORT
    │
T4: Relayer executes on Algorand
    │
    ├─▶ Relayer calls: executor.execute(user, target)
    │   - Tx sent to Algorand
    │   - Relayer pays gas on Algorand
    │
T5: Executor processes intent
    │
    ├─▶ Executor calls: Counter(target).increment()
    │   - try-catch wrapper for safety
    │   - State change: count++
    │
T6: Result emitted on Algorand
    │
    └─▶ Event emitted: IntentExecuted(user, target, success)
        - Confirmation of execution
        - Gas cost: ~70k gas

Total Time: T0 → T6 = ~10-30 seconds (depending on block times + polling)`;

const architectureContracts = `┌──────────────────────────────────────────────────────────────────┐
│                    Contract Interactions                         │
└──────────────────────────────────────────────────────────────────┘

SOURCE CHAIN CONTRACTS                 ALGORAND CONTRACTS
─────────────────────                 ───────────────────

┌─────────────────────┐              ┌─────────────────────┐
│    ArcGateway       │              │   ArcExecutor       │
├─────────────────────┤              ├─────────────────────┤
│                     │              │                     │
│ State:              │              │ State:              │
│ • nonces[]          │              │ • owner             │
│                     │              │ • authorizedRelayers│
│ Functions:          │              │ • universalAccounts │
│ ✓ forwardIntent()   │              │                     │
│ ✓ forwardIntent     │              │ Functions:          │
│   WithData()        │              │ ✓ execute()         │
│ ✓ getNonce()        │              │ ✓ executeWithData() │
│                     │              │ ✓ setRelayer        │
│ Events:             │              │   Authorization()   │
│ • IntentForwarded   │              │                     │
│ • IntentForwarded   │              │ Events:             │
│   WithData          │              │ • IntentExecuted    │
└─────────────────────┘              │ • RelayerAuthorized │
                                     └──────────┬──────────┘
                                               │
                                               │ calls
                                               ▼
                                    ┌─────────────────────┐
                                    │     Counter         │
                                    ├─────────────────────┤
                                    │                     │
                                    │ State:              │
                                    │ • count             │
                                    │                     │
                                    │ Functions:          │
                                    │ ✓ increment()       │
                                    │ ✓ getCount()        │
                                    │                     │
                                    │ Events:             │
                                    │ • Incremented       │
                                    └─────────────────────┘`;

const architectureAccess = `┌────────────────────────────────────────────────────────────┐
│                    Access Control Matrix                    │
└────────────────────────────────────────────────────────────┘

ArcExecutor Contract:

┌────────────────┬──────────────┬─────────────┬──────────────┐
│    Function    │     User     │  Relayer    │    Owner     │
├────────────────┼──────────────┼─────────────┼──────────────┤
│ execute()      │      ✗       │      ✓      │      ✓       │
├────────────────┼──────────────┼─────────────┼──────────────┤
│ executeWith    │      ✗       │      ✓      │      ✓       │
│ Data()         │              │             │              │
├────────────────┼──────────────┼─────────────┼──────────────┤
│ setRelayer     │      ✗       │      ✗      │      ✓       │
│ Authorization()│              │             │              │
└────────────────┴──────────────┴─────────────┴──────────────┘

ArcGateway Contract:

┌────────────────┬──────────────┬─────────────┬──────────────┐
│    Function    │     User     │  Relayer    │    Owner     │
├────────────────┼──────────────┼─────────────┼──────────────┤
│ forwardIntent()│      ✓       │      ✓      │      ✓       │
├────────────────┼──────────────┼─────────────┼──────────────┤
│ forwardIntent  │      ✓       │      ✓      │      ✓       │
│ WithData()     │              │             │              │
├────────────────┼──────────────┼─────────────┼──────────────┤
│ getNonce()     │      ✓       │      ✓      │      ✓       │
│     (view)     │              │             │              │
└────────────────┴──────────────┴─────────────┴──────────────┘

Counter Contract:

┌────────────────┬──────────────┬─────────────┬──────────────┐
│    Function    │     User     │  Executor   │    Owner     │
├────────────────┼──────────────┼─────────────┼──────────────┤
│ increment()    │      ✓       │      ✓      │      ✓       │
├────────────────┼──────────────┼─────────────┼──────────────┤
│ getCount()     │      ✓       │      ✓      │      ✓       │
│     (view)     │              │             │              │
└────────────────┴──────────────┴─────────────┴──────────────┘

✓ = Allowed    ✗ = Denied`;

const architectureDataFlow = `┌──────────────────────────────────────────────────────────────────┐
│                         Data Flow                                │
└──────────────────────────────────────────────────────────────────┘

1. INTENT CREATION (Source Chain)
   ─────────────────────────────
   
   User Input:
   ┌───────────────────────┐
   │ target: 0x1234...     │
   │ (Counter address)     │
   └───────────┬───────────┘
               │
               ▼
   ArcGateway Processing:
   ┌───────────────────────┐
   │ user = msg.sender     │
   │ nonce = nonces[user]++│
   │ timestamp = block.ts  │
   └───────────┬───────────┘
               │
               ▼
   Event Emission:
   ┌───────────────────────────────┐
   │ IntentForwarded(              │
   │   user: 0xAbC...,             │
   │   target: 0x123...,           │
   │   nonce: 5,                   │
   │   timestamp: 1706745600       │
   │ )                             │
   └───────────────────────────────┘

2. RELAYER PROCESSING (Off-Chain)
   ──────────────────────────────
   
   Event Reading:
   ┌───────────────────────┐
   │ Query blockchain logs │
   │ Filter: IntentForwarded│
   │ Blocks: last → current│
   └───────────┬───────────┘
               │
               ▼
   Data Extraction:
   ┌───────────────────────┐
   │ user: 0xAbC...        │
   │ target: 0x123...      │
   │ nonce: 5              │
   │ timestamp: 1706745600 │
   └───────────┬───────────┘
               │
               ▼
   Transaction Preparation:
   ┌───────────────────────┐
   │ to: ArcExecutor       │
   │ data: execute(        │
   │   user, target        │
   │ )                     │
   └───────────────────────┘

3. INTENT EXECUTION (Algorand)
   ────────────────────────────
   
   Authorization Check:
   ┌───────────────────────┐
   │ msg.sender == relayer?│
   │ authorizedRelayers[   │
   │   msg.sender          │
   │ ] == true?            │
   └───────────┬───────────┘
               │
               ▼
   Target Execution:
   ┌───────────────────────┐
   │ try {                 │
   │   Counter(target)     │
   │     .increment()      │
   │ } catch {             │
   │   success = false     │
   │ }                     │
   └───────────┬───────────┘
               │
               ▼
   Result Emission:
   ┌───────────────────────┐
   │ IntentExecuted(       │
   │   user: 0xAbC...,     │
   │   target: 0x123...,   │
   │   success: true       │
   │ )                     │
   └───────────────────────┘

4. STATE CHANGES
   ─────────────
   
   Source Chain:
   ┌───────────────────────┐
   │ nonces[user] = 6      │
   └───────────────────────┘
   
   Algorand:
   ┌───────────────────────┐
   │ counter.count = 42    │
   │ (incremented from 41) │
   └───────────────────────┘`;

const architectureResponsibilities = `┌──────────────────────────────────────────────────────────────┐
│               Component Responsibility Matrix                │
└──────────────────────────────────────────────────────────────┘

┌─────────────────┬─────────────────────────────────────────────┐
│   Component     │            Responsibilities                 │
├─────────────────┼─────────────────────────────────────────────┤
│  ArcGateway     │ • Accept user intents                       │
│  (Source)       │ • Emit events (no state)                    │
│                 │ • Track nonces                              │
│                 │ • Provide replay protection                 │
├─────────────────┼─────────────────────────────────────────────┤
│  Relayer        │ • Monitor source chain events               │
│  (Off-Chain)    │ • Parse event data                          │
│                 │ • Submit txs to Algorand                    │
│                 │ • Handle errors & retries                   │
│                 │ • Log operations                            │
├─────────────────┼─────────────────────────────────────────────┤
│  ArcExecutor    │ • Verify relayer authorization              │
│  (Algorand)     │ • Execute intents safely                    │
│                 │ • Manage relayer access                     │
│                 │ • Emit execution results                    │
│                 │ • Handle execution failures                 │
├─────────────────┼─────────────────────────────────────────────┤
│  Counter        │ • Implement app logic                       │
│  (Algorand)     │ • Maintain state (count)                    │
│                 │ • Process increment calls                   │
│                 │ • Emit state changes                        │
└─────────────────┴─────────────────────────────────────────────┘`;

const architectureState = `┌──────────────────────────────────────────────────────────────┐
│                  Intent State Transitions                     │
└──────────────────────────────────────────────────────────────┘

    START
      │
      ▼
┌──────────┐
│  PENDING │  ◀── Intent created on source chain
└────┬─────┘      User signs transaction
     │
     │ Event emitted
     │
     ▼
┌──────────┐
│ DETECTED │  ◀── Relayer sees event in logs
└────┬─────┘      Querying blockchain events
     │
     │ Relayer processes
     │
     ▼
┌──────────┐
│SUBMITTING│  ◀── Relayer sends tx to Algorand
└────┬─────┘      Transaction in mempool
     │
     │ Tx confirmed
     │
     ▼
┌──────────┐
│EXECUTING │  ◀── ArcExecutor processes
└────┬─────┘      Calling target contract
     │
     ├──────────────┬──────────────┐
     │              │              │
   Success        Failure      Invalid
     │              │              │
     ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│COMPLETED │  │  FAILED  │  │ REJECTED │
└──────────┘  └──────────┘  └──────────┘
     │              │              │
     │              │              │
     └──────────────┴──────────────┘
                    │
                    ▼
                   END

States:
- PENDING: Intent forwarded, waiting for relayer
- DETECTED: Relayer found event, preparing execution
- SUBMITTING: Transaction sent to Algorand
- EXECUTING: ArcExecutor processing the intent
- COMPLETED: Successfully executed ✓
- FAILED: Execution failed but handled gracefully
- REJECTED: Authorization or validation failed`;

const architectureTabs = [
  { id: 'high-level', label: 'High-Level', code: architectureHighLevel },
  { id: 'flow', label: 'Flow', code: architectureFlow },
  { id: 'contracts', label: 'Contracts', code: architectureContracts },
  { id: 'access', label: 'Access Control', code: architectureAccess },
  { id: 'data', label: 'Data Flow', code: architectureDataFlow },
  { id: 'responsibilities', label: 'Responsibilities', code: architectureResponsibilities },
  { id: 'state', label: 'State Transitions', code: architectureState },
];

function ArchitectureSection() {
  const [activeTab, setActiveTab] = useState(architectureTabs[0]?.id ?? 'high-level');
  const active = architectureTabs.find((t) => t.id === activeTab) ?? architectureTabs[0];

  return (
    <div>
      <div className="flex items-center gap-2 text-[var(--color-accent)] text-sm font-semibold mb-3 uppercase tracking-widest">
        <Network size={14} />
        Visuals
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-4">System Architecture Diagrams</h1>
      <p className="text-[var(--color-muted)] text-lg mb-8 leading-relaxed">
        A full visual reference for how cross-chain intents are captured, relayed, and executed on Algorand.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {architectureTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-[var(--accent-12)] text-[var(--color-accent)] border border-[var(--accent-35)]'
                : 'bg-white/[0.04] text-[var(--color-muted)] border border-white/[0.08] hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-[var(--color-surface-1)] border border-white/[0.08] rounded-2xl p-5 mb-4">
        <div className="text-[var(--color-muted)] text-xs uppercase tracking-widest mb-2">
          {active?.label}
        </div>
        <CodeBlock code={active?.code ?? ''} lang="diagram" />
      </div>
    </div>
  );
}

const docsContent: Record<string, React.ReactNode> = {
  overview: (
    <div>
      <div className="flex items-center gap-2 text-[var(--color-accent)] text-sm font-semibold mb-3 uppercase tracking-widest">
        <BookOpen size={14} />
        Universal Algo Kit
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">Cross-Chain Intent Infrastructure for Algorand</h1>
      <p className="text-[var(--color-muted)] text-lg mb-6 leading-relaxed">
        Universal Algo Kit is an infrastructure SDK designed to make <strong className="text-white">Algorand the universal execution layer for multi-chain applications</strong>.
      </p>
      <p className="text-[var(--color-muted)] text-lg mb-8 leading-relaxed">
        Today’s blockchain ecosystem is fragmented. Users interact across multiple chains such as Ethereum, Polygon, Avalanche, and others. This forces developers to deploy applications on multiple networks and manage fragmented liquidity and state.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Execution Layer', value: 'Algorand', icon: <Zap size={16} />, desc: 'Unified execution and settlement' },
          { label: 'Deploy Once', value: 'Any Chain', icon: <Shield size={16} />, desc: 'Users stay on their source chain' },
          { label: 'Intent-Based', value: 'Cross-Chain', icon: <Globe2 size={16} />, desc: 'Securely relayed execution' },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--color-surface-1)] border border-white/[0.08] rounded-2xl p-5 group hover:border-[var(--accent-20)] transition-colors">
            <div className="flex items-center gap-2 text-[var(--color-accent)] mb-3">
              {s.icon}
              <span className="text-[var(--color-muted)] text-xs">{s.label}</span>
            </div>
            <div className="font-mono font-black text-2xl text-white mb-1">{s.value}</div>
            <div className="text-[var(--color-muted)] text-xs">{s.desc}</div>
          </div>
        ))}
      </div>

      <h2 className="text-white font-bold text-xl mb-4">Problem Statement</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-[var(--color-surface-1)] border border-white/[0.08] rounded-2xl p-5">
          <div className="text-white font-semibold mb-3">For Users</div>
          <ul className="text-[var(--color-muted)] text-sm leading-relaxed list-disc pl-5 space-y-1">
            <li>switch networks frequently</li>
            <li>bridge assets between chains</li>
            <li>manage multiple wallets and confirmations</li>
            <li>pay high gas costs on multiple chains</li>
          </ul>
        </div>
        <div className="bg-[var(--color-surface-1)] border border-white/[0.08] rounded-2xl p-5">
          <div className="text-white font-semibold mb-3">For Developers</div>
          <ul className="text-[var(--color-muted)] text-sm leading-relaxed list-disc pl-5 space-y-1">
            <li>deploy contracts on multiple chains</li>
            <li>maintain multiple codebases</li>
            <li>manage fragmented liquidity</li>
            <li>handle complex cross-chain logic</li>
          </ul>
        </div>
      </div>

      <h2 className="text-white font-bold text-xl mb-4">Solution</h2>
      <p className="text-[var(--color-muted)] text-sm leading-relaxed mb-4">
        Universal Algo Kit provides a <strong className="text-white">cross-chain intent infrastructure</strong> that enables developers to deploy applications on Algorand while allowing users from other blockchains to interact with those applications seamlessly.
      </p>
      <p className="text-[var(--color-muted)] text-sm leading-relaxed">
        Instead of executing logic on multiple chains, Universal Algo Kit forwards user actions from external chains and executes them on Algorand.
      </p>

      <div className="mt-8 bg-[var(--accent-04)] border border-[var(--accent-15)] rounded-2xl p-5">
        <div className="flex items-center gap-2 text-[var(--color-accent)] font-semibold mb-2">
          <Zap size={15} />
          Intent-Based Architecture
        </div>
        <p className="text-[var(--color-muted)] text-sm leading-relaxed">
          The system uses an <strong className="text-white">intent-based architecture</strong>, where user actions performed on external chains are captured and securely relayed to Algorand for execution.
        </p>
      </div>
    </div>
  ),
  contracts: (
    <div>
      <div className="flex items-center gap-2 text-[var(--color-accent)] text-sm font-semibold mb-3 uppercase tracking-widest">
        <Code2 size={14} />
        Architecture
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-4">System Architecture</h1>
      <p className="text-[var(--color-muted)] text-lg mb-8">
        Universal Algo Kit consists of four main components: Gateway Contracts, Relayer Network, AlgoExecutor Contract, and Application Contracts.
      </p>

      <div className="flex flex-col gap-3 mb-8">
        {contractAddresses.map((c) => (
          <div key={c.name} className="bg-[var(--color-surface-1)] border border-white/[0.08] hover:border-[var(--accent-20)] rounded-xl p-4 transition-colors group">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                  <div className="text-white font-bold">{c.name}</div>
                  <span className="text-[var(--color-muted)] text-xs bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 rounded-full">{c.network}</span>
                </div>
                <div className="font-mono text-[var(--accent-70)] text-xs break-all mt-2 pl-4">{c.address}</div>
              </div>
              <div className="flex items-center gap-2">
                <CopyButton text={c.address} />
                <a
                  href={`${EXPLORER}/account/${c.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[var(--color-muted)] hover:text-white text-xs border border-white/[0.08] hover:border-white/[0.15] px-3 py-1.5 rounded-lg transition-colors"
                >
                  <ExternalLink size={12} />
                  Explorer
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-white font-bold text-xl mb-4">Architecture Diagram</h2>
      <CodeBlock code={architectureCode} lang="diagram" />
    </div>
  ),
  xcm: (
    <div>
      <div className="flex items-center gap-2 text-[var(--color-accent)] text-sm font-semibold mb-3 uppercase tracking-widest">
        <Network size={14} />
        Flow
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-4">Transaction Flow</h1>
      <p className="text-[var(--color-muted)] text-lg mb-8 leading-relaxed">
        The lifecycle of a transaction follows several steps. The total process typically takes <strong className="text-white">10–30 seconds depending on network conditions</strong>.
      </p>

      <div className="space-y-3 mb-8">
        {[
          { step: '01', title: 'User Action', desc: 'A user interacts with an application interface while connected to a source chain.' },
          { step: '02', title: 'Intent Submission', desc: 'The user signs a transaction that sends an intent to the gateway contract.' },
          { step: '03', title: 'Intent Event', desc: 'The gateway contract emits an intent event.' },
          { step: '04', title: 'Relayer Detection', desc: 'Relayers detect the event and extract the intent data.' },
          { step: '05', title: 'Algorand Execute', desc: 'The relayer submits a transaction to the AlgoExecutor contract.' },
          { step: '06', title: 'Execution', desc: 'The executor processes the intent and triggers the application logic.' },
          { step: '07', title: 'State Updated', desc: 'The application contract updates its state on Algorand.' },
        ].map((item, i) => (
          <div key={item.step} className="flex gap-5 bg-[var(--color-surface-1)] border border-white/[0.08] hover:border-[var(--accent-20)] rounded-2xl p-5 transition-colors group">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-08)] border border-[var(--accent-20)] flex items-center justify-center shrink-0">
                <span className="text-[var(--color-accent)] font-black text-xs font-mono">{item.step}</span>
              </div>
              {i < 6 && <div className="w-px flex-1 bg-[var(--accent-10)]" />}
            </div>
            <div className="pt-2 pb-4">
              <h3 className="text-white font-bold mb-2">{item.title}</h3>
              <p className="text-[var(--color-muted)] text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-surface-1)] border border-white/[0.08] rounded-2xl p-6">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <ArrowRight size={15} className="text-[var(--color-accent)]" />
          Component Responsibilities
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Gateway Contracts', xcm: 'accept user intents, emit intent events, maintain nonce protection, forward calldata', bridge: ' ' },
            { label: 'Relayer Network', xcm: 'monitor gateway events, validate intent data, forward execution requests, handle retries and ordering', bridge: ' ' },
            { label: 'AlgoExecutor', xcm: 'verify authorized relayers, decode forwarded calldata, execute application calls, emit execution results', bridge: ' ' },
            { label: 'Application Contracts', xcm: 'standard Algorand smart contracts (DeFi, lending, games, DAOs)', bridge: ' ' },
          ].map((row) => (
            <div key={row.label} className="col-span-2 grid grid-cols-3 gap-3 text-sm">
              <div className="text-[var(--color-muted)] flex items-center">{row.label}</div>
              <div className="text-[var(--color-accent)] bg-[var(--accent-05)] border border-[var(--accent-10)] rounded-lg px-3 py-2 text-xs">{row.xcm}</div>
              <div className="text-[var(--color-muted)] bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-xs opacity-60">Core component</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  architecture: <ArchitectureSection />,
  corridors: (
    <div>
      <div className="flex items-center gap-2 text-[var(--color-accent)] text-sm font-semibold mb-3 uppercase tracking-widest">
        <Globe2 size={14} />
        Identity
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-4">Universal Algo Account</h1>
      <p className="text-[var(--color-muted)] text-lg mb-8">
        Universal Algo Kit introduces the concept of a <strong className="text-white">Universal Algo Account</strong>, which maps external blockchain wallets to deterministic Algorand identities. This ensures that a user interacting from different chains still maintains a <strong className="text-white">single unified identity and balance on Algorand</strong>.
      </p>

      <h2 className="text-white font-bold text-xl mb-4">Example Mapping</h2>
      <CodeBlock code={interfaceCode} lang="mapping" />

      <div className="bg-[var(--color-surface-1)] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1.5fr_0.7fr_1fr_0.7fr_0.8fr] gap-3 px-5 py-3 bg-white/[0.02] border-b border-white/[0.06]">
          {['Source Chain Wallet', 'Maps To', 'Identity', 'Balance', 'Status'].map((h) => (
            <div key={h} className="text-[var(--color-muted)] text-xs font-semibold uppercase tracking-widest">{h}</div>
          ))}
        </div>
        {[
          { corridor: 'Ethereum Address', currency: 'Universal Algo Account', rate: 'Unified', fee: 'Unified', status: 'Active' },
          { corridor: 'Polygon Address', currency: 'Same Algo Account', rate: 'Unified', fee: 'Unified', status: 'Active' },
          { corridor: 'BNB Address', currency: 'Same Algo Account', rate: 'Unified', fee: 'Unified', status: 'Active' },
          { corridor: 'Avalanche Address', currency: 'Same Algo Account', rate: 'Unified', fee: 'Unified', status: 'Active' },
          { corridor: 'Any EVM Address', currency: 'Deterministic', rate: 'Unified', fee: 'Unified', status: 'Active' },
        ].map((row) => (
          <div key={row.corridor} className="grid grid-cols-[1.5fr_0.7fr_1fr_0.7fr_0.8fr] gap-3 px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors items-center">
            <div className="text-white text-sm">{row.corridor}</div>
            <div className="text-[var(--color-muted)] font-mono text-sm">{row.currency}</div>
            <div className="text-white font-mono text-sm">{row.rate}</div>
            <div className="text-[var(--color-accent)] font-mono text-sm font-semibold">{row.fee}</div>
            <div>
              <span className="inline-flex items-center gap-1.5 text-[var(--color-accent)] text-xs font-semibold bg-[var(--accent-08)] border border-[var(--accent-20)] px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                {row.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[var(--color-muted)] text-xs mt-4 text-center">A single unified identity and balance on Algorand across source chains.</p>
    </div>
  ),
  faq: (
    <div>
      <div className="flex items-center gap-2 text-[var(--color-accent)] text-sm font-semibold mb-3 uppercase tracking-widest">
        <HelpCircle size={14} />
        Context
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-4">Problem & Solution</h1>
      <p className="text-[var(--color-muted)] text-lg mb-8">Universal Algo Kit is built to solve multi-chain fragmentation by routing intents to Algorand for execution.</p>
      <div className="space-y-3">
        {[
          {
            q: 'What is Universal Algo Kit?',
            a: 'Universal Algo Kit is an infrastructure SDK designed to make Algorand the universal execution layer for multi-chain applications.',
          },
          {
            q: 'How does it work?',
            a: 'A user initiates an action on a supported source chain, a gateway contract records the user’s intent, a relayer network detects the intent event, the relayer forwards the request to Algorand, and an executor contract processes the request and executes the application logic.',
          },
          {
            q: 'Why is this better for developers?',
            a: 'Developers can deploy applications once on Algorand while enabling users from any blockchain to interact with those applications without switching networks or bridging assets manually.',
          },
          {
            q: 'How long does a cross-chain execution take?',
            a: 'The total process typically takes 10–30 seconds depending on network conditions.',
          },
        ].map((item, i) => (
          <details key={i} className="group bg-[var(--color-surface-1)] border border-white/[0.08] hover:border-[var(--accent-20)] rounded-xl overflow-hidden transition-colors">
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none">
              <span className="text-white font-semibold text-sm pr-4">{item.q}</span>
              <ChevronRight size={16} className="text-[var(--color-muted)] group-open:rotate-90 transition-transform shrink-0" />
            </summary>
            <div className="px-5 pb-5 text-[var(--color-muted)] text-sm leading-relaxed border-t border-white/[0.06] pt-4">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  ),
};

export default function DocsPage() {
  const [active, setActive] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      <div className="border-b border-white/[0.08] bg-[var(--surface-2-80)] backdrop-blur-sm px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-[var(--color-accent)] text-xl font-bold">●</span>
          <span className="text-white font-extrabold text-base">Universal Algo Kit</span>
          <ChevronRight size={14} className="text-[var(--color-muted)]" />
          <span className="text-[var(--color-muted)] text-sm">Docs</span>
        </Link>
        <div className="flex items-center gap-3">
          {/* <button
            type="button"
            aria-disabled="true"
            className="bg-[var(--color-accent)] text-black font-bold px-4 py-2 rounded-xl text-sm transition-all opacity-70 cursor-not-allowed"
          >
            Launch App
          </button> */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[var(--color-muted)] hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className="flex max-w-6xl mx-auto">
        <aside className={`${mobileMenuOpen ? 'block absolute z-20 w-64 bg-[var(--color-surface-2)] shadow-2xl' : 'hidden'} md:block md:relative md:w-60 shrink-0 border-r border-white/[0.08] min-h-[calc(100vh-65px)] p-4`}>
          <div className="text-[var(--color-muted)] text-xs font-semibold uppercase tracking-widest mb-4 px-3">Documentation</div>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => { setActive(s.id); setMobileMenuOpen(false); }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
                active === s.id
                  ? 'bg-[var(--accent-08)] text-[var(--color-accent)] border border-[var(--accent-20)]'
                  : 'text-[var(--color-muted)] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span className={active === s.id ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]'}>{s.icon}</span>
              {s.label}
            </button>
          ))}

          <div className="mt-6 pt-6 border-t border-white/[0.06] px-3">
            <div className="text-[var(--color-muted)] text-xs mb-3">Need help?</div>
            <a
              href="https://github.com/Kali-Decoder"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-accent)] text-xs transition-colors"
            >
              <ExternalLink size={11} /> GitHub
            </a>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10 max-w-3xl">
          {docsContent[active]}
        </main>
      </div>
    </div>
  );
}
