import { DeckCard } from "./deck-card.interface";
import { SideDeck } from "./side'deck.interface";

export interface Deck {
  id: string;
  name: string;
  cards: DeckCard[];
  sideDeck: SideDeck;
}


