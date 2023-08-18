import {Injectable} from '@angular/core';
import {FirebaseAuthentication} from '@capacitor-firebase/authentication';
import {Router} from '@angular/router';
import {Auth, signInWithCredential, signOut} from '@angular/fire/auth';
import {GoogleAuthProvider, User} from 'firebase/auth';
import {Capacitor} from '@capacitor/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser: BehaviorSubject<null | User> = new BehaviorSubject<null | User>(null);

  constructor(public auth: Auth, public router: Router) {
    this.auth.onAuthStateChanged(user => this.setCurrentUser(user));
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null && this.currentUser.value !== undefined;
  }

  getProfilePic(): string {
    const placeholder = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png';
    if (!this.isLoggedIn()) {
      return placeholder;
    }
    return this.currentUser.value?.photoURL ? this.currentUser.value.photoURL : placeholder;
  }

  getDisplayName(): string | undefined | null {
    return this.isLoggedIn() ? this.currentUser.value?.displayName : undefined;
  }

  getEmail(): string | undefined | null {
    return this.isLoggedIn() ? this.currentUser.value?.email : undefined;
  }

  getUserUID(): string | undefined {
    return this.currentUser.getValue()?.uid;
  }

  async signOut(): Promise<void> {
    await FirebaseAuthentication.signOut();

    if (Capacitor.isNativePlatform()) {
      await signOut(this.auth);
    }
  }

  async signInWithGoogle(): Promise<void> {
    const {credential: idToken} =
      await FirebaseAuthentication.signInWithGoogle();

    if (Capacitor.isNativePlatform()) {
      const credential = GoogleAuthProvider.credential(idToken?.idToken);
      await signInWithCredential(this.auth, credential);
    }
  }

  private async setCurrentUser(user: User | null): Promise<void> {
    this.currentUser.next(user);
    if (this.currentUser) {
      await this.router.navigate(['/']);
    } else {
      await this.router.navigate(['tabs/account']);
    }
  }
}
