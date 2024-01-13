import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

  setInitialLanguage(language: string): void {
    const defaultLanguage = 'en';
    this.translate.setDefaultLang(defaultLanguage);
    this.translate.use(language);
    this.currentLanguageSubject.next(language);
  }

  initializeTranslation(userLanguage: string): void {
    const defaultLanguage = 'en';
    this.setInitialLanguage(userLanguage || defaultLanguage);
  }

  getTranslation(key: string, value: string): string {
    return this.translate.instant(`${key}.${value}`);
  }
}
