import { addIcons } from 'ionicons';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gridOutline } from 'ionicons/icons';

export type DeckMode = 'main' | 'side';

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
  @Input() sortBy: string = 'name';

  /* ---------- Outputs (eventos que el padre debe escuchar) ---------- */
  @Output() setMode = new EventEmitter<DeckMode>();
  @Output() removeCard = new EventEmitter<string>();
  @Output() sortChanged = new EventEmitter<string>();


  public localSearch = '';
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

 onSortChangeAndClose() {
  this.sortChanged.emit(this.sortBy);   // le manda al padre qué opción eligió
  this.sortMenuOpen = false;
}

}
