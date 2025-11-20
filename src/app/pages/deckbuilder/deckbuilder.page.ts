import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonSearchbar,
  IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, searchOutline } from 'ionicons/icons';
import { CardsComponent } from "src/app/components/cards/cards.component";

addIcons({ searchOutline, arrowBackOutline });
@Component({
  selector: 'deckbuilder',
  templateUrl: './deckbuilder.page.html',
  styleUrls: ['./deckbuilder.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    CommonModule, FormsModule, IonIcon, IonSearchbar, IonButton, RouterModule,
    CardsComponent
]
})
export class DeckbuilderPage implements OnInit, AfterViewInit {

  items = [
  'Intro Pack',
  'Orc Warrior',
  'Orc Archer',
  'Elven Ranger',
  'Fireball',
  'Healing Potion',
  'Loaded Sling',
  'Magic Bolt',
  'Conscript',
  'Mana Potion',
  'Shield Bash',
  'Guardian Knight',
  'Assassin',
  'Dragon Whelp',
  'Lightning Arrow',
];

ngAfterViewInit() {
  const nav = document.querySelector('.sticky-nav') as HTMLElement;
  document.documentElement.style.setProperty('--nav-height', nav.offsetHeight + 'px');
}

  private route = inject(ActivatedRoute);
  public searchOpen: boolean = false;

  deckId = toSignal(this.route.paramMap.pipe(
    map(params => params.get('id'))
  ));

  ngOnInit() {
    console.log('ngOnInit ID:', this.deckId());
    if (this.deckId()) {
      this.loadDeck(this.deckId()!);
    }
  }

  loadDeck(id: string) {
    console.log('Cargar datos del deck con ID:', id);
    // llamada a tu servicio aquí
  }

toggleSearch(event: Event) {
  event.stopPropagation();
  this.searchOpen = !this.searchOpen;
}

closeSearch() {
  if (this.searchOpen) {
    this.searchOpen = false;
  }
}
}
