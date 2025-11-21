import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Deck } from '../interfaces/deck.interface';
import { Card } from '../interfaces/card.interface';

@Injectable({
  providedIn: 'root'
})
export class DecksCardsService {

  private STORAGE_KEY = 'decks';

  constructor() {}

  /** =============================
   *    SAVE ALL DECKS TO STORAGE
   * ============================= */
   private async saveDecks(decks: Deck[]): Promise<void> {
    await Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(decks),
    });
  }

  /** =============================
   *       GET ALL DECKS
   * ============================= */
   async getDecks(): Promise<Deck[]> {
    const result = await Preferences.get({ key: this.STORAGE_KEY });

    if (!result.value) return [];

    try {
      return JSON.parse(result.value);
    } catch {
      return [];
    }
  }


  /** =============================
   *       GET DECK BY ID
   * ============================= */
  async getDeckById(id: string): Promise<Deck | undefined> {
    const decks = await this.getDecks();
    return decks.find(deck => deck.id === id);
  }

  /** =============================
   *        ADD NEW DECK
   * ============================= */
 /** =============================
 *        ADD NEW DECK
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

  /** =============================
   *        UPDATE DECK
   * ============================= */
  async updateDeck(updatedDeck: Deck): Promise<void> {
    const decks = await this.getDecks();
    const index = decks.findIndex(d => d.id === updatedDeck.id);

    if (index !== -1) {
      decks[index] = updatedDeck;
      await this.saveDecks(decks);
    }
  }

  /** =============================
   *        DELETE DECK
   * ============================= */
  async deleteDeck(id: string): Promise<void> {
    let decks = await this.getDecks();
    decks = decks.filter(deck => deck.id !== id);
    await this.saveDecks(decks);
  }

  /** =============================
   *   CLEAR ALL DECKS (opcional)
   * ============================= */
    async clearAllDecks(): Promise<void> {
    await Preferences.remove({ key: this.STORAGE_KEY });
  }

   // ----------------------------------------------------
  // add cart LOGIC
  // -----------------------------------------------------

   async addCardToDeck(deckId: string, card: Card): Promise<void> {
    const deck = await this.getDeckById(deckId);
    if (!deck) return;

    deck.cards.push(card);
    await this.updateDeck(deck);
  }

  async removeCardFromDeck(deckId: string, cardId: string): Promise<void> {
    const deck = await this.getDeckById(deckId);
    if (!deck) return;

    deck.cards = deck.cards.filter(c => c.id !== cardId);
    await this.updateDeck(deck);
  }

  // ----------------------------------------------------
  // SIDE DECK LOGIC
  // ----------------------------------------------------

  async addCardToSideDeck(deckId: string, card: Card): Promise<void> {
    const deck = await this.getDeckById(deckId);
    if (!deck) return;

    deck.sideDeck.cards.push(card);
    await this.updateDeck(deck);
  }

  async removeCardFromSideDeck(deckId: string, cardId: string): Promise<void> {
    const deck = await this.getDeckById(deckId);
    if (!deck) return;

    deck.sideDeck.cards = deck.sideDeck.cards.filter(c => c.id !== cardId);
    await this.updateDeck(deck);
  }

  // ----------------------------------------------------
  // HELPERS
  // ----------------------------------------------------

  async countCardInDeck(deckId: string, cardId: string): Promise<number> {
    const deck = await this.getDeckById(deckId);
    if (!deck) return 0;
    return deck.cards.filter(c => c.id === cardId).length;
  }

  async countCardInSideDeck(deckId: string, cardId: string): Promise<number> {
    const deck = await this.getDeckById(deckId);
    if (!deck) return 0;
    return deck.sideDeck.cards.filter(c => c.id === cardId).length;
  }
}

