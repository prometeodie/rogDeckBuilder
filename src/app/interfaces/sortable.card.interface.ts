export interface SortableCard {
  id: string;
  name: string;
  amount: number;
  faction: string;
  cost?: number;
  banned?: boolean;
}
