import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class DeckCardsComponent implements OnChanges {

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


ngOnChanges(changes: SimpleChanges) {
  const mainChanged = changes['mainCards'] && this.mainCards.length;
  const sideChanged = changes['sideCards'] && this.sideCards.length;

  if (mainChanged || sideChanged) {
    this.sortBy = 'amount';
    this.applySorting();
  }
}


  openCloseViewer(img: string) {
    this.showImg = !this.showImg;
    this.img = this.showImg ? img : '';
  }
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

    return map[key] ?? 0;
  }

  /** =========================================
   *    APLICAR ORDENAMIENTO USANDO EL SERVICIO
   * ========================================= */
  applySorting() {
    const sorter = this.deckService.sortCards.bind(this.deckService);

      const mainForSort = this.mainCards.map(c => ({
    id: c.id,
    name: c.data?.name ?? '',
    amount: c.amount,
    faction: c.data?.faction ?? ''
  }));


    const sideForSort = this.sideCards.map(c => ({
      id: c.id,
      name: c.data?.name ?? '',
      amount: c.amount,
      faction: c.data?.faction ?? '',
      rarity: this.rarityToNumber(c.data?.rarity ?? null)
    }));

    const getRarityValueForMain = (id: string) =>
  this.mainCards.find(x => x.id === id)?.data?.rarity ?? '';


    const getRarityValueForSide = (id: string) =>
  this.sideCards.find(x => x.id === id)?.data?.rarity ?? '';


    const sortedMain = sorter(mainForSort, this.sortBy, getRarityValueForMain);
    const sortedSide = sorter(sideForSort, this.sortBy, getRarityValueForSide);

    this.mainCards = sortedMain.map(s => {
      const orig = this.mainCards.find(c => c.id === s.id)!;
      return { ...orig, amount: s.amount };
    });

    this.sideCards = sortedSide.map(s => {
      const orig = this.sideCards.find(c => c.id === s.id)!;
      return { ...orig, amount: s.amount };
    });
  }

  onSortChangeAndClose() {
    this.sortMenuOpen = !this.sortMenuOpen;

    if (!this.sortMenuOpen) {
      this.applySorting();
    }
  }
}
