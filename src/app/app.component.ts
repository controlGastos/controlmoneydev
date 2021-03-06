import { NotificationsSettingsPage } from './../pages/notifications-settings/notifications-settings';
import { OtrosEgresosPage } from './../pages/otros-egresos/otros-egresos';
import { EgresosAnualesPage } from './../pages/egresos-anuales/egresos-anuales';
import { EgresosPage } from './../pages/egresos/egresos';
import { FormGroup } from '@angular/forms';
import { LoginPage } from './../pages/login/login';
import { HomePage } from './../pages/home/home';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { IncomesPage } from '../pages/incomes/incomes';
import { AhorroPage } from '../pages/ahorro/ahorro';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = LoginPage;
  pages: Array<{title: string, component: any,icon:string}>;
  constructor(private afAuth: AngularFireAuth,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    this.pages = [
      { title: 'Home', component: HomePage, icon:"home" },
      { title: 'Ingresos', component:IncomesPage,icon:"logo-usd"  },
      { title: 'Ahorro', component:AhorroPage,icon:"filing"  },
      { title: 'Egresos', component:EgresosPage,icon:"trending-down"  },
      { title: 'Egresos Anuales', component:EgresosAnualesPage,icon:"card"  },      
      { title: 'Otros Egresos', component:OtrosEgresosPage,icon:"medkit"  },    
      { title: 'Notificaciones', component:NotificationsSettingsPage,icon:"notifications"  }
      
    ];

    platform.ready().then(() => {

      this.afAuth.authState.subscribe(user => {

        if(user !== null){
          this.rootPage = HomePage;
        }
      });

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logOut(){
    this.afAuth.auth.signOut().then(()=>{
      this.nav.setRoot(LoginPage);
    })
  }
}

