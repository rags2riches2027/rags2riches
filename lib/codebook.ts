export type Code = { code: string; definition: string; note?: string };
export type Field = { code: string; name: string; selection: string; description: string | null; codes: Code[] };
export type CodebookSection = { letter: string; name: string; fields: Field[] };

