import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Deck } from '../interfaces/deck.interface';
import { DeckCard } from '../interfaces/deck-card.interface';

@Injectable({
  providedIn: 'root'
})
export class DecksCardsService {

  private STORAGE_KEY = 'decks';

  constructor() {}

  /** =============================
   *       NORMALIZADOR
   * ============================= */
  private normalize(deck: Deck): Deck {
    return {
      ...deck,
      cards: deck.cards ?? [],
      sideDeck: deck.sideDeck ?? { cards: [] }
    };
  }

  /** =============================
   *    GET + SAVE DECKS
   * ============================= */


async addDeck(): Promise<Deck> {
  const decks = await this.getDecks();

  // Buscar el próximo número para "Mazo X"
  let nextNumber = 1;

  const existingNumbers = decks
    .map(d => d.name)
    .filter(n => n.startsWith('Mazo '))
    .map(n => parseInt(n.replace('Mazo ', ''), 10))
    .filter(num => !isNaN(num));

  if (existingNumbers.length > 0) {
    nextNumber = Math.max(...existingNumbers) + 1;
  }

  // Crear deck nuevo
  const newDeck: Deck = {
    id: crypto.randomUUID(),
    name: `Mazo ${nextNumber}`,
    cards: [],
    sideDeck: {
      cards: []
    }
  };

  // Guardar
  decks.push(newDeck);
  await this.saveDecks(decks);

  return newDeck;
}

  private async saveDecks(decks: Deck[]): Promise<void> {
    await Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(decks)
    });
  }

  async getDecks(): Promise<Deck[]> {
    const result = await Preferences.get({ key: this.STORAGE_KEY });

    if (!result.value) return [];

    let decks: Deck[] = [];

    try {
      decks = JSON.parse(result.value);
    } catch {
      return [];
    }

    // Normalizar todos
    return decks.map(d => this.normalize(d));
  }

  async getDeckById(id: string): Promise<Deck | undefined> {
    const decks = await this.getDecks();
    const deck = decks.find(d => d.id === id);
    return deck ? this.normalize(deck) : undefined;
  }

  async updateDeck(updatedDeck: Deck): Promise<void> {
    const decks = await this.getDecks();
    const index = decks.findIndex(d => d.id === updatedDeck.id);

    if (index !== -1) {
      decks[index] = this.normalize(updatedDeck);
      await this.saveDecks(decks);
    }
  }

  /** =============================
   *           DELETE
   * ============================= */
  async deleteDeck(id: string): Promise<void> {
    let decks = await this.getDecks();
    decks = decks.filter(deck => deck.id !== id);
    await this.saveDecks(decks);
  }

  async clearAllDecks(): Promise<void> {
    await Preferences.remove({ key: this.STORAGE_KEY });
  }

  /** =============================
   *        HELPERS
   * ============================= */

  async getTotalCardsCount(deckId: string): Promise<number> {
    const deck = await this.getDeckById(deckId);
    if (!deck) return 0;
    return deck.cards.reduce((acc, c) => acc + (c.amount || 0), 0);
  }

  async getCardAmount(deckId: string, cardId: string): Promise<number> {
    const deck = await this.getDeckById(deckId);
    if (!deck) return 0;

    const found = deck.cards.find(c => c.id === cardId);
    return found ? found.amount : 0;
  }

  /** =============================
   *        UPSERT CARD
   * ============================= */
  async upsertCardInDeck(deckId: string, deckCard: DeckCard): Promise<void> {
    const decks = await this.getDecks();
    const deckIndex = decks.findIndex(d => d.id === deckId);
    if (deckIndex === -1) return;

    const deck = this.normalize(decks[deckIndex]);

    const cards = deck.cards;
    const existingIndex = cards.findIndex(c => c.id === deckCard.id);

    if (deckCard.amount <= 0) {
      // eliminar
      if (existingIndex !== -1) {
        cards.splice(existingIndex, 1);
      }
    } else {
      if (existingIndex !== -1) {
        cards[existingIndex].amount = deckCard.amount;
      } else {
        cards.push({
          id: deckCard.id,
          faction: deckCard.faction,
          amount: deckCard.amount
        });
      }
    }

    deck.cards = cards;
    decks[deckIndex] = deck;

    await this.saveDecks(decks);
  }

  /** =============================
   *         SIDE DECK
   * ============================= */
  async countCardInSideDeck(deckId: string, cardId: string): Promise<number> {
    const deck = await this.getDeckById(deckId);
    if (!deck) return 0;

    return deck.sideDeck.cards.reduce((acc, c) =>
      c.id === cardId ? acc + (c.amount || 0) : acc,
    0);
  }
}

