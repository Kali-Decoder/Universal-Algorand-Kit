import { Interface } from "ethers";
import { COUNTER_ABI, TODO_ABI } from "../evm/abis.js";

const counterIface = new Interface(COUNTER_ABI);
const todoIface = new Interface(TODO_ABI);

export function parseCounterCalldata(data: string) {
  return counterIface.parseTransaction({ data });
}

export function parseTodoCalldata(data: string) {
  return todoIface.parseTransaction({ data });
}

