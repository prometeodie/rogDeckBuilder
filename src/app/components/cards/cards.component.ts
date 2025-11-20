import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard, IonCardContent, IonButton, IonIcon, IonImg
} from '@ionic/angular/standalone';
import {
  removeOutline,
  addOutline
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'card',
  standalone: true,
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
  imports: [
    CommonModule,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonImg
  ]
})
export class CardsComponent {

  @Input() imgUrl: string = '';
  @Input() initialCount: number = 0;

  count = 0;

   constructor() {
      addIcons({
        'remove': removeOutline,
        'add': addOutline,
      });
    }
  ngOnInit() {
    this.count = this.initialCount;
  }

  increase() {
    this.count++;
  }

  decrease() {
    if (this.count > 0) this.count--;
  }
}
