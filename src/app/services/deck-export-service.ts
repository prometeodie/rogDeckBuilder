import { Injectable } from '@angular/core';
import { Deck } from '../interfaces/deck.interface';
import { DeckCard } from '../interfaces/deck-card.interface';

@Injectable({
  providedIn: 'root',
})
export class DeckExportService {

downloadDeck(deck: Deck, currentPlayer: string) {
  const deckToExport: Deck = structuredClone(deck);

  deckToExport.colaborators ??= [];

  // ------------------------------------------------
  // ASEGURAR originalName
  // ------------------------------------------------
  if (!deckToExport.originalName) {
    deckToExport.originalName = deckToExport.name;
  }

  // ------------------------------------------------
  // PRIMERA EXPORTACIÓN REAL
  // ------------------------------------------------
  if (!deckToExport.creator) {
    deckToExport.creator = currentPlayer;
    deckToExport.baseDeckCards = structuredClone(deckToExport.cards);
  }

  // ------------------------------------------------
  // ASEGURAR BASE (mazos antiguos / importados)
  // ------------------------------------------------
  if (!deckToExport.baseDeckCards) {
    deckToExport.baseDeckCards = structuredClone(deckToExport.cards);
  }

  // ------------------------------------------------
  // DETECTAR CAMBIOS
  // ------------------------------------------------
  const cardsChanged = !this.areDeckCardsEqual(
    deckToExport.baseDeckCards,
    deckToExport.cards
  );

  const nameChanged =
    deckToExport.originalName !== deckToExport.name;

  if (cardsChanged || nameChanged) {

    // agregar colaborador si corresponde
    if (
      deckToExport.creator !== currentPlayer &&
      !deckToExport.colaborators.includes(currentPlayer)
    ) {
      deckToExport.colaborators.push(currentPlayer);
    }

    if (cardsChanged) {
      deckToExport.baseDeckCards = structuredClone(deckToExport.cards);
    }

    if (nameChanged) {
      deckToExport.originalName = deckToExport.name;
    }
  }

  // ------------------------------------------------
  // DESCARGA
  // ------------------------------------------------
  const json = JSON.stringify(deckToExport, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${deckToExport.name}.json`;
  a.click();

  window.URL.revokeObjectURL(url);
}



private areDeckCardsEqual(a: DeckCard[], b: DeckCard[]): boolean {
  if (a.length !== b.length) return false;

  const mapA = new Map(a.map(c => [c.id, c.amount]));
  const mapB = new Map(b.map(c => [c.id, c.amount]));

  if (mapA.size !== mapB.size) return false;

  for (const [id, amount] of mapA) {
    if (mapB.get(id) !== amount) return false;
  }

  return true;
}

}
