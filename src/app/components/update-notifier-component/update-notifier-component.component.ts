import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'update-notifier-component',
  standalone: true,
  imports: [CommonModule, IonButton],
  templateUrl: './update-notifier-component.component.html',
  styleUrls: ['./update-notifier-component.component.scss'],
})
export class NotesUpdateOverlayComponent {

  @Input() imageSrc!: string;
  @Input() notesId!: string;

  @Output() closed = new EventEmitter<void>();

  confirm(): void {
    localStorage.setItem('notesId', this.notesId);
    this.closed.emit();
  }
}
