import { Contract, Interface, JsonRpcProvider, Wallet } from "ethers";
import type { UniversalAlgoKitConfig } from "../types.js";
import { UniversalAlgoKitError } from "../errors.js";
import { ARC_GATEWAY_ABI, COUNTER_ABI, TODO_ABI } from "./abis.js";

export class EvmIntentSender {
  private readonly config: UniversalAlgoKitConfig;

  constructor(config: UniversalAlgoKitConfig) {
    this.config = config;
  }

  private getProvider() {
    if (!this.config.evm.rpcUrl) {
      throw new UniversalAlgoKitError("CONFIG", "Missing `evm.rpcUrl`");
    }
    return new JsonRpcProvider(this.config.evm.rpcUrl);
  }

  private getSigner() {
    const pk = this.config.evm.privateKey;
    if (!pk) {
      throw new UniversalAlgoKitError(
        "CONFIG",
        "Missing `evm.privateKey` (required to send intents)"
      );
    }
    const normalized = pk.startsWith("0x") ? pk : `0x${pk}`;
    return new Wallet(normalized, this.getProvider());
  }

  private getGatewayContract() {
    if (!this.config.evm.gatewayAddress) {
      throw new UniversalAlgoKitError("CONFIG", "Missing `evm.gatewayAddress`");
    }
    return new Contract(
      this.config.evm.gatewayAddress,
      ARC_GATEWAY_ABI,
      this.getSigner()
    );
  }

  async sendCounterIncrement() {
    const target = this.config.targets?.counterAddress;
    if (!target) {
      throw new UniversalAlgoKitError("CONFIG", "Missing `targets.counterAddress`");
    }
    const counterIface = new Interface(COUNTER_ABI);
    const callData = counterIface.encodeFunctionData("increment");

    const gateway = this.getGatewayContract();
    const tx = await gateway.requestIntent(target, callData, { value: 0n });
    const receipt = await tx.wait();
    return {
      hash: receipt?.hash ?? tx.hash,
      blockNumber: receipt?.blockNumber,
    };
  }

  async sendTodoAdd(text: string) {
    const target = this.config.targets?.todoAddress;
    if (!target) {
      throw new UniversalAlgoKitError("CONFIG", "Missing `targets.todoAddress`");
    }
    const todoIface = new Interface(TODO_ABI);
    const callData = todoIface.encodeFunctionData("addTodo", [text]);

    const gateway = this.getGatewayContract();
    const tx = await gateway.forwardIntentWithData(target, callData);
    const receipt = await tx.wait();
    return {
      hash: receipt?.hash ?? tx.hash,
      blockNumber: receipt?.blockNumber,
    };
  }

  async sendTodoToggle(id: bigint) {
    const target = this.config.targets?.todoAddress;
    if (!target) {
      throw new UniversalAlgoKitError("CONFIG", "Missing `targets.todoAddress`");
    }
    const todoIface = new Interface(TODO_ABI);
    const callData = todoIface.encodeFunctionData("toggleTodo", [id]);

    const gateway = this.getGatewayContract();
    const tx = await gateway.forwardIntentWithData(target, callData);
    const receipt = await tx.wait();
    return {
      hash: receipt?.hash ?? tx.hash,
      blockNumber: receipt?.blockNumber,
    };
  }

  async sendTodoDelete(id: bigint) {
    const target = this.config.targets?.todoAddress;
    if (!target) {
      throw new UniversalAlgoKitError("CONFIG", "Missing `targets.todoAddress`");
    }
    const todoIface = new Interface(TODO_ABI);
    const callData = todoIface.encodeFunctionData("deleteTodo", [id]);

    const gateway = this.getGatewayContract();
    const tx = await gateway.forwardIntentWithData(target, callData);
    const receipt = await tx.wait();
    return {
      hash: receipt?.hash ?? tx.hash,
      blockNumber: receipt?.blockNumber,
    };
  }
}

