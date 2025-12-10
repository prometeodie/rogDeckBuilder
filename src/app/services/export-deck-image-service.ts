import { Injectable, inject } from '@angular/core';
import html2canvas from 'html2canvas';
import { Card } from '../interfaces/card.interface';
import { DecksCardsService } from './decks-cards';

@Injectable({
  providedIn: 'root'
})
export class ExportDeckImageService {

  private decksService = inject(DecksCardsService);

  constructor() {}

  /** ===================================================
   *   🔵 EXPORTAR POR ID (mantengo tal cual)
   * =================================================== */
  async exportDeckById(deckId: string, allCards: Card[]) {
    const deck = await this.decksService.getDeckById(deckId);
    if (!deck) {
      console.error("Deck no encontrado");
      return;
    }

    const mainDeck = deck.cards.map(c => {
      const cardData = allCards.find(x => x.id === c.id);
      return {
        name: cardData?.name ?? '???',
        img: cardData?.img ?? '',
        qty: c.amount,
        faction: cardData?.faction ?? ''
      };
    });

    const sideDeck = deck.sideDeck.cards.map(c => {
      const cardData = allCards.find(x => x.id === c.id);
      return {
        name: cardData?.name ?? '???',
        img: cardData?.img ?? '',
        qty: c.amount,
        faction: cardData?.faction ?? ''
      };
    });

    await this.exportDeck(mainDeck, sideDeck);
  }

  /** ===================================================
   *   🔵 EXPORTAR — genera imagen final
   * =================================================== */
  async exportDeck(mainDeck: any[], sideDeck: any[]) {
    const element = document.getElementById('deck-export-area');
    if (!element) {
      console.error('No existe el elemento deck-export-area.');
      return;
    }

    element.innerHTML = this.generateHtml(mainDeck, sideDeck);
    await this.waitImagesLoad(element);

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff'
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'deck.png';
    link.click();
  }

  /** ===================================================
   *   🔵 HTML BONITO, ORDENADO, PRO
   * =================================================== */
  private generateHtml(main: any[], side: any[]): string {
    return `
      <div style="
        width: 1100px;
        padding: 30px;
        font-family: Arial;
        background: #fbfbfb;
        border-radius: 12px;
        border: 1px solid #ddd;
      ">

        <!-- Main Deck -->
        <h1 style="
          margin: 0 0 20px;
          font-size: 32px;
          letter-spacing: 1px;
        ">Main Deck (${main.reduce((a,c)=> a + c.qty, 0)} cartas)</h1>

        ${this.sectionCards(main)}

        <div style="
          margin: 40px 0;
          height: 3px;
          background: #222;
          border-radius: 2px;
        "></div>

        <!-- Side Deck -->
        <h1 style="
          margin: 0 0 20px;
          font-size: 32px;
          letter-spacing: 1px;
        ">Side Deck (${side.reduce((a,c)=> a + c.qty, 0)} cartas)</h1>

        ${this.sectionCards(side)}

      </div>
    `;
  }

  /** ===================================================
   *   🔵 RENDERIZA UNA SECCIÓN DE CARTAS (grid)
   * =================================================== */
  private sectionCards(cards: any[]): string {
    return `
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 15px;
      ">
        ${cards.map(card => `
          <div style="
            width: 150px;
            text-align: center;
            background: #fff;
            padding: 8px;
            border-radius: 6px;
            border: 1px solid #ccc;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          ">
            <img src="${card.img}" crossorigin="anonymous"
                style="width: 100%; border-radius: 6px;">
            <div style="font-size: 14px; margin-top: 6px;">
              <strong>${card.name}</strong>
            </div>
            <div style="font-size: 13px; color: #333;">
              Cantidad: ${card.qty}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /** ===================================================
   *   🔵 Esperar carga de imágenes
   * =================================================== */
  private waitImagesLoad(parent: HTMLElement): Promise<void> {
    const imgs = Array.from(parent.getElementsByTagName('img'));

    return Promise.all(
      imgs.map(img =>
        new Promise<void>(resolve => {
          if (img.complete) resolve();
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
      )
    ).then(() => undefined);
  }
}
