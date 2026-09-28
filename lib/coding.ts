export type Field = { code: string; name: string; section: string; categories?: boolean };
export type Paper = { paper_id: string; title: string; authors: string; year: string; venue: string; doi: string; [key: string]: string | string[] };
export const codes = (paper: Paper, field: Field) => paper[field.code + (field.categories ? "__categories" : "__codes")] as string[];
