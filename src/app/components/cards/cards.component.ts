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

  public count: number = 0;
  public factionCost: number = 3;
  public cost: number = 5; // este va en romano

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


get romanCost(): string {
  return this.toRoman(this.cost);
}

private toRoman(num: number): string {
  if (num <= 0) return '';

  const romanMap: { value: number; symbol: string }[] = [
    { value: 1000, symbol: 'M' },
    { value: 900, symbol: 'CM' },
    { value: 500, symbol: 'D' },
    { value: 400, symbol: 'CD' },
    { value: 100, symbol: 'C' },
    { value: 90, symbol: 'XC' },
    { value: 50, symbol: 'L' },
    { value: 40, symbol: 'XL' },
    { value: 10, symbol: 'X' },
    { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' },
    { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' },
  ];

  let roman = '';
  for (const obj of romanMap) {
    while (num >= obj.value) {
      roman += obj.symbol;
      num -= obj.value;
    }
  }
  return roman;
}
}
