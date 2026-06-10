import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { IonList, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ExpandedDeckCard } from 'src/app/interfaces/expanded.deck.card.interface';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { addIcons } from 'ionicons';
import { downloadOutline } from 'ionicons/icons';
import { ExportDeckImageService } from 'src/app/services/export-deck-image-service';
import Swal from 'sweetalert2';

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
    IonButton,
    IonIcon,
    ImageViewerComponent,
  ]
})
export class CardListComponent {

  @Input() mainCards: ExpandedDeckCard[] = [];
  @Input() sideCards: ExpandedDeckCard[] = [];
  @Input() mainCardsAmount: number = 0;
  @Input() sideCardsAmount: number = 0;
  @Input() deckName: string = 'mazo';

  public showImg = false;
  public img = '';
  private exportService  = inject(ExportDeckImageService);

  constructor() {
    addIcons({ downloadOutline });
  }

  openCloseViewer(img: string) {
    this.showImg = !this.showImg;
    (this.showImg) ? this.img = img : this.img = '';
  }

  async exportList() {
  this.showDownloadingToast('Generando imagen...');
  await this.exportService.exportCardList(this.deckName);
  Swal.close();
}

get sortedMainCards(): ExpandedDeckCard[] {
  return [...this.mainCards].sort((a, b) => b.amount - a.amount);
}

get sortedSideCards(): ExpandedDeckCard[] {
  return [...this.sideCards].sort((a, b) => b.amount - a.amount);
}

  private showDownloadingToast(message: string = 'Descargando...'): void {
    Swal.fire({
      toast: true,
      position: 'bottom',
      icon: 'info',
      title: message,
      showConfirmButton: false,
      background: '#2980b9',
      color: '#fff',
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }
}
