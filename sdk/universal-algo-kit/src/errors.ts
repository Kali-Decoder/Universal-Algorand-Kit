export class UniversalAlgoKitError extends Error {
  readonly code:
    | "CONFIG"
    | "EVM"
    | "ALGORAND"
    | "RELAYER"
    | "VALIDATION"
    | "UNKNOWN";

  constructor(
    code: UniversalAlgoKitError["code"],
    message: string,
    options?: { cause?: unknown }
  ) {
    super(message);
    this.name = "UniversalAlgoKitError";
    this.code = code;
    if (options?.cause) (this as any).cause = options.cause;
  }
}

