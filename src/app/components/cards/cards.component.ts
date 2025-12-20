// src/app/components/cards/cards.component.ts
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
import Swal, { SweetAlertPosition, SweetAlertIcon } from 'sweetalert2';

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
  @Input() mode: 'main' | 'side' = 'main';
  @Output() ImgView = new EventEmitter<string>();
  @Output() amountChange = new EventEmitter<{
    id: string;
    amount: number;
    mode: 'main' | 'side';
  }>();

  public count = 0;
  private saveSubject = new Subject<number>();
  private sub?: Subscription;

  private rarityLimits: Record<string, number> = {
    common: 4,
    rare: 3,
    epic: 2,
    legendary: 1,
    unlimited: 0
  };

  public selloPorFaccion: Record<string, string> = {
    jupiter: 'SELLO-JUPITER.png',
    marte: 'SELLO-MARTE.png',
    pluton: 'SELLO-PLUTON.png',
    saturno: 'SELLO-SATURNO.png',
    tierra: 'SELLO-TIERRA.png',
    neptuno: 'SELLO-NEPTUNO.png'
  };

  constructor(private deckService: DecksCardsService) {
    addIcons({ 'remove': removeOutline, 'add': addOutline });
  }

  ngOnInit(): void {
    this.count = this.initialCount;

    this.sub = this.saveSubject
      .pipe(debounceTime(300))
      .subscribe(async (amount) => {
        await this.attemptSave(amount);
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

  getSelloImg(): string {
    const fac = this.cardData.faction?.toLowerCase();
    const file = this.selloPorFaccion[fac] ?? 'SELLO-TIERRA.png';
    return `../../../assets/SELLOS/${file}`;
  }

  async increase(): Promise<void> {
    if (!this.deckId) return;

    const isUnlimited = this.cardData.isSeal || this.cardData.isToken;

    if (!isUnlimited) {
      const maxRarity = this.rarityLimits[this.cardData.rarity ?? 'common'] ?? 4;
      if (maxRarity > 0 && this.count >= maxRarity) {
        return;
      }
    }

    const totalNow = this.mode === 'main'
      ? await this.deckService.getTotalCardsCountInMain(this.deckId)
      : await this.deckService.getTotalCardsCountInSide(this.deckId);

    const cap = this.mode === 'main' ? 40 : 15;

    if (totalNow >= cap) {
      this.showToast(
        this.mode === 'main'
          ? 'El mazo principal ya está completo.'
          : 'El Side Deck ya está completo.',
        'warning',
        'center'
      );
      return;
    }

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

    const deck = await this.deckService.getDeckById(this.deckId);
    let prevSaved = 0;

    if (deck) {
      const source = this.mode === 'main'
        ? (deck.cards ?? [])
        : (deck.sideDeck?.cards ?? []);

      const found = source.find(c => c.id === this.cardData.id);
      prevSaved = found ? (found.amount ?? 0) : 0;
    }

    const deckCard: DeckCard = {
      id: this.cardData.id,
      faction: this.cardData.faction,
      amount
    };

    const finalAmount = await this.deckService.upsertCardInDeck(
      this.deckId,
      deckCard,
      this.mode
    );

    if (finalAmount !== this.count) {
      this.count = finalAmount;

      if (finalAmount < amount) {
        this.showToast(
          this.mode === 'main'
            ? 'Se alcanzó el límite del mazo principal. Cantidad ajustada.'
            : 'Se alcanzó el límite del Side Deck. Cantidad ajustada.',
          'warning',
          'center'
        );
      }
    }

    const added = finalAmount > prevSaved;

    if (added) {
      if (this.cardData.banned) {
        this.showToast(
          'Atención: agregaste una carta BANEADA.',
          'error',
          'top'
        );
      }

      if ((this.cardData as any).isToken) {
        this.showToast(
          'Agregaste un TOKEN al mazo.',
          'info',
          'top'
        );
      }
    }

    this.amountChange.emit({
      id: this.cardData.id,
      amount: finalAmount,
      mode: this.mode
    });
  }

  showImg(): void {
    this.ImgView.emit(this.cardData.img);
  }

  private showToast(
    message: string,
    icon: SweetAlertIcon,
    position: SweetAlertPosition = 'top'
  ) {
    const backgroundByIcon: Record<SweetAlertIcon, string> = {
      success: '#2ecc71',
      warning: '#cfaf2eff',
      error: '#c0392b',
      info: '#2980b9',
      question: '#34495e'
    };

    const textColor = icon === 'warning' ? '#000' : '#fff';

    Swal.fire({
      toast: true,
      position,
      icon,
      title: message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: backgroundByIcon[icon],
      color: textColor
    });
  }
}
