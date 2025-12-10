import { Card } from "./card.interface";

export interface ExpandedDeckCard {
  id: string;
  faction: string;
  amount: number;
  data: Card | null;
}
