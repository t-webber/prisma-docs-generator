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
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const generator_helper_1 = require("@prisma/generator-helper");
const Prism = __importStar(require("prismjs"));
const helpers_2 = require("./helpers");
let fieldDirectiveMap = new Map([
    ['isUnique', '@unique'],
    ['isId', '@id'],
    ['hasDefaultValue', '@default'],
    ['isUpdatedAt', '@updatedAt'],
    ['hasDefaultValue', '@default'],
]);
class ModelGenerator {
    constructor(d) {
        this.data = this.getData(d);
    }
    getModelDiretiveHTML(directive) {
        return `
      <tr>
        <td class="px-4 py-2 border dark:border-gray-400">
         <strong class="text-dark dark:text-white">${directive.name}</strong>
        </td>

        <td class="px-4 py-2 border dark:border-gray-400"> <ul>
            ${directive.values.map((val) => `<li class="text-dark dark:text-white">${val}</li>`).join('')}
          </ul>
        </td>
      </tr>
    `;
    }
    getModelFieldTableRow(field, modelName) {
        var _a;
        return `
    <tr id="${`model-${modelName}-${field.name}`}">
      <td class="px-4 py-2 border text-black dark:text-white dark:border-gray-400">
       ${field.name} 
      </td>
      <td class="px-4 py-2 border text-black dark:text-white dark:border-gray-400">
       ${(0, helpers_2.isScalarType)(field.bareTypeName)
            ? field.type
            : `<a href="#type-outputType-${field.bareTypeName}">${field.type}</a>`}
      </td>
      <td class="px-4 py-2 border text-black dark:text-white dark:border-gray-400">
        <ul class="text-black dark:text-white">
          ${field.directives.length > 0
            ? field.directives
                .map((directive) => `<li><strong>${directive}</strong></li>`)
                .join('')
            : '<li> - </li>'}
        </ul>
      </td>
      <td class="px-4 py-2 border text-black dark:text-white dark:border-gray-400">
        ${field.required ? `<strong>Yes</strong>` : 'No'}
      </td>
      <td class="px-4 py-2 border text-black dark:text-white dark:border-gray-400">
        ${(_a = field.documentation) !== null && _a !== void 0 ? _a : '-'}
      </td>
    </tr>
    `;
    }
    getModelOperationMarkup(operation, modelName) {
        var _a;
        return `
                <div class="mt-4">
                  <h4 id="${`model-${modelName}-${operation.name}`}" class="mb-2 text-lg font-bold dark:text-white">${operation.name}</h4>
                  <p class="text-black dark:text-white">${operation.description}</p>
                  <div class="mb-2">
                    <pre
                      class="language-markup"
                    ><code class=" language-javascript">${operation.usage}</code></pre>
                  </div>
                  <h4 class="text-lg mb-2 text-black dark:text-white">Input</h4>
                  <table class="table-auto mb-2">
                    <thead>
                      <tr>
                        <th class="px-4 py-2 border dark:text-white dark:border-gray-400">Name</th>
                        <th class="px-4 py-2 border dark:text-white dark:border-gray-400">Type</th>
                        <th class="px-4 py-2 border dark:text-white dark:border-gray-400">Required</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${(_a = operation.opKeys) === null || _a === void 0 ? void 0 : _a.map((opK) => `
                      <tr>
                        <td class="px-4 py-2 border dark:text-white dark:border-gray-400">
                          ${opK.name}
                        </td>
                        <td class="px-4 py-2 border dark:text-white dark:border-gray-400">
                        ${opK.types
            .map((t) => (0, helpers_2.isScalarType)(t.type)
            ? t.type
            : `<a href="#type-inputType-${t.type}" class="dark:text-white">${t.type}${t.isList ? '[]' : ''}</a>`)
            .join(' | ')}
                        </td>
                        <td class="px-4 py-2 border dark:text-white dark:border-gray-400">
                         ${opK.required ? '<strong>Yes</strong>' : 'No'} 
                        </td>
                      </tr>
                      `).join('')}
                    </tbody>
                  </table>
                  <h4 class="text-lg mb-2 text-black dark:text-white">Output</h4>
                  <div class="text-dark dark:text-white"><strong>Type: </strong> <a href="#type-outputType-${operation.output.type}">${operation.output.type}</a></div>
                  <div class="text-dark dark:text-white"><strong>Required: </strong>
                  ${operation.output.required ? `Yes` : `No`}</div>
                  <div class="text-dark dark:text-white"><strong>List: </strong>
                  ${operation.output.list ? `Yes` : `No`}</div>
              </div>
    `;
    }
    toHTML() {
        return `
        <div class="mb-8">
          <h1 class="text-3xl text-gray-800 dark:text-white" id="models">Models</h1>
            ${this.data.models
            .map((model) => `
            <div class="px-4 mb-4">
              <h2 class="text-2xl text-black dark:text-white" id="model-${model.name}">${model.name}</h2>
              ${model.documentation
            ? `<div class="mb-2 text-black dark:text-white">Description: ${model.documentation}</div>`
            : ''}
              ${model.directives.length > 0
            ? `
              <table class="table-auto">
                <thead>
                  <tr>
                    <th class="px-4 py-2 border dark:text-white dark:border-gray-400">Name</th>
                    <th class="px-4 py-2 border dark:text-white dark:border-gray-400">Value</th>
                  </tr>
                </thead>
                <tbody>
                  ${model.directives
                .map((directive) => this.getModelDiretiveHTML(directive))
                .join('')}
                </tbody>
              </table>
                `
            : ''}
              <div class="px-4 mt-4">
                <h3 class="mb-2 text-xl text-black dark:text-white" id="model-${model.name}-fields">Fields</h3>
                <div class="px-2 mb-4">
                  <table class="table-auto">
                    <thead>
                      <tr>
                        <th class="px-4 py-2 border text-black dark:text-white dark:border-gray-400">Name</th>
                        <th class="px-4 py-2 border text-black dark:text-white dark:border-gray-400">Type</th>
                        <th class="px-4 py-2 border text-black dark:text-white dark:border-gray-400">Attributes</th>
                        <th class="px-4 py-2 border text-black dark:text-white dark:border-gray-400">Required</th>
                        <th class="px-4 py-2 border text-black dark:text-white dark:border-gray-400">Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                    ${model.fields
            .map((field) => this.getModelFieldTableRow(field, model.name))
            .join('')}
                    </tbody>
                  </table>
                </div>
            </div>
            <hr class="my-8">
              <div class="px-4 mt-4">
                <h3 class="mb-2 text-xl dark:text-white" id="model-${model.name}-operations">Operations</h3>
                <div class="px-2 mb-4">
                  ${model.operations
            .map((op) => this.getModelOperationMarkup(op, model.name))
            .join(`<hr class="my-4 dark:text-white">`)}
                </div>
            </div>
          </div>
            `)
            .join(`<hr class="my-16">`)}
        </div>
    `;
    }
    getModelDirective(model) {
        let directiveValue = [];
        if (model.primaryKey)
            directiveValue.push({ name: '@@id', values: model.primaryKey.fields });
        if (model.uniqueFields.length > 0) {
            model.uniqueFields.forEach((uniqueField) => {
                directiveValue.push({
                    name: '@@unique',
                    values: uniqueField,
                });
            });
        }
        if (model.uniqueIndexes.length > 0) {
            model.uniqueIndexes.forEach((uniqueIndex) => {
                directiveValue.push({ name: '@@index', values: uniqueIndex.fields });
            });
        }
        return directiveValue;
    }
    getModelFields(model) {
        return model.fields.map((field) => {
            return {
                name: field.name,
                type: this.getFieldType(field),
                bareTypeName: field.type,
                documentation: field.documentation,
                directives: this.getFieldDirectives(field),
                required: field.isRequired,
            };
        });
    }
    getFieldType(field) {
        let name = field.type;
        if (!field.isRequired && !field.isList) {
            name += '?';
        }
        if (field.isList) {
            name += '[]';
        }
        return name;
    }
    getFieldDirectives(field) {
        const filteredEntries = Object.entries(field).filter(([_, v]) => Boolean(v));
        let directives = [];
        filteredEntries.forEach(([k]) => {
            const mappedDirectiveValue = fieldDirectiveMap.get(k);
            if (mappedDirectiveValue) {
                // default needs separate treatment right now as it can be a fn or any other type really
                if (k === 'hasDefaultValue' && field.default !== undefined) {
                    if (typeof field.default === 'string' ||
                        typeof field.default === 'number' ||
                        typeof field.default === 'boolean') {
                        directives.push(`${mappedDirectiveValue}(${field.default})`);
                    }
                    if (Array.isArray(field.default)) {
                        directives.push(`${mappedDirectiveValue}([${field.default.toString()}])`);
                    }
                    else if (typeof field.default === 'object') {
                        // Output of this template is, for example, @default(now())
                        directives.push(`${mappedDirectiveValue}(${field.default.name}(${field.default.args.join(',')}))`);
                    }
                }
                else {
                    directives.push(mappedDirectiveValue);
                }
            }
        });
        return directives;
    }
    getModelOperations(model, mappings, schema) {
        if (!mappings) {
            throw new Error(`No operation mapping found for model: ${model.name}`);
        }
        const modelOps = Object.entries(mappings).filter(([map, _val]) => map !== 'model');
        let ops = [];
        modelOps.forEach(([op, val]) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            const singular = (0, helpers_1.capitalize)(model.name);
            const plural = (0, helpers_1.capitalize)(singular);
            const method = `prisma.${(0, helpers_2.lowerCase)(model.name)}.${op}`;
            switch (op) {
                case generator_helper_1.DMMF.ModelAction.create: {
                    const field = (_a = schema.outputObjectTypes.prisma
                        .find((t) => t.name === 'Mutation')) === null || _a === void 0 ? void 0 : _a.fields.find((f) => f.name === val);
                    ops.push({
                        name: op,
                        description: `Create one ${singular}`,
                        usage: Prism.highlight(`// Create one ${singular}
const ${singular} = await ${method}({
  data: {
    // ... data to create a ${singular}
  }
})
`, Prism.languages.javascript, 'javascript'),
                        opKeys: field === null || field === void 0 ? void 0 : field.args.map((a) => ({
                            name: a.name,
                            types: a.inputTypes,
                            required: a.isRequired,
                        })),
                        output: {
                            type: field === null || field === void 0 ? void 0 : field.outputType.type,
                            required: !(field === null || field === void 0 ? void 0 : field.isNullable),
                            list: field === null || field === void 0 ? void 0 : field.outputType.isList,
                        },
                    });
                    break;
                }
                case generator_helper_1.DMMF.ModelAction.deleteMany: {
                    const field = (_b = schema.outputObjectTypes.prisma
                        .find((t) => t.name === 'Mutation')) === null || _b === void 0 ? void 0 : _b.fields.find((f) => f.name === val);
                    ops.push({
                        name: op,
                        description: `Delete zero or more ${singular}`,
                        usage: Prism.highlight(`// Delete a few ${plural}
const { count } = await ${method}({
  where: {
    // ... provide filter here
  }
})
`, Prism.languages.javascript, 'javascript'),
                        opKeys: field === null || field === void 0 ? void 0 : field.args.map((a) => ({
                            name: a.name,
                            types: a.inputTypes,
                            required: a.isRequired,
                        })),
                        output: {
                            type: field === null || field === void 0 ? void 0 : field.outputType.type,
                            required: !(field === null || field === void 0 ? void 0 : field.isNullable),
                            list: field === null || field === void 0 ? void 0 : field.outputType.isList,
                        },
                    });
                    break;
                }
                case generator_helper_1.DMMF.ModelAction.delete: {
                    const field = (_c = schema.outputObjectTypes.prisma
                        .find((t) => t.name === 'Mutation')) === null || _c === void 0 ? void 0 : _c.fields.find((f) => f.name === val);
                    ops.push({
                        name: op,
                        description: `Delete one ${singular}`,
                        usage: Prism.highlight(`// Delete one ${singular}
const ${singular} = await ${method}({
  where: {
    // ... filter to delete one ${singular}
  }
})`, Prism.languages.javascript, 'javascript'),
                        opKeys: field === null || field === void 0 ? void 0 : field.args.map((a) => ({
                            name: a.name,
                            types: a.inputTypes,
                            required: a.isRequired,
                        })),
                        output: {
                            type: field === null || field === void 0 ? void 0 : field.outputType.type,
                            required: !(field === null || field === void 0 ? void 0 : field.isNullable),
                            list: field === null || field === void 0 ? void 0 : field.outputType.isList,
                        },
                    });
                    break;
                }
                case generator_helper_1.DMMF.ModelAction.findMany: {
                    const field = (_d = schema.outputObjectTypes.prisma
                        .find((t) => t.name === 'Query')) === null || _d === void 0 ? void 0 : _d.fields.find((f) => f.name === val);
                    ops.push({
                        name: op,
                        description: `Find zero or more ${plural}`,
                        usage: Prism.highlight(`// Get all ${plural}
const ${plural} = await ${method}()
// Get first 10 ${plural}
const ${plural} = await ${method}({ take: 10 })
`, Prism.languages.javascript, 'javascript'),
                        opKeys: field === null || field === void 0 ? void 0 : field.args.map((a) => ({
                            name: a.name,
                            types: a.inputTypes,
                            required: a.isRequired,
                        })),
                        output: {
                            type: field === null || field === void 0 ? void 0 : field.outputType.type,
                            required: !(field === null || field === void 0 ? void 0 : field.isNullable),
                            list: field === null || field === void 0 ? void 0 : field.outputType.isList,
                        },
                    });
                    break;
                }
                case generator_helper_1.DMMF.ModelAction.findUnique: {
                    const field = (_e = schema.outputObjectTypes.prisma
                        .find((t) => t.name === 'Query')) === null || _e === void 0 ? void 0 : _e.fields.find((f) => f.name === val);
                    ops.push({
                        name: op,
                        description: `Find zero or one ${plural}`,
                        usage: Prism.highlight(`// Get one ${singular}
const ${(0, helpers_2.lowerCase)(singular)} = await ${method}({
  where: {
    // ... provide filter here
  }
})
`, Prism.languages.javascript, 'javascript'),
                        opKeys: field === null || field === void 0 ? void 0 : field.args.map((a) => ({
                            name: a.name,
                            types: a.inputTypes,
                            required: a.isRequired,
                        })),
                        output: {
                            type: field === null || field === void 0 ? void 0 : field.outputType.type,
                            required: !(field === null || field === void 0 ? void 0 : field.isNullable),
                            list: field === null || field === void 0 ? void 0 : field.outputType.isList,
                        },
                    });
                    break;
                }
                case generator_helper_1.DMMF.ModelAction.findFirst: {
                    const field = (_f = schema.outputObjectTypes.prisma
                        .find((t) => t.name === 'Query')) === null || _f === void 0 ? void 0 : _f.fields.find((f) => f.name === val);
                    ops.push({
                        name: op,
                        description: `Find first ${plural}`,
                        usage: Prism.highlight(`// Get one ${singular}
const ${(0, helpers_2.lowerCase)(singular)} = await ${method}({
  where: {
    // ... provide filter here
  }
})
`, Prism.languages.javascript, 'javascript'),
                        opKeys: field === null || field === void 0 ? void 0 : field.args.map((a) => ({
                            name: a.name,
                            types: a.inputTypes,
                            required: a.isRequired,
                        })),
                        output: {
                            type: field === null || field === void 0 ? void 0 : field.outputType.type,
                            required: !(field === null || field === void 0 ? void 0 : field.isNullable),
                            list: field === null || field === void 0 ? void 0 : field.outputType.isList,
                        },
                    });
                    break;
                }
                case generator_helper_1.DMMF.ModelAction.update: {
                    const field = (_g = schema.outputObjectTypes.prisma
                        .find((t) => t.name === 'Mutation')) === null || _g === void 0 ? void 0 : _g.fields.find((f) => f.name === val);
                    ops.push({
                        name: op,
                        description: `Update one ${singular}`,
                        usage: Prism.highlight(`// Update one ${singular}
const ${(0, helpers_2.lowerCase)(singular)} = await ${method}({
  where: {
    // ... provide filter here
  },
  data: {
    // ... provide data here
  }
})
`, Prism.languages.javascript, 'javascript'),
                        opKeys: field === null || field === void 0 ? void 0 : field.args.map((a) => ({
                            name: a.name,
                            types: a.inputTypes,
                            required: a.isRequired,
                        })),
                        output: {
                            type: field === null || field === void 0 ? void 0 : field.outputType.type,
                            required: !(field === null || field === void 0 ? void 0 : field.isNullable),
                            list: field === null || field === void 0 ? void 0 : field.outputType.isList,
                        },
                    });
                    break;
                }
                case generator_helper_1.DMMF.ModelAction.updateMany: {
                    const field = (_h = schema.outputObjectTypes.prisma
                        .find((t) => t.name === 'Mutation')) === null || _h === void 0 ? void 0 : _h.fields.find((f) => f.name === val);
                    ops.push({
                        name: op,
                        description: `Update zero or one ${plural}`,
                        usage: Prism.highlight(`const { count } = await ${method}({
  where: {
    // ... provide filter here
  },
  data: {
    // ... provide data here
  }
})`, Prism.languages.javascript, 'javascript'),
                        opKeys: field === null || field === void 0 ? void 0 : field.args.map((a) => ({
                            name: a.name,
                            types: a.inputTypes,
                            required: a.isRequired,
                        })),
                        output: {
                            type: field === null || field === void 0 ? void 0 : field.outputType.type,
                            required: !(field === null || field === void 0 ? void 0 : field.isNullable),
                            list: field === null || field === void 0 ? void 0 : field.outputType.isList,
                        },
                    });
                    break;
                }
                case generator_helper_1.DMMF.ModelAction.upsert: {
                    const field = (_j = schema.outputObjectTypes.prisma
                        .find((t) => t.name === 'Mutation')) === null || _j === void 0 ? void 0 : _j.fields.find((f) => f.name === val);
                    ops.push({
                        name: op,
                        description: `Create or update one ${plural}`,
                        usage: Prism.highlight(`// Update or create a ${singular}
const ${(0, helpers_2.lowerCase)(singular)} = await ${method}({
  create: {
    // ... data to create a ${singular}
  },
  update: {
    // ... in case it already exists, update
  },
  where: {
    // ... the filter for the ${singular} we want to update
  }
})`, Prism.languages.javascript, 'javascript'),
                        opKeys: field === null || field === void 0 ? void 0 : field.args.map((a) => ({
                            name: a.name,
                            types: a.inputTypes,
                            required: a.isRequired,
                        })),
                        output: {
                            type: field === null || field === void 0 ? void 0 : field.outputType.type,
                            required: !(field === null || field === void 0 ? void 0 : field.isNullable),
                            list: field === null || field === void 0 ? void 0 : field.outputType.isList,
                        },
                    });
                    break;
                }
            }
        });
        return ops;
    }
    getModels(dmmf) {
        return dmmf.datamodel.models.map((model) => {
            return {
                name: model.name,
                documentation: model.documentation,
                directives: this.getModelDirective(model),
                fields: this.getModelFields(model),
                operations: this.getModelOperations(model, dmmf.mappings.find((map) => map.model === model.name), dmmf.schema),
            };
        });
    }
    getData(d) {
        return {
            models: this.getModels(d),
        };
    }
}
exports.default = ModelGenerator;
//# sourceMappingURL=model.js.map