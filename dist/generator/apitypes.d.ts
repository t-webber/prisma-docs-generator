import { Generatable } from './helpers';
import { DMMFDocument } from './transformDMMF';
import { DMMF } from '@prisma/generator-helper';
type TypesGeneratorStructure = {
    inputTypes: TGType[];
    outputTypes: TGType[];
};
type TGType = {
    name: string;
    fields: TGTypeField[];
};
type TGTypeField = {
    name: string;
    type: DMMF.SchemaArgInputType[];
    nullable: boolean;
};
declare class TypesGenerator implements Generatable<TypesGeneratorStructure> {
    data: TypesGeneratorStructure;
    constructor(d: DMMFDocument);
    getTypeFieldHTML(field: TGTypeField, kind: 'inputType' | 'outputType'): string;
    getTypeHTML(type: TGType, kind: 'inputType' | 'outputType'): string;
    toHTML(): string;
    getInputTypes(dmmfInputType: DMMF.InputType[]): TGType[];
    getOutputTypes(dmmfOutputTypes: DMMF.OutputType[]): TGType[];
    getData(d: DMMFDocument): {
        inputTypes: TGType[];
        outputTypes: TGType[];
    };
}
export default TypesGenerator;
