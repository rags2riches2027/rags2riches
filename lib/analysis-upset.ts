
export type UpSetView = {
  id: string;
  label: string;
  sets: { label: string; count: number }[];
  intersections: { key: string; members: number[]; count: number }[];
  totalPapers: number;
  assignedPapers: number;
  unassignedPapers: number;
};


