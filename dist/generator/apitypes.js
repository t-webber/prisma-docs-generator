"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
class TypesGenerator {
    constructor(d) {
        this.data = this.getData(d);
    }
    getTypeFieldHTML(field, kind) {
        return `
    <tr>
      <td class="px-4 py-2 border text-black dark:text-white dark:border-gray-400">
        ${field.name} </td>
      <td class="px-4 py-2 border text-black dark:text-white dark:border-gray-400">
        ${field.type
            .map((f) => (0, helpers_1.isScalarType)(f.type)
            ? f.type
            : `<a href="#type-${kind}-${f.type}">${f.type}${f.isList ? '[]' : ''}</a>`)
            .join(' | ')}
      </td>

      <td class="px-4 py-2 border text-black dark:text-white dark:border-gray-400">
        ${field.nullable ? '<strong>Yes</strong>' : 'No'}
      </td>
    </tr>
    `;
    }
    getTypeHTML(type, kind) {
        return `
      <div>
        <h3 class="mb-2 text-xl text-black dark:text-white" id="type-${kind}-${type.name}">${type.name}</h3>
        <table class="table-auto">
          <thead>
            <tr>
              <th class="px-4 py-2 border text-black dark:text-white dark:border-gray-400">Name</th>
              <th class="px-4 py-2 border text-black dark:text-white dark:border-gray-400">Type</th>
              <th class="px-4 py-2 border text-black dark:text-white dark:border-gray-400">Nullable</th>
            </tr>
          </thead>
          <tbody>
          ${type.fields
            .map((field) => this.getTypeFieldHTML(field, kind))
            .join('')}
          </tbody>
        </table>
      </div>
    `;
    }
    toHTML() {
        return `<div>
    <h1 class="text-3xl dark:text-white" id="types">Types</h1>
        <div>
          <div class="ml-4">
            <h3 class="mb-2 text-2xl font-normal" id="input-types dark:text-white">Input Types</h3>
            <div class="ml-4">
              ${this.data.inputTypes
            .map((inputType) => this.getTypeHTML(inputType, 'inputType'))
            .join(`<hr class="my-4" />`)}
            </div>
          </div>
          <div class="ml-4">
            <h3 class="mb-2 text-2xl font-normal dark:text-white" id="output-types">Output Types</h3>
            <div class="ml-4">
              ${this.data.outputTypes
            .map((outputType) => this.getTypeHTML(outputType, 'outputType'))
            .join(`<hr class="my-4" />`)}
            </div>
          </div>
        </div>
      </div>
`;
    }
    getInputTypes(dmmfInputType) {
        return dmmfInputType.map((inputType) => ({
            name: inputType.name,
            fields: inputType.fields.map((ip) => ({
                name: ip.name,
                nullable: ip.isNullable,
                type: ip.inputTypes,
            })),
        }));
    }
    getOutputTypes(dmmfOutputTypes) {
        return dmmfOutputTypes.map((outputType) => ({
            name: outputType.name,
            fields: outputType.fields.map((op) => ({
                name: op.name,
                nullable: !op.isNullable,
                list: op.outputType.isList,
                type: [
                    {
                        isList: op.outputType.isList,
                        type: op.outputType.type,
                        location: op.outputType.location,
                    },
                ],
            })),
        }));
    }
    getData(d) {
        return {
            inputTypes: this.getInputTypes(d.schema.inputObjectTypes.prisma),
            outputTypes: this.getOutputTypes([
                ...d.schema.outputObjectTypes.model,
                ...d.schema.outputObjectTypes.prisma.filter((op) => op.name !== 'Query' && op.name !== 'Mutation'),
            ]),
        };
    }
}
exports.default = TypesGenerator;
//# sourceMappingURL=apitypes.js.map