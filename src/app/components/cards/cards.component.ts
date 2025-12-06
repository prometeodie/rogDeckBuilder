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

    // debounced save: cuando emite, intentamos persistir y usamos lo que el servicio retorna
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

  /** Incremento local optimista; validaciones rápidas antes de incrementar */
  async increase(): Promise<void> {
    if (!this.deckId) return;

    // límite por rareza (local)
    const maxRarity = this.rarityLimits[this.cardData.rarity ?? 'common'] ?? 4;
    if (maxRarity > 0 && this.count >= maxRarity) {
      return;
    }

    // chequeo rápido del tope del deck/side (para evitar increments inútiles)
    const mode = this.mode;
    const totalNow = mode === 'main'
      ? await this.deckService.getTotalCardsCountInMain(this.deckId)
      : await this.deckService.getTotalCardsCountInSide(this.deckId);

    const cap = mode === 'main' ? 40 : 15;
    if (totalNow >= cap) {
      // ya está lleno
      this.presentToast(mode === 'main' ? 'El mazo principal ya está completo.' : 'El Side Deck ya está completo.', 'warning', 'middle');
      return;
    }

    // todo ok -> incremento optimista local y programo guardado
    this.count++;
    this.saveSubject.next(this.count);
  }

  decrease(): void {
    if (this.count > 0) {
      this.count--;
      this.saveSubject.next(this.count);
    }
  }

  /** intenta persistir y ajusta `this.count` al valor real guardado (retornado por el servicio) */
  private async attemptSave(amount: number): Promise<void> {
    if (!this.deckId) return;

    // 1) Obtengo el valor guardado actualmente en el storage para esta carta y modo
    const deck = await this.deckService.getDeckById(this.deckId);
    let prevSaved = 0;
    if (deck) {
      const source = this.mode === 'main' ? (deck.cards ?? []) : (deck.sideDeck?.cards ?? []);
      const found = source.find(c => c.id === this.cardData.id);
      prevSaved = found ? (found.amount ?? 0) : 0;
    }

    // 2) preparo objeto y pido al servicio que upserte; el servicio devuelve la cantidad final guardada
    const deckCard: DeckCard = {
      id: this.cardData.id,
      faction: this.cardData.faction,
      amount: amount
    };

    const finalAmount = await this.deckService.upsertCardInDeck(this.deckId, deckCard, this.mode);

    // 3) sincronizo contador local si el servicio recortó o ajustó
    if (finalAmount !== this.count) {
      // actualizar contador local al valor REAL
      this.count = finalAmount;

      // notificar al usuario si hubo recorte (por tope)
      if (finalAmount < amount) {
        const capMsg = this.mode === 'main'
          ? 'Se alcanzó el límite del mazo principal. Cantidad ajustada.'
          : 'Se alcanzó el límite del Side Deck. Cantidad ajustada.';
        this.presentToast(capMsg, 'warning', 'middle' );
      }
    }

    // 4) determino si se "sumó realmente" comparando finalAmount con prevSaved (valor anterior en storage)
    const added = finalAmount > prevSaved;
    const removed = finalAmount < prevSaved; // no usamos para toasts en tu pedido, pero lo dejo claro

    if (added) {
      // mostrar toasts especiales sólo si se agregó realmente
      if (this.cardData.banned) {
        this.presentToast('Atención: agregaste una carta BANEADA.', 'danger','top');
      }
      if ((this.cardData as any).isToken) {
        this.presentToast('Agregaste un TOKEN al mazo.', 'primary','top');
      }
    }

    // 5) notifico al padre con la cantidad REAL guardada
    this.amountChange.emit({
      id: this.cardData.id,
      amount: finalAmount,
      mode: this.mode
    });
  }

  showImg(): void {
    this.ImgView.emit(this.cardData.img);
  }

  async presentToast(message: string, color: string, position: 'top' | 'middle' | 'bottom') {
  const toast = document.createElement('ion-toast');
  toast.message = message;
  toast.color = color;
  toast.duration = 2000;
  toast.position = position;

  document.body.appendChild(toast);
  await toast.present();
}


}
