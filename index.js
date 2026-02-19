import readline from "readline";

const BLUE = "\x1b[94m";
const RED = "\x1b[91m";
const CYAN = "\x1b[96m";
const GREEN = "\x1b[92m";
const RESET = "\x1b[0m";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const state = {
  policies: {},
  audit: []
};

function banner() {
  console.clear();
  console.log(BLUE);
  console.log("╔══════════════════════════════════════╗");
  console.log("        ROOM POLICY ENGINE");
  console.log("╚══════════════════════════════════════╝");
  console.log(RESET);
  console.log(CYAN + "Cyber Rule Validation Framework\n" + RESET);
}

function menu() {
  console.log(BLUE + "Commands:" + RESET);
  console.log("1. define-policy");
  console.log("2. validate-action");
  console.log("3. list-policies");
  console.log("4. audit-log");
  console.log("5. exit\n");

  rl.question("policy> ", handle);
}

function handle(cmd) {
  switch (cmd.trim()) {

    case "1":
    case "define-policy":
      rl.question("Policy Name: ", (name) => {
        rl.question("Max Amount Limit: ", (limit) => {
          state.policies[name] = { limit: Number(limit) };
          console.log(GREEN + "\n✔ Policy registered\n" + RESET);
          menu();
        });
      });
      break;

    case "2":
    case "validate-action":
      rl.question("Policy Name: ", (name) => {
        if (!state.policies[name]) {
          console.log(RED + "\nPolicy not found\n" + RESET);
          return menu();
        }

        rl.question("Action Amount: ", (amount) => {
          const num = Number(amount);
          const policy = state.policies[name];

          let decision = "APPROVED";
          let color = GREEN;

          if (num > policy.limit) {
            decision = "REJECTED";
            color = RED;
          }

          state.audit.push({
            policy: name,
            amount: num,
            decision,
            time: new Date().toISOString()
          });

          console.log(color + `\nDecision: ${decision}\n` + RESET);
          menu();
        });
      });
      break;

    case "3":
    case "list-policies":
      console.log(BLUE + "\nRegistered Policies:\n" + RESET);
      console.log(state.policies, "\n");
      menu();
      break;

    case "4":
    case "audit-log":
      console.log(BLUE + "\nAudit Trail:\n" + RESET);
      console.log(state.audit, "\n");
      menu();
      break;

    case "5":
    case "exit":
      console.log(CYAN + "\nShutting down Policy Engine...\n" + RESET);
      rl.close();
      break;

    default:
      console.log(RED + "\nUnknown command\n" + RESET);
      menu();
  }
}

banner();
menu();
