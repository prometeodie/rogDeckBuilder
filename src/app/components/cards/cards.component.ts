import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard, IonCardContent, IonButton, IonIcon, IonImg
} from '@ionic/angular/standalone';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DecksCardsService } from 'src/app/services/decks-cards';
import { Card } from 'src/app/interfaces/card.interface';
import { DeckCard } from 'src/app/interfaces/deck-card.interface';
import { addIcons } from 'ionicons';
import { addOutline, removeOutline } from 'ionicons/icons';
import { RomanPipe } from 'src/app/pipes/roman-pipe';

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
    IonImg,
    RomanPipe
  ]
})
export class CardsComponent implements OnInit, OnDestroy, OnChanges {

  @Input() initialCount = 0;
  @Input() deckId?: string;
  @Input() cardData!: Card;
  @Output() ImgView = new EventEmitter<string>();
  @Output() amountChange = new EventEmitter<void>();

  public count = 0;
  private saveSubject = new Subject<number>();
  private sub?: Subscription;

  private rarityLimits: Record<string, number> = {
    common: 4,
    rare: 3,
    epic: 2,
    legendary: 1
  };

  constructor(private deckService: DecksCardsService) {
    addIcons({ 'remove': removeOutline, 'add': addOutline });
  }

  ngOnInit(): void {
    this.count = this.initialCount;

    this.sub = this.saveSubject
      .pipe(debounceTime(350))
      .subscribe(async (amount) => {
        await this.attemptSave(amount);
        // notificar padre que hubo cambio persistido
        this.amountChange.emit();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialCount'] && changes['initialCount'].currentValue !== undefined) {
      this.count = changes['initialCount'].currentValue;
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  async increase(): Promise<void> {
    if (!this.deckId) return;

    // límite por rareza
    const maxRarity = this.rarityLimits[this.cardData.rarity ?? 'common'] ?? 4;
    if (this.count >= maxRarity) return;

    // límite 40 por mazo
    const totalNow = await this.deckService.getTotalCardsCount(this.deckId);
    if (totalNow >= 40) return;

    this.count++;
    this.saveSubject.next(this.count);
  }

  decrease(): void {
    if (this.count > 0) {
      this.count--;
      this.saveSubject.next(this.count);
    }
  }

  private async attemptSave(amount: number): Promise<void> {
    if (!this.deckId) return;

    const deckCard: DeckCard = {
      id: this.cardData.id,
      faction: this.cardData.faction,
      amount: amount
    };

    await this.deckService.upsertCardInDeck(this.deckId, deckCard);
  }

  showImg(): void {
    this.ImgView.emit(this.cardData.img);
  }
}
