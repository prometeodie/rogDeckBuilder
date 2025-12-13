import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DECK_COLORS, IONIC_DEFAULT_GRAY } from 'src/app/constant/decks.colors';
import { DecksCardsService } from 'src/app/services/decks-cards';


@Component({
  selector: 'deck-color',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './deck-color.component.html',
  styleUrls: ['./deck-color.component.scss'],
})
export class DeckColorComponent  implements OnInit {

  @Input({ required: true }) deckId!: string;

  colors = Object.values(DECK_COLORS);
  currentColor: string = IONIC_DEFAULT_GRAY;

  constructor(private decksService: DecksCardsService) {}

  async ngOnInit(): Promise<void> {
    this.currentColor = await this.decksService.getDeckColor(this.deckId);
  }

  async selectColor(color: string): Promise<void> {
    this.currentColor = color;
    await this.decksService.setDeckColor(this.deckId, color);
  }

  getCircleStyle(index: number, total: number): { [key: string]: string } {
  const angle = (360 / total) * index - 90;
  const radius = 3.5; // rem
  const center = 4.5; // rem

  const x = center + radius * Math.cos(angle * Math.PI / 180);
  const y = center + radius * Math.sin(angle * Math.PI / 180);

  return {
    left: `${x}rem`,
    top: `${y}rem`,
    transform: 'translate(-50%, -50%)'
  };
}

}

