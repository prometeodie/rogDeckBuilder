import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonContent, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { ExpandedDeckCard } from 'src/app/interfaces/expanded.deck.card.interface';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';

@Component({
  selector: 'card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
  standalone: true,
    imports: [
    CommonModule,
    IonList,
    IonItem,
    IonLabel,
    ImageViewerComponent
  ]
})
export class CardListComponent{

  @Input() mainCards: ExpandedDeckCard[] = [];
  @Input() sideCards: ExpandedDeckCard[] = [];
  @Input() mainCardsAmount: number = 0;
  @Input() sideCardsAmount: number = 0;

  public showImg = false;
  public img = '';

  constructor() { }

  openCloseViewer(img:string) {
    this.showImg = !this.showImg;

    (this.showImg) ? this.img = img : this.img = '';
  }

}
