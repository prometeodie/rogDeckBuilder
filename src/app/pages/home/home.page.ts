import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';

import { UserIdentityComponent } from 'src/app/components/user-identity/user-identity.component';
import { UserIdentityData } from 'src/app/interfaces/user.interface';
import { User } from 'src/app/services/user';

import { DecksComponent } from 'src/app/components/decks/decks.component';
import { Deck } from 'src/app/interfaces/deck.interface';
import { DecksCardsService } from 'src/app/services/decks-cards';
import { addIcons } from 'ionicons';
import { addOutline, cloudUploadOutline, createOutline } from 'ionicons/icons';
import { RogLogoComponent } from "src/app/components/rog-logo/rog-logo.component";
import { NewUploadDeckBtnComponent } from "src/app/components/new-upload-deck-btn/new-upload-deck-btn.component";
import { AnimationComponent } from 'src/app/components/animation/animation.component';
import { AlertController } from '@ionic/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonIcon,
    CommonModule,
    FormsModule,
    RouterModule,
    UserIdentityComponent,
    DecksComponent,
    RogLogoComponent,
    NewUploadDeckBtnComponent,
    AnimationComponent
]
})
export class HomePage implements OnInit {

  private userService = inject(User);
  private decksService = inject(DecksCardsService);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);

  public showUserModal: boolean = false;
  public identity: UserIdentityData | null = null;
  public decks: Deck[] = [];
  public showSplash: boolean = false;

  constructor() {
      addIcons({
        'create-outline': createOutline,
        'cloud-upload-outline': cloudUploadOutline,
        'add-outline': addOutline
      });
    }

  async ngOnInit() {
    this.showSplash = true;
    this.identity = await this.userService.getUserIdentity();

    if (!this.identity) {
      this.showUserModal = true;
    }

    await this.loadDecks();
  }

  ngAfterViewInit() {
  setTimeout(() => {
    this.showSplash = false;
  }, 4000);
}

  async ionViewWillEnter() {
    await this.loadDecks();
  }

  async loadDecks() {
    this.decks = await this.decksService.getDecks();
  }

  async getIdentity() {
    this.identity = await this.userService.getUserIdentity();
  }

  async onIdentitySaved() {
    this.showUserModal = false;
    this.getIdentity();
  }

  async editIdentity() {
    this.showUserModal = true;
    this.getIdentity();
  }

  async createNewDeck() {
  const newDeck = await this.decksService.addDeck();
  this.router.navigate(['/deckbuilder', newDeck.id]);
}

async uploadDeck() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const importedDeck = await this.decksService.saveImportedDeck(parsed);

      // refrescar lista
      this.decks = [...await this.decksService.getDecks()];

      // 🔴 MOSTRAR ALERT DESDE EL COMPONENTE
      await this.showDeckInfo(importedDeck);

    } catch (error) {
      console.error(error);
    }
  };

  input.click();
}
async showDeckInfo(deck: Deck) {
  const creator = deck.creator ?? 'Desconocido';

  const collaboratorsText =
    deck.colaborators && deck.colaborators.length > 0
      ? ` y modificado por <b> ${deck.colaborators.join(', ')}</b>`
      : '';

  await Swal.fire({
    icon: 'info',
    title: 'Información del mazo',
    html: `
      <p style="margin:0">
        Este mazo fue creado por <b>${creator}</b>${collaboratorsText}.
      </p>
    `,
    confirmButtonText: 'OK',
    confirmButtonColor: '#3085d6',

    /* 🔑 fixes Ionic */
    heightAuto: false,
    backdrop: true,
    allowOutsideClick: false,
    allowEscapeKey: false,

    customClass: {
      popup: 'ionic-swal'
    }
  });
}


}
