import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NavController,
  ModalController,
  ActionSheetController,
  LoadingController,
  AlertController
} from "@ionic/angular";
import { CreateBookingComponent } from "src/app/bookings/create-booking/create-booking.component";
import { Place } from "../../place.model";
import { PlacesService } from "../../places.service";
import { Subscription } from "rxjs";
import { BookingService } from "src/app/bookings/booking.service";
import { AuthService } from "src/app/auth/auth.service";
import { text } from "@angular/core/src/render3";
import { switchMap, take } from "rxjs/operators";

@Component({
  selector: "app-place-detail",
  templateUrl: "./place-detail.page.html",
  styleUrls: ["./place-detail.page.scss"]
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  private plSub: Subscription;
  isLoading = false;
  constructor(
    private router: Router,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private plService: PlacesService,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has("placeId")) {
        this.navCtrl.navigateBack("/places/tabs/discover");
        return;
      }
      this.isLoading = true;
      let userid;
      this.authService.userId
        .pipe(
          take(1),
          switchMap(userId => {
            if (!userId) {
              throw new Error("No user id");
            } else {
              userId = userId;
              return this.plService.getPlace(paramMap.get("placeId"));
            }
          })
        )
        .subscribe(
          place => {
            this.place = place;
            this.isBookable = place.userId !== userid;
            this.isLoading = false;
          },
          err => {
            this.alertCtrl
              .create({
                header: "An error ocurred",
                message: "Please try again later",
                buttons: [
                  {
                    text: "Ok",
                    handler: () => {
                      this.router.navigate(["/places/tabs/discover"]);
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );
    });
  }
  ngOnDestroy() {
    if (this.plSub) {
      this.plSub.unsubscribe();
    }
  }
  onBookPlace() {
    // this.router.navigateByUrl("places/tabs/discover");
    // this.navCtrl.navigateBack("/places/tabs/discover");
    this.actionSheetCtrl
      .create({
        header: "Choose an Action",
        buttons: [
          {
            text: "Select Date",
            handler: () => {
              this.openBookingModal("select");
            }
          },
          {
            text: "Random Date",
            handler: () => {
              this.openBookingModal("random");
            }
          },
          { text: "Cancel", role: "cancel" }
        ]
      })
      .then(actionSheetEl => actionSheetEl.present());
  }
  openBookingModal(mode: "select" | "random") {
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place, selectedMode: mode }
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(result => {
        if (result.role === "confirm") {
          this.loadingCtrl
            .create({
              message: "Booking..."
            })
            .then(loadingEl => {
              loadingEl.present();
              const data = result.data.bookingData;
              this.bookingService
                .addBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imageUrl,
                  data.firstName,
                  data.lastName,
                  data.guestNumber,
                  data.startDate,
                  data.endDate
                )
                .subscribe(() => {
                  loadingEl.dismiss();
                });
            });
        }
      });
  }
}
