import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Deck } from '../interfaces/deck.interface';
import { DeckCard } from '../interfaces/deck-card.interface';
import { Card } from '../interfaces/card.interface';

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

  async getCardAmount(deckId: string, cardId: string): Promise<number> {
    const deck = await this.getDeckById(deckId);
    if (!deck) return 0;

    const found = deck.cards.find(c => c.id === cardId);
    return found ? found.amount : 0;
  }

  /** =============================
   *        UPSERT CARD
   * ============================= */
  async upsertCardInDeck(
    deckId: string,
    deckCard: DeckCard,
    mode: 'main' | 'side' = 'main'
  ): Promise<number> {

    const decks = await this.getDecks();
    const deckIndex = decks.findIndex(d => d.id === deckId);
    if (deckIndex === -1) return 0;

    const deck = this.normalize(decks[deckIndex]);

    const target = mode === 'main' ? deck.cards : deck.sideDeck.cards;

    const existingIndex = target.findIndex(c => c.id === deckCard.id);
    const existingAmount = existingIndex !== -1 ? (target[existingIndex].amount ?? 0) : 0;

    // Si amount <= 0 -> eliminar y retornar 0
    if (deckCard.amount <= 0) {
      if (existingIndex !== -1) target.splice(existingIndex, 1);
      if (mode === 'main') deck.cards = target; else deck.sideDeck.cards = target;
      decks[deckIndex] = deck;
      await this.saveDecks(decks);
      return 0;
    }

    // ---------------------------
    // LÓGICA DE LÍMITES (side/main)
    // ---------------------------
    const isSide = mode === 'side';
    const cap = isSide ? 15 : 40;

    // total actual en target (sin contar esta carta)
    const totalExcludingThis = target.reduce((acc, c) => {
      if (c.id === deckCard.id) return acc; // excluimos la carta en cuestión
      return acc + (c.amount ?? 0);
    }, 0);

    // cantidad máxima posible para esta carta sin exceder cap
    const maxForThisGivenCap = cap - totalExcludingThis;
    // la cantidad deseada que intentan guardar para esta carta:
    const desired = deckCard.amount;

    // si maxForThisGivenCap < 0 -> no hay lugar
    if (maxForThisGivenCap <= 0) {
      // nada se puede guardar para esta carta
      // devolvemos existingAmount (si existe) o 0
      return existingAmount;
    }

    // cantidad final que guardaremos para esta carta
    const finalAmount = Math.min(desired, maxForThisGivenCap);

    if (existingIndex !== -1) {
      target[existingIndex].amount = finalAmount;
    } else {
      target.push({
        id: deckCard.id,
        faction: deckCard.faction,
        amount: finalAmount
      });
    }

    if (mode === 'main') deck.cards = target;
    else deck.sideDeck.cards = target;

    decks[deckIndex] = deck;
    await this.saveDecks(decks);

    return finalAmount;
  }

  // filter by term
private fuzzyMatch(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 2) return false;

  let mismatches = 0;
  let i = 0, j = 0;

  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++; j++;
    } else {
      mismatches++;
      if (mismatches > 2) return false;
      i++; // salteo en "a"
    }
  }
  return true;
}

filterItems<T>(items: T[], term: string, properties: (keyof T)[]): T[] {
  const normalize = (str: string) =>
    str.normalize("NFD")
       .replace(/[\u0300-\u036f]/g, "")
       .toLowerCase()
       .trim();

  const normalizedTerm = normalize(term);

  return items.filter(item =>
    properties.some(prop => {
      const value = normalize(String(item[prop] ?? ""));

      return (
        value.includes(normalizedTerm) ||
        this.fuzzyMatch(value, normalizedTerm)
      );
    })
  );
}

  // Helpers que quizá ya tenías (asegúrate de mantenerlas)
  async getTotalCardsCount(deckId: string): Promise<number> {
    const deck = await this.getDeckById(deckId);
    if (!deck) return 0;
    return deck.cards.reduce((acc, c) => acc + (c.amount || 0), 0);
  }

  async getTotalCardsCountInMain(deckId: string): Promise<number> {
    const deck = await this.getDeckById(deckId);
    if (!deck) return 0;
    return deck.cards.reduce((a, c) => a + (c.amount ?? 0), 0);
  }

  async getTotalCardsCountInSide(deckId: string): Promise<number> {
    const deck = await this.getDeckById(deckId);
    if (!deck?.sideDeck) return 0;
    return deck.sideDeck.cards.reduce((a, c) => a + (c.amount ?? 0), 0);
  }

 filteredCards(cards:Card[], selectedFaction:string) {
  if(selectedFaction === 'all'){
    return cards;
  }else{
    return cards.filter(card => card.faction === selectedFaction);
  }
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

