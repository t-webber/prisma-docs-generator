"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lowerCase = void 0;
function lowerCase(name) {
    return name.substring(0, 1).toLowerCase() + name.substring(1);
}
exports.lowerCase = lowerCase;
function transformDMMF(dmmf, { includeRelationFields }) {
    if (!includeRelationFields) {
        dmmf.datamodel.models = dmmf.datamodel.models.map(model => {
            model.fields = model.fields.filter(field => !field.relationName);
            return model;
        });
    }
    return {
        ...dmmf,
        mappings: getMappings(dmmf.mappings, dmmf.datamodel),
    };
}
exports.default = transformDMMF;
function getMappings(mappings, datamodel) {
    const modelOperations = mappings.modelOperations
        .filter((mapping) => {
        const model = datamodel.models.find((m) => m.name === mapping.model);
        if (!model) {
            throw new Error(`Mapping without model ${mapping.model}`);
        }
        return model.fields.some((f) => f.kind !== 'object');
    })
        .map((mapping) => ({
        model: mapping.model,
        findUnique: mapping.findSingle || mapping.findOne || mapping.findUnique,
        findFirst: mapping.findFirst,
        findMany: mapping.findMany,
        create: mapping.createOne || mapping.createSingle || mapping.create,
        delete: mapping.deleteOne || mapping.deleteSingle || mapping.delete,
        update: mapping.updateOne || mapping.updateSingle || mapping.update,
        deleteMany: mapping.deleteMany,
        updateMany: mapping.updateMany,
        upsert: mapping.upsertOne || mapping.upsertSingle || mapping.upsert,
    }));
    return modelOperations;
}
//# sourceMappingURL=transformDMMF.js.map