import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../_models/user';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  baseUrl = environment.apiUrl;

  constructor(private translate: TranslateService, private http: HttpClient, 
    private accountService: AccountService) {
      this.accountService.currentUser$.subscribe(user => {
        if (user) {
          this.setInitialLanguage(user.language);
        }
      });
    }
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

}
