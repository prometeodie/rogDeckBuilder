import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { UserIdentityData } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class User {

  private STORAGE_KEY = 'user_identity';

  async saveUserData(data: UserIdentityData): Promise<void> {
    await Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(data),
    });
  }

  async getUserData(): Promise<UserIdentityData | null> {
    const { value } = await Preferences.get({ key: this.STORAGE_KEY });

    return value ? JSON.parse(value) : null;
  }

  async clearUserData(): Promise<void> {
    await Preferences.remove({ key: this.STORAGE_KEY });
  }

  async getUserIdentity() {
  const { value } = await Preferences.get({ key: 'user_identity' });
  return value ? JSON.parse(value) : null;
}


}
