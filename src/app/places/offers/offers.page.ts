import { Component, OnInit, OnDestroy } from "@angular/core";
import { Place } from "../place.model";
import { PlacesService } from "../places.service";
import { IonItemSliding, LoadingController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-offers",
  templateUrl: "./offers.page.html",
  styleUrls: ["./offers.page.scss"]
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[];
  private placesSub: Subscription;
  constructor(
    private plServcie: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.placesSub = this.plServcie.places.subscribe(places => {
      this.offers = places;
    });
  }

  ionViewWillEnter() {
    this.loadingCtrl.create({ message: "Loading..." }).then(loadingEl => {
      loadingEl.present();
      this.plServcie.fetchPlaces().subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }
  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
  onEdit(id: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigateByUrl("/places/tabs/offers/edit/" + id);
  }
}
