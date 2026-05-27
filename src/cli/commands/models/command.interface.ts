export interface CommandInterface {
  getName(): string;
  execute(...params: string[]): Promise<void> | void;
}
