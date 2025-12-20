import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class ExportDeckImageService {

  constructor() {}

  /** ==========================================
   *   EXPORTAR COMPONENTE deck-export
   * ========================================== */
  async exportRenderedDeck(deckName:string): Promise<void> {
    const element = document.getElementById('deck-export-area');

    if (!element) {
      console.error('No se encontró #deck-export-area');
      return;
    }

    await this.waitImagesLoad(element);

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: null, // respeta tu fondo oscuro
      useCORS: true
    });

    const dataUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${deckName}.png`;
    link.click();
  }

  /** ==========================================
   *   Esperar carga de imágenes
   * ========================================== */
  private waitImagesLoad(parent: HTMLElement): Promise<void> {
    const images = Array.from(parent.querySelectorAll('img'));

    return Promise.all(
      images.map(img =>
        new Promise<void>(resolve => {
          if (img.complete) return resolve();
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
      )
    ).then(() => undefined);
  }
}
