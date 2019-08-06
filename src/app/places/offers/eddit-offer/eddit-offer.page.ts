import { Component, OnInit, OnDestroy } from "@angular/core";
import { Place } from "../../place.model";
import { ActivatedRoute, Router } from "@angular/router";
import { PlacesService } from "../../places.service";
import {
  NavController,
  LoadingController,
  AlertController
} from "@ionic/angular";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-eddit-offer",
  templateUrl: "./eddit-offer.page.html",
  styleUrls: ["./eddit-offer.page.scss"]
})
export class EdditOfferPage implements OnInit, OnDestroy {
  place: Place;
  form: FormGroup;
  private plSub: Subscription;
  isLoading = false;
  placeId: string;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private router: Router,
    private loadCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has("placeId")) {
        this.navCtrl.navigateBack("/places/tabas/offers");
        return;
      }
      this.placeId = paramMap.get("placeId");
      this.isLoading = true;
      this.plSub = this.placesService
        .getPlace(paramMap.get("placeId"))
        .subscribe(
          place => {
            this.place = place;
            this.form = new FormGroup({
              title: new FormControl(this.place.title, {
                updateOn: "blur",
                validators: [Validators.required]
              }),
              description: new FormControl(this.place.description, {
                updateOn: "blur",
                validators: [Validators.required, Validators.maxLength(180)]
              })
            });
            this.isLoading = false;
          },
          error => {
            this.alertCtrl
              .create({
                header: "An error occured!",
                message: "Place could not be found, please try again later",
                buttons: [
                  {
                    text: "Okay",
                    handler: () => {
                      this.router.navigate(["/places/tabs/offers"]);
                    }
                  }
                ]
              })
              .then(alertEl => {
                alertEl.present();
              });
          }
        );
    });
  }
  ngOnDestroy() {
    if (this.plSub) {
      this.plSub.unsubscribe();
    }
  }
  onEdditOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadCtrl
      .create({
        message: "Updating place..."
      })
      .then(loadingEl => {
        loadingEl.present();
        this.placesService
          .updateOffer(
            this.place.id,
            this.form.value.title,
            this.form.value.description
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(["/places/tabs/offers"]);
          });
      });
  }
}
