import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonList, IonItem, IonLabel, IonInput, IonButton
} from '@ionic/angular/standalone';
import { User } from 'src/app/services/user';


@Component({
  selector: 'user-identity',
  templateUrl: './user-identity.component.html',
  styleUrls: ['./user-identity.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonList, IonItem, IonLabel, IonInput, IonButton, CommonModule
  ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserIdentityComponent implements OnInit {

  @Output() closed = new EventEmitter<void>();

  private userService = inject(User);
  form: FormGroup;

  public hasUser: boolean = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      nickname: ['', Validators.required],
    });
  }

  async ngOnInit() {
  const data = await this.userService.getUserData();

  if (data) {
    this.hasUser = true;

    this.form.patchValue({
      name: data.name,
      lastname: data.lastname,
      nickname: data.nickname,
    });
  }
}


  async save() {
    if (this.form.invalid) return;

    await this.userService.saveUserData(this.form.value);
    this.closed.emit();
  }

  closeModal() {
    this.closed.emit();
  }
}


