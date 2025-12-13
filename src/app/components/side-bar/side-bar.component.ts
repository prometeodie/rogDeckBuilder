import { addIcons } from 'ionicons';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostListener,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { colorPaletteOutline, gridOutline } from 'ionicons/icons';
import { DeckColorComponent } from '../deck-color/deck-color.component';

export type DeckMode = 'main' | 'side';
export type SortBy = 'name' | 'amount' | 'faction' | 'rarity';

@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonIcon,
    DeckColorComponent
  ],
})
export class SideBarComponent {

  @Input() deckMode: DeckMode = 'main';
  @Input() deckId: string = '';
  @Input() totalSelected: number = 0;
  @Input() selectedCards: {
    id: string;
    name: string;
    amount: number;
    faction: string;
    banned?: boolean;
  }[] = [];
  @Input() savedAmounts: { [id: string]: number | undefined } = {};
  @Input() sortBy: SortBy = 'amount';

  @Output() setMode = new EventEmitter<DeckMode>();
  @Output() removeCard = new EventEmitter<string>();
  @Output() sortChanged = new EventEmitter<SortBy>();

  public sortMenuOpen = false;
  public ColorPalette = false;

  @ViewChild('paletteContainer', { read: ElementRef })
  paletteContainer?: ElementRef;

  @ViewChild('paletteButton', { read: ElementRef })
  paletteButton?: ElementRef;

  constructor(private host: ElementRef) {
    addIcons({
      'grid-outline': gridOutline,
      'color-palette-outline': colorPaletteOutline
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
    this.sortChanged.emit(this.sortBy);
    this.sortMenuOpen = false;
  }

  openColorPalette() {
  this.ColorPalette = !this.ColorPalette;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.ColorPalette) return;

    const target = event.target as HTMLElement;

    const clickedInsidePalette =
      this.paletteContainer?.nativeElement.contains(target);

    const clickedPaletteButton =
      this.paletteButton?.nativeElement.contains(target);

    if (!clickedInsidePalette && !clickedPaletteButton) {
      this.ColorPalette = false;
    }
  }


}
