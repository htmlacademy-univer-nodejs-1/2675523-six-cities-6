import { CommandInterface } from './commands/models/index.js';
import {CommandParser} from './command-parser.js';


type CommandCollection = Record<string, CommandInterface>;

export class CLIApplication {
  private commands: CommandCollection = {};

  constructor(
    private readonly defaultCommand: string = '--help'
  ) {}

  public registerCommands(commandList: CommandInterface[]): void {
    commandList.forEach((command) => {
      this.registerCommand(command);
    });
  }

  public getCommand(commandName: string): CommandInterface {
    return this.commands[commandName] ?? this.getDefaultCommand();
  }

  public getDefaultCommand(): CommandInterface | never {
    if (! this.commands[this.defaultCommand]) {
      throw new Error(`The default command (${this.defaultCommand}) is not registered.`);
    }
    return this.commands[this.defaultCommand];
  }

  public async processCommand(argv: string[]): Promise<void> {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];

    await command.execute(...commandArguments);
  }

  private registerCommand(command: CommandInterface): void {
    const commandName = command.getName();

    if (Object.hasOwn(this.commands, commandName)) {
      throw new Error(`Command ${commandName} is already registered`);
    }

    this.commands[commandName] = command;
  }
}
