import { Component, OnInit, OnDestroy } from "@angular/core";

import { Platform } from "@ionic/angular";
import { Plugins, Capacitor } from "@capacitor/core";

import { AuthService } from "./auth/auth.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  private previouAuthState = false;
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }
  ngOnInit() {
    this.authSub = this.authService.userIsAuthenticated.subscribe(
      isAuthenticated => {
        if (!isAuthenticated && this.previouAuthState !== isAuthenticated) {
          this.router.navigateByUrl("/auth");
        }
        this.previouAuthState = isAuthenticated;
      }
    );
  }
  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable("SplashScreen")) {
        Plugins.SplashScreen.hide();
      }
    });
  }
  onLogout() {
    this.authService.logout();
  }
}
