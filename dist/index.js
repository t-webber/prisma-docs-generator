"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generator_helper_1 = require("@prisma/generator-helper");
const printer_1 = __importDefault(require("./printer"));
const transformDMMF_1 = __importDefault(require("./generator/transformDMMF"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
(0, generator_helper_1.generatorHandler)({
    onManifest() {
        return {
            defaultOutput: './docs',
            prettyName: 'Prisma Docs Generator',
        };
    },
    async onGenerate(options) {
        var _a;
        const { config } = options.generator;
        const includeRelationFields = config.includeRelationFields === 'false' ? false : true;
        const dmmf = (0, transformDMMF_1.default)(options.dmmf, {
            includeRelationFields,
        });
        const html = new printer_1.default(dmmf);
        const output = (_a = options.generator.output) === null || _a === void 0 ? void 0 : _a.value;
        if (output) {
            const styleFile = await fs.promises.readFile(path.join(__dirname, 'styles', 'main.css'));
            try {
                await fs.promises.mkdir(output, {
                    recursive: true,
                });
                await fs.promises.mkdir(path.join(output, 'styles'), {
                    recursive: true,
                });
                await fs.promises.writeFile(path.join(output, 'index.html'), html.toHTML());
                await fs.promises.writeFile(path.join(output, 'styles', 'main.css'), styleFile);
            }
            catch (e) {
                console.error('Error: unable to write files for Prisma Docs Generator');
                throw e;
            }
        }
        else {
            throw new Error('No output was specified for Prisma Docs Generator');
        }
    },
});
//# sourceMappingURL=index.js.map