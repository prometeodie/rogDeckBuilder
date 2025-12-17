import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { IonFab, IonFabButton, IonFabList, IonIcon, IonBackdrop } from '@ionic/angular/standalone';


@Component({
  selector: 'new-upload-deck-btn',
  standalone: true,
  templateUrl: './new-upload-deck-btn.component.html',
  styleUrls: ['./new-upload-deck-btn.component.scss'],
  imports: [
    IonFab,
    IonFabButton,
    IonFabList,
    IonIcon,
    IonBackdrop
  ]
})
export class NewUploadDeckBtnComponent {

  @Output() newDeck = new EventEmitter<void>();
  @Output() uploadDeck = new EventEmitter<void>();

  isOpen = false;

  toggleFab() {
    this.isOpen = !this.isOpen;
  }

  closeFab() {
    this.isOpen = false;
  }

  createNewDeck() {
    this.newDeck.emit();
  }

  upload() {
    this.uploadDeck.emit();
  }
}


