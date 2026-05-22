import { Command } from "commander";
import * as dotenv from "dotenv";
import { createUniversalAlgoKit } from "./uak.js";
import { envToConfig } from "./env.js";

dotenv.config();

const program = new Command()
  .name("uak")
  .description("Universal Algo Kit - EVM → Algorand cross-chain intents")
  .version("0.1.0");

program
  .command("relayer")
  .description("Start the EVM → Algorand intent relayer loop")
  .option("--once", "Poll once and exit", false)
  .action(async (opts) => {
    const uak = createUniversalAlgoKit(envToConfig(process.env));
    if (opts.once) {
      await uak.relayer.init();
      await uak.relayer.pollOnce();
      return;
    }
    await uak.relayer.start();
  });

program
  .command("send-counter")
  .description("Send a Counter increment intent (gateway.requestIntent)")
  .action(async () => {
    const uak = createUniversalAlgoKit(envToConfig(process.env));
    const receipt = await uak.sender.sendCounterIncrement();
    // eslint-disable-next-line no-console
    console.log(receipt);
  });

program
  .command("send-todo-add")
  .description("Send an addTodo intent (gateway.forwardIntentWithData)")
  .requiredOption("--text <text>", "Todo text")
  .action(async (opts) => {
    const uak = createUniversalAlgoKit(envToConfig(process.env));
    const receipt = await uak.sender.sendTodoAdd(String(opts.text));
    // eslint-disable-next-line no-console
    console.log(receipt);
  });

program
  .command("send-todo-toggle")
  .description("Send a toggleTodo intent (gateway.forwardIntentWithData)")
  .requiredOption("--id <id>", "Todo id (uint256)")
  .action(async (opts) => {
    const uak = createUniversalAlgoKit(envToConfig(process.env));
    const receipt = await uak.sender.sendTodoToggle(BigInt(opts.id));
    // eslint-disable-next-line no-console
    console.log(receipt);
  });

program
  .command("send-todo-delete")
  .description("Send a deleteTodo intent (gateway.forwardIntentWithData)")
  .requiredOption("--id <id>", "Todo id (uint256)")
  .action(async (opts) => {
    const uak = createUniversalAlgoKit(envToConfig(process.env));
    const receipt = await uak.sender.sendTodoDelete(BigInt(opts.id));
    // eslint-disable-next-line no-console
    console.log(receipt);
  });

program.parseAsync(process.argv).catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});
