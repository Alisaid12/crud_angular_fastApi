import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'crudangular-fff9b',
        apiKey: 'AIzaSyC_ieKgguO1G_N10RP17WZZD6R7w6MoXk0',
        authDomain: 'crudangular-fff9b.firebaseapp.com',
        storageBucket: 'crudangular-fff9b.firebasestorage.app',
        messagingSenderId: '365838584843',
        appId: '1:365838584843:web:6ad1e4732a284b76870b0e',
        measurementId: 'G-6R430KC463',
      })
    ),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    provideHttpClient(),
  ],
};
