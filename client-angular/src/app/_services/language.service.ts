import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(private translate: TranslateService) {}

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  setCurrentLanguage(language: string): void {
    this.translate.use(language);
    this.currentLanguageSubject.next(language);
  }

  setInitialLanguage(user: User | null): void {
    const defaultLanguage = 'en';
    const userLanguage = user?.language || defaultLanguage;
    this.translate.setDefaultLang(defaultLanguage);
    this.translate.use(userLanguage);
    this.currentLanguageSubject.next(userLanguage);
  }

  initializeTranslation(user: User | null): void {
    this.setInitialLanguage(user);
  }
}
