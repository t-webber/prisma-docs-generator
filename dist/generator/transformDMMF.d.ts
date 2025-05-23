import { DMMF as ExternalDMMF } from '@prisma/generator-helper';
export declare function lowerCase(name: string): string;
export interface DMMFMapping {
    model: string;
    findOne?: string | null;
    findFirst?: string | null;
    findMany?: string | null;
    create?: string | null;
    update?: string | null;
    updateMany?: string | null;
    upsert?: string | null;
    delete?: string | null;
    deleteMany?: string | null;
}
export type DMMFDocument = Omit<ExternalDMMF.Document, 'mappings'> & {
    mappings: DMMFMapping[];
};
type OptionsForTransformDMMF = {
    includeRelationFields: boolean;
};
export default function transformDMMF(dmmf: ExternalDMMF.Document, { includeRelationFields }: OptionsForTransformDMMF): DMMFDocument;
export {};
