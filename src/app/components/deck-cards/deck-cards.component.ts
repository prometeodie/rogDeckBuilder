import { CommonModule } from '@angular/common';
import { Component, inject, Inject, Input, OnInit, Output } from '@angular/core';
import { ExpandedDeckCard } from 'src/app/interfaces/expanded.deck.card.interface';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { IonIcon } from "@ionic/angular/standalone";
import { gridOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FormsModule } from '@angular/forms';
import { DecksCardsService } from 'src/app/services/decks-cards';

@Component({
  selector: 'deck-cards',
  templateUrl: './deck-cards.component.html',
  styleUrls: ['./deck-cards.component.scss'],
  standalone: true,
  imports: [CommonModule, ImageViewerComponent, IonIcon, FormsModule],
})
export class DeckCardsComponent  implements OnInit {

   @Input() mainCards: ExpandedDeckCard[] = [];
   @Input() sideCards: ExpandedDeckCard[] = [];
   @Input() mainCardsAmount: number = 0;
   @Input() sideCardsAmount: number = 0;
   @Input() sortBy: string = 'amount';

   private deckService = inject(DecksCardsService);

   public showImg = false;
   public img = '';
   public sortMenuOpen: boolean = false;

   constructor() {
      addIcons({ 'grid-outline': gridOutline,});
    }


  ngOnInit() {}

    openCloseViewer(img:string) {
    this.showImg = !this.showImg;

    (this.showImg) ? this.img = img : this.img = '';
  }


 onSortChangeAndClose() {
  this.sortMenuOpen = !this.sortMenuOpen;
}
}
