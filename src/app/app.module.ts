import { EgresosAnualesPage } from './../pages/egresos-anuales/egresos-anuales';
import { EgresosPage } from './../pages/egresos/egresos';
import { IncomesPage } from './../pages/incomes/incomes';
import { NativeStorage } from '@ionic-native/native-storage';

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { AhorroPage } from '../pages/ahorro/ahorro';
import { OtrosEgresosPage } from '../pages/otros-egresos/otros-egresos';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { FcmProvider } from '../providers/fcm/fcm';
import {Firebase} from '@ionic-native/firebase';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    IncomesPage,
    AhorroPage,
    EgresosPage,
    EgresosAnualesPage,
    OtrosEgresosPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      monthNames:  ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',' Junio','Julio','Agosto', 'Septiembre','Octubre','Noviembre','Diciembre']
    }),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireMessagingModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    IncomesPage,
    AhorroPage,
    EgresosPage,
    EgresosAnualesPage,
    OtrosEgresosPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FcmProvider,
    Firebase
  ]
})
export class AppModule {}
