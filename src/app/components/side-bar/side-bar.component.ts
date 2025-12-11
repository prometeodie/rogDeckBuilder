import { addIcons } from 'ionicons';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gridOutline } from 'ionicons/icons';

export type DeckMode = 'main' | 'side';
export type SortBy = 'name' | 'amount' | 'faction' | 'rarity';

@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonButton, IonIcon ],
})
export class SideBarComponent {

  @Input() deckMode: DeckMode = 'main';
  @Input() totalSelected: number = 0;
  @Input() selectedCards: { id: string; name: string; amount: number; faction: string; banned?: boolean }[] = [];
  @Input() savedAmounts: { [id: string]: number | undefined } = {};

  // *** AHORA: sortBy SIEMPRE ES SortBy (no string) ***
  @Input() sortBy: SortBy = 'amount';

  @Output() setMode = new EventEmitter<DeckMode>();
  @Output() removeCard = new EventEmitter<string>();

  // *** AHORA sortChanged emite SortBy ***
  @Output() sortChanged = new EventEmitter<SortBy>();

  public sortMenuOpen = false;

  constructor() {
    addIcons({
      'grid-outline': gridOutline,
    });
  }

  onSetMode(mode: DeckMode) {
    if (mode === this.deckMode) return;
    this.setMode.emit(mode);
  }

  onRemoveCard(id: string) {
    this.removeCard.emit(id);
  }

  toggleSortMenu() {
    this.sortMenuOpen = !this.sortMenuOpen;
  }

  // *** Se asegura que sortBy sea SortBy ***
  onSortChangeAndClose() {
    this.sortChanged.emit(this.sortBy);
    this.sortMenuOpen = false;
  }
}
