import { DeckCard } from "./deck-card.interface";
import { SideDeck } from "./side'deck.interface";

export interface Deck {
  id: string;
  name: string;
  cards: DeckCard[];
  sideDeck: SideDeck;
  color?:string;
  creator?:string;
  colaborators?:string[];
  baseDeckCards?:DeckCard[];
  originalName?:string;
}

