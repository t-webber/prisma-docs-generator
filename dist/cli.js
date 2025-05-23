#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const meow_1 = __importDefault(require("meow"));
const kleur_1 = __importDefault(require("kleur"));
const express_1 = __importDefault(require("express"));
const internals_1 = require("@prisma/internals");
const cli = (0, meow_1.default)(`
  Usage
  $ prisma-docs-generator [command] [flags]

  Options
    -v Prints out the version number

    ${kleur_1.default.bold('serve')}
      --port -p   Specify the port from which this cli should serve the docs
    
`, {
    flags: {
        port: {
            type: 'number',
            alias: 'p',
            default: 5858,
        },
        version: {
            alias: 'v',
        },
    },
});
class ExpressService {
    constructor(port, path) {
        this.port = port;
        this.servePath = path;
        this.exp = (0, express_1.default)();
        this.appInstance = null;
    }
    start() {
        this.exp.use('/', express_1.default.static(this.servePath));
        this.appInstance = this.exp.listen(this.port, () => {
            console.log(`Prisma Docs Generator started at http://localhost:${this.port}`);
        });
    }
    exit() {
        if (this.appInstance) {
            this.appInstance.close();
        }
    }
}
async function execute(cli) {
    var _a, _b;
    const { flags: { port }, input, } = cli;
    if (input.length < 1) {
        console.error(kleur_1.default.red('No sub command was specified'));
        cli.showHelp();
    }
    const mainSubcommand = input[0];
    switch (mainSubcommand) {
        case 'serve': {
            //@ts-ignore
            const schemaPath = await (0, internals_1.getSchemaPath)();
            if (!schemaPath) {
                console.error(kleur_1.default.red('Unable to find schema.prisma file'));
                process.exit(1);
            }
            const gens = await (0, internals_1.getGenerators)({
                schemaPath: schemaPath,
                dataProxy: false,
            });
            const docsGen = gens.find((gen) => { var _a; return ((_a = gen.manifest) === null || _a === void 0 ? void 0 : _a.prettyName) === 'Prisma Docs Generator'; });
            if (!docsGen) {
                console.error(kleur_1.default.red('Prisma Docs Generator was not specified in the schema'));
                process.exit(1);
            }
            const servePath = (_b = (_a = docsGen.options) === null || _a === void 0 ? void 0 : _a.generator.output) === null || _b === void 0 ? void 0 : _b.value;
            if (!servePath) {
                console.error(kleur_1.default.red('Unable to resolve output path for the generator'));
                process.exit(1);
            }
            const server = new ExpressService(port, servePath);
            server.start();
            process.on('SIGTERM', () => {
                server.exit();
            });
            break;
        }
        default: {
            console.error(kleur_1.default.red(`Unknown command ${kleur_1.default.bold(mainSubcommand)}`));
            cli.showHelp();
        }
    }
}
execute(cli);
//# sourceMappingURL=cli.js.map