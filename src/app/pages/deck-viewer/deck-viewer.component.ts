import {
  Component,
  inject,
  signal,
  computed,
  OnInit
} from '@angular/core';

import {
  IonHeader,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
  IonContent,
  IonTitle,
  IonIcon,
  ViewWillEnter
} from '@ionic/angular/standalone';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { Deck } from '../../interfaces/deck.interface';
import { DecksCardsService } from 'src/app/services/decks-cards';
import { CardsLoaderService } from 'src/app/services/cards-loader-service';

import { CardListComponent } from 'src/app/components/card-list/card-list.component';
import { EstadisticsComponent } from 'src/app/components/estadistics/estadistics.component';
import { DeckCardsComponent } from 'src/app/components/deck-cards/deck-cards.component';

import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  barChartOutline,
  listOutline,
  tabletPortraitOutline
} from 'ionicons/icons';

@Component({
  selector: 'deck-viewer',
  standalone: true,
  templateUrl: './deck-viewer.component.html',
  styleUrls: ['./deck-viewer.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonContent,
    DeckCardsComponent,
    CardListComponent,
    EstadisticsComponent
  ]
})
export class DeckViewerComponent implements OnInit, ViewWillEnter {

  private route = inject(ActivatedRoute);
  private decksService = inject(DecksCardsService);
  private cardsLoader = inject(CardsLoaderService);

  public deck = signal<Deck | null>(null);
  public loading = signal(true);
  public currentView = signal<'view1' | 'view2' | 'view3'>('view1');

  /** Fuente reactiva */
  public cards = this.cardsLoader.allCards;

  public expandedMain = computed(() => {
    const d = this.deck();
    const cards = this.cards();

    if (!d || !cards.length) return [];

    return d.cards.map(c => ({
      ...c,
      data: cards.find(card => card.id === c.id) ?? null
    }));
  });

  public expandedSide = computed(() => {
    const d = this.deck();
    const cards = this.cards();

    if (!d || !cards.length) return [];

    return d.sideDeck.cards.map(c => ({
      ...c,
      data: cards.find(card => card.id === c.id) ?? null
    }));
  });

  public totalMainCards = computed(() =>
    this.deck()?.cards.reduce((a, c) => a + c.amount, 0) ?? 0
  );

  public totalSideCards = computed(() =>
    this.deck()?.sideDeck.cards.reduce((a, c) => a + c.amount, 0) ?? 0
  );

  constructor() {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'bar-chart-outline': barChartOutline,
      'list-outline': listOutline,
      'tablet-portrait-outline': tabletPortraitOutline
    });
  }

  ngOnInit(): void {
    // NO cargar datos acá en Ionic
  }

  async ionViewWillEnter(): Promise<void> {
    this.loading.set(true);

    // 🔴 ORDEN CORRECTO
    await this.cardsLoader.loadAll();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = await this.decksService.getDeckById(id);
      this.deck.set(found ?? null);
    }

    this.loading.set(false);
  }

  onSegmentChange(ev: any): void {
    this.currentView.set(ev.detail.value);
  }
}
