import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
import { environment } from '../environments/environment'
import { getAuth, provideAuth } from '@angular/fire/auth'
import { enableIndexedDbPersistence, getFirestore, provideFirestore } from "@angular/fire/firestore";

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
//import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    //Firebase main import
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    //Firebase authentication import
    provideAuth(() => getAuth()),
    provideFirestore(() => {
      const firestore = getFirestore();
      //Enable offline persistence
      enableIndexedDbPersistence(firestore);
      return firestore;
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    /*ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })*/
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
