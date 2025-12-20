import { IONIC_DEFAULT_GRAY } from './../constant/decks.colors';
import { inject, Injectable, signal } from '@angular/core';
import { Deck } from '../interfaces/deck.interface';
import { DeckCard } from '../interfaces/deck-card.interface';
import { Card } from '../interfaces/card.interface';
import { SortableCard } from '../interfaces/sortable.card.interface';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DecksCardsService {

  private STORAGE_KEY = 'decks';

  // =============================
  // DECK COLOR SIGNAL
  // =============================
  private _deckColor = signal<string | ''>(IONIC_DEFAULT_GRAY);
  deckColor = this._deckColor.asReadonly();
  private alertCtrl = inject(AlertController);

  // =============================
  // NORMALIZADOR
  // =============================
  private normalize(deck: Deck): Deck {
    return {
      ...deck,
      cards: deck.cards ?? [],
      sideDeck: deck.sideDeck ?? { cards: [] },
      color: deck.color || '#1f1f1f'
    };
  }

  // =============================
  // GET + SAVE DECKS
  // =============================
  async addDeck(): Promise<Deck> {
    const decks = await this.getDecks();

    let nextNumber = 1;
    const existingNumbers = decks
      .map(d => d.name)
      .filter(n => n.startsWith('Mazo '))
      .map(n => parseInt(n.replace('Mazo ', ''), 10))
      .filter(num => !isNaN(num));

    if (existingNumbers.length > 0) {
      nextNumber = Math.max(...existingNumbers) + 1;
    }

    const newDeck: Deck = {
      id: crypto.randomUUID(),
      name: `Mazo ${nextNumber}`,
      cards: [],
      sideDeck: { cards: [] },
      color: '#1f1f1f'
    };

    decks.push(newDeck);
    await this.saveDecks(decks);

    return newDeck;
  }

  private async saveDecks(decks: Deck[]): Promise<void> {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(decks));
    } catch (e) {
      console.error('[STORAGE] ERROR guardando', e);
    }
  }

  async getDecks(): Promise<Deck[]> {
    const value = localStorage.getItem(this.STORAGE_KEY);
    if (!value) return [];

    let decks: Deck[] = [];
    try {
      decks = JSON.parse(value);
    } catch {
      return [];
    }

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

  // =============================
  // DELETE
  // =============================
  async deleteDeck(id: string): Promise<void> {
    const decks = (await this.getDecks()).filter(deck => deck.id !== id);
    await this.saveDecks(decks);
  }

  async clearAllDecks(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // =============================
  // HELPERS
  // =============================
  async getCardAmount(deckId: string, cardId: string): Promise<number> {
    const deck = await this.getDeckById(deckId);
    if (!deck) return 0;
    const found = deck.cards.find(c => c.id === cardId);
    return found ? found.amount : 0;
  }

  // =============================
  // UPSERT CARD
  // =============================
  async upsertCardInDeck(deckId: string, deckCard: DeckCard, mode: 'main' | 'side' = 'main'): Promise<number> {
    const decks = await this.getDecks();
    const deckIndex = decks.findIndex(d => d.id === deckId);
    if (deckIndex === -1) return 0;

    const deck = this.normalize(decks[deckIndex]);
    const target = mode === 'main' ? deck.cards : deck.sideDeck.cards;

    const existingIndex = target.findIndex(c => c.id === deckCard.id);
    const existingAmount = existingIndex !== -1 ? (target[existingIndex].amount ?? 0) : 0;

    if (deckCard.amount <= 0) {
      if (existingIndex !== -1) target.splice(existingIndex, 1);
      if (mode === 'main') deck.cards = target; else deck.sideDeck.cards = target;
      decks[deckIndex] = deck;
      await this.saveDecks(decks);
      return 0;
    }

    const isSide = mode === 'side';
    const cap = isSide ? 15 : 40;
    const totalExcludingThis = target.reduce((acc, c) => c.id === deckCard.id ? acc : acc + (c.amount ?? 0), 0);
    const maxForThisGivenCap = cap - totalExcludingThis;
    if (maxForThisGivenCap <= 0) return existingAmount;

    const finalAmount = Math.min(deckCard.amount, maxForThisGivenCap);

    if (existingIndex !== -1) target[existingIndex].amount = finalAmount;
    else target.push({ id: deckCard.id, faction: deckCard.faction, amount: finalAmount });

    if (mode === 'main') deck.cards = target; else deck.sideDeck.cards = target;
    decks[deckIndex] = deck;

    await this.saveDecks(decks);
    return finalAmount;
  }

  // =============================
  // SIDE DECK
  // =============================
  async countCardInSideDeck(deckId: string, cardId: string): Promise<number> {
    const deck = await this.getDeckById(deckId);
    if (!deck) return 0;
    return deck.sideDeck.cards.reduce((acc, c) => c.id === cardId ? acc + (c.amount || 0) : acc, 0);
  }

  // =============================
  // COLOR SIGNAL
  // =============================
  async setDeckColor(deckId: string, color?: string): Promise<void> {
    const decks = await this.getDecks();
    const index = decks.findIndex(d => d.id === deckId);
    if (index === -1) return;

    if (color) {
      decks[index].color = color;
      this._deckColor.set(color);
    } else {
      delete decks[index].color;
      this._deckColor.set('');
    }

    await this.saveDecks(decks);
  }

  async getDeckColor(deckId: string): Promise<string> {
    const deck = await this.getDeckById(deckId);
    const color = deck?.color ?? IONIC_DEFAULT_GRAY;
    this._deckColor.set(color);
    return color;
  }

async saveImportedDeck(deck: Deck): Promise<void> {
  try {
    const decks = await this.getDecks();
    const existingNames = decks.map(d => d.name);

    const normalizedDeck = this.normalize(deck);

    // si el nombre ya existe → generar copia
    if (existingNames.includes(normalizedDeck.name)) {
      normalizedDeck.name = this.generateCopyName(
        normalizedDeck.name,
        existingNames
      );
    }

    decks.push(normalizedDeck);
    await this.saveDecks(decks);

    // mostrar info apenas se importa
    await this.showDeckInfo(normalizedDeck);

  } catch (error) {
    console.error('[SERVICE] ERROR:', error);
  }
}



  // =============================
  // UTILS / FILTERS
  // =============================
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
        i++;
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
        return value.includes(normalizedTerm) || this.fuzzyMatch(value, normalizedTerm);
      })
    );
  }

  filteredCards(cards: Card[], selectedFaction: string) {
    if (selectedFaction === 'all') return cards;
    return cards.filter(card => card.faction === selectedFaction);
  }

  sortCards(cards: SortableCard[], sortBy: 'name' | 'amount' | 'faction' | 'rarity', getRarityValue?: (id: string) => number): SortableCard[] {
    const list = [...cards];
    return list.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'amount': return b.amount - a.amount;
        case 'faction': return a.faction.localeCompare(b.faction);
        case 'rarity':
          if (!getRarityValue) return 0;
          return getRarityValue(b.id) - getRarityValue(a.id);
      }
    });
  }

  private generateCopyName(baseName: string, existingNames: string[]): string {
    let copyIndex = 1;
    let newName = `${baseName} (copia)`;
    while (existingNames.includes(newName)) {
      copyIndex++;
      newName = `${baseName} (copia ${copyIndex})`;
    }
    return newName;
  }

  async showDeckInfo(deck: Deck) {
    const creator = deck.creator ?? 'desconocido';
    const hasCollaborators = deck.colaborators && deck.colaborators.length > 0;
    const collaboratorsText = hasCollaborators ? ` y modificado por ${deck.colaborators!.join(', ')}` : '';
    const message = `Este mazo fue creado por ${creator}${collaboratorsText}.`;

    const alert = await this.alertCtrl.create({
      header: 'Información del mazo',
      message,
      buttons: ['OK'],
      backdropDismiss: false,
    });

    await alert.present();
  }

  async getTotalCardsCount(deckId: string): Promise<number> {
    const deck = await this.getDeckById(deckId);
    if (!deck) return 0;
    return deck.cards.reduce((acc, c) => acc + (c.amount || 0), 0);
  }

  async getTotalCardsCountInMain(deckId: string): Promise<number> {
    const deck = await this.getDeckById(deckId);
    if (!deck) return 0;
    return deck.cards.reduce((acc, c) => acc + (c.amount ?? 0), 0);
  }

  async getTotalCardsCountInSide(deckId: string): Promise<number> {
    const deck = await this.getDeckById(deckId);
    if (!deck?.sideDeck) return 0;
    return deck.sideDeck.cards.reduce((acc, c) => acc + (c.amount ?? 0), 0);
  }
}
