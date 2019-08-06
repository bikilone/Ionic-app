import { Component, OnInit, OnDestroy } from "@angular/core";
import { Place } from "../place.model";
import { PlacesService } from "../places.service";
import { SegmentChangeEventDetail } from "@ionic/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { LoadingController } from "@ionic/angular";
import { take } from "rxjs/operators";

@Component({
  selector: "app-discover",
  templateUrl: "./discover.page.html",
  styleUrls: ["./discover.page.scss"]
})
export class DiscoverPage implements OnInit, OnDestroy {
  listedPlaces: Place[];
  places: Place[];
  relavantPlaces: Place[];
  private plSub: Subscription;
  constructor(
    private placesService: PlacesService,
    private authServcie: AuthService,
    private loadCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.plSub = this.placesService.places.subscribe(places => {
      this.places = places;
      this.relavantPlaces = this.places;
      this.listedPlaces = this.relavantPlaces.slice(1);
    });
  }
  ionViewWillEnter() {
    this.loadCtrl.create({ message: "Loading..." }).then(loadingEl => {
      loadingEl.present();
      this.placesService.fetchPlaces().subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }
  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    this.authServcie.userId.pipe(take(1)).subscribe(userId => {
      if (event.detail.value === "all") {
        this.relavantPlaces = this.places;
        this.listedPlaces = this.relavantPlaces.slice(1);
      } else {
        this.relavantPlaces = this.listedPlaces.filter(
          place => place.userId !== userId
        );
      }
    });
  }
  ngOnDestroy() {
    if (this.plSub) {
      this.plSub.unsubscribe();
    }
  }
}
