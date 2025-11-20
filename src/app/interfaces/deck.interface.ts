import { Card } from "./card.interface";

export interface Deck {
  id: number;
  name: string;
  cardsNumber?: number;
  sdNumber?: number;
  cards?: Card[];
  sd?: Card[];
}
