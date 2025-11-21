import { Card } from "./card.interface";
import { SideDeck } from "./side'deck.interface";

export interface Deck {
  id: string;
  name: string;
  cards: Card[];
  sideDeck: SideDeck;
}


