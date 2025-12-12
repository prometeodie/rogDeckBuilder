import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ExpandedDeckCard } from 'src/app/interfaces/expanded.deck.card.interface';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { IonIcon } from "@ionic/angular/standalone";
import { gridOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FormsModule } from '@angular/forms';
import { DecksCardsService } from 'src/app/services/decks-cards';

type SortBy = 'name' | 'amount' | 'faction' | 'rarity';

@Component({
  selector: 'deck-cards',
  templateUrl: './deck-cards.component.html',
  styleUrls: ['./deck-cards.component.scss'],
  standalone: true,
  imports: [CommonModule, ImageViewerComponent, IonIcon, FormsModule],
})
export class DeckCardsComponent implements OnInit {

  @Input() mainCards: ExpandedDeckCard[] = [];
  @Input() sideCards: ExpandedDeckCard[] = [];
  @Input() mainCardsAmount: number = 0;
  @Input() sideCardsAmount: number = 0;

  @Input() sortBy: SortBy = 'amount';

  private deckService = inject(DecksCardsService);

  public showImg = false;
  public img = '';
  public sortMenuOpen: boolean = false;

  constructor() {
    addIcons({ 'grid-outline': gridOutline });
  }

  ngOnInit() {}

  openCloseViewer(img: string) {
    this.showImg = !this.showImg;
    this.img = this.showImg ? img : '';
  }

  /**
   * Convierte la rareza (string) a un número para ordenar.
   * Aumenta el número según más "rara" (legendary > epic > rare > common).
   * Ajusta valores si tu dominio usa otra escala.
   */
  private rarityToNumber(rarity?: string | null): number {
    if (!rarity) return 0;
    const key = String(rarity).toLowerCase().trim();

    const map: Record<string, number> = {
      legendary: 5,
      epic: 4,
      rare: 3,
      common: 2,
      unlimited: 1
    };

    return map[key] ?? 0; // fallback 0 para valores inesperados
  }

  /** =========================================
   *    APLICAR ORDENAMIENTO USANDO EL SERVICIO
   * ========================================= */
  applySorting() {
    const sorter = this.deckService.sortCards.bind(this.deckService);

    // Preparamos lista para el servicio: rarity ya numérica
    const mainForSort = this.mainCards.map(c => ({
      id: c.id,
      name: c.data?.name ?? '',
      amount: c.amount,
      faction: c.data?.faction ?? '',
      rarity: this.rarityToNumber(c.data?.rarity ?? null)
    }));

    const sideForSort = this.sideCards.map(c => ({
      id: c.id,
      name: c.data?.name ?? '',
      amount: c.amount,
      faction: c.data?.faction ?? '',
      rarity: this.rarityToNumber(c.data?.rarity ?? null)
    }));

    // Callback que el servicio usará para preguntar por rarity por id
    const getRarityValueForMain = (id: string) =>
      this.rarityToNumber(this.mainCards.find(x => x.id === id)?.data?.rarity ?? null);

    const getRarityValueForSide = (id: string) =>
      this.rarityToNumber(this.sideCards.find(x => x.id === id)?.data?.rarity ?? null);

    // Ordenamos (service devuelve un array de SortableCard)
    const sortedMain = sorter(mainForSort, this.sortBy, getRarityValueForMain);
    const sortedSide = sorter(sideForSort, this.sortBy, getRarityValueForSide);

    // Reconstruimos mainCards / sideCards manteniendo la data original y actualizando el orden
    this.mainCards = sortedMain.map(s => {
      const orig = this.mainCards.find(c => c.id === s.id)!;
      return { ...orig, amount: s.amount };
    });

    this.sideCards = sortedSide.map(s => {
      const orig = this.sideCards.find(c => c.id === s.id)!;
      return { ...orig, amount: s.amount };
    });
  }

  /** Toggle y aplicar */
  onSortChangeAndClose() {
    this.sortMenuOpen = !this.sortMenuOpen;

    // si cerramos el popup aplicamos el orden (puedes cambiar la lógica)
    if (!this.sortMenuOpen) {
      this.applySorting();
    }
  }
}
