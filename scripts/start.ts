import chalk from "chalk";
import { program } from "commander";

console.info(
  chalk.hex("#B9AAFD")(`
▗▖  ▗▖▗▄▄▄▖▗▄▄▖ ▗▖ ▗▖▗▖   
▐▛▚▞▜▌▐▌   ▐▌ ▐▌▐▌▗▞▘▐▌   
▐▌  ▐▌▐▛▀▀▘▐▛▀▚▖▐▛▚▖ ▐▌   
▐▌  ▐▌▐▙▄▄▖▐▌ ▐▌▐▌ ▐▌▐▙▄▄▖
    `),
);

program
  .name("merkl-lite")
  .description("A script to start the merkl-lite")
  .option("--api <local|staging|production>", "the API_URL_* to choose as API_URL")
  .option("--build", "use the build command")
  .parse();

const options = program.opts();
const api = (options.api as string) ?? "production";

const API_URL = process.env[`API_URL_${((options.api as string) ?? "production").toUpperCase()}`];

const targetTag = (name: string, value: "staging" | "production" | "local") => {
  const color = {
    production: ["red", "bgRed"],
    staging: ["yellow", "bgYellow"],
    local: ["green", "bgGreen"],
  } as const satisfies {
    [V in typeof value]: [keyof typeof chalk, keyof typeof chalk];
  };

  return chalk.bold(`${name}: `) + chalk.bold[color[value][0]](`${value}`);
};

console.info(targetTag("api", api as "production"), "\n");

Bun.spawn(["bun", "dev"], {
  stdio: ["ignore", "inherit", "inherit"],
  env: { API_URL },
});
