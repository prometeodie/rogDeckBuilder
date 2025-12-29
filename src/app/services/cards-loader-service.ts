import { Injectable, signal } from '@angular/core';
import { Card } from '../interfaces/card.interface';

export type Faction =
  | 'jupiter'
  | 'marte'
  | 'pluton'
  | 'saturno'
  | 'tierra'
  | 'neptuno';

@Injectable({ providedIn: 'root' })
export class CardsLoaderService {

  /** Cache interno por facción */
  private cache = new Map<Faction, Card[]>();

  /** Signal público con TODAS las cartas cargadas */
  readonly allCards = signal<Card[]>([]);

  /** Loaders por facción */
  private loaders: Record<Faction, () => Promise<Card[]>> = {
    jupiter: async () =>
      (await import('../../cards/jupiter.cards')).JUPITER_CARDS,

    marte: async () =>
      (await import('../../cards/marte.cards')).MARTE_CARDS,

    pluton: async () =>
      (await import('../../cards/pluton.cards')).PLUTON_CARDS,

    saturno: async () =>
      (await import('../../cards/saturno.cards')).SATURNO_CARDS,

    tierra: async () =>
      (await import('../../cards/tierra.cards')).TIERRA_CARDS,

    neptuno: async () =>
      (await import('../../cards/neptuno.cards')).NEPTUNO_CARDS,
  };

  /** Carga una facción (lazy + cache) */
  async loadFaction(faction: Faction): Promise<Card[]> {
    if (this.cache.has(faction)) {
      return this.cache.get(faction)!;
    }

    const cards = await this.loaders[faction]();
    this.cache.set(faction, cards);
    this.rebuildAllCards();

    return cards;
  }

  /** Fuerza la carga de TODAS las facciones */
  async loadAll(): Promise<void> {
    const factions = Object.keys(this.loaders) as Faction[];

    for (const f of factions) {
      if (!this.cache.has(f)) {
        const cards = await this.loaders[f]();
        this.cache.set(f, cards);
      }
    }

    this.rebuildAllCards();
  }

  /** Reconstruye el signal global */
  private rebuildAllCards(): void {
    const result: Card[] = [];

    for (const cards of this.cache.values()) {
      result.push(...cards);
    }

    this.allCards.set(result);
  }
}
