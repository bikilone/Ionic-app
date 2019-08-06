import { Injectable } from "@angular/core";
import { Booking } from "./booking.model";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { take, tap, delay, switchMap, map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

interface BookingData {
  bookedFrom: string;
  bookedTo: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImg: string;
  placeTitle: string;
  userId: string;
}

@Injectable({
  providedIn: "root"
})
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings() {
    return this._bookings.asObservable();
  }
  constructor(private authService: AuthService, private http: HttpClient) {}

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImg: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    let newBoooking: Booking;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error("No user id found");
        }
        newBoooking = new Booking(
          Math.random().toString(),
          placeId,
          userId,
          placeTitle,
          placeImg,
          firstName,
          lastName,
          guestNumber,
          dateFrom,
          dateTo
        );
        return this.http.post<{ name: string }>(
          "https://ionic-app-2b5a7.firebaseio.com/bookings.json",
          {
            ...newBoooking,
            id: null
          }
        );
      }),
      switchMap(resData => {
        generatedId = resData.name;
        return this.bookings;
      }),
      take(1),
      tap(bookings => {
        newBoooking.id = generatedId;
        this._bookings.next(bookings.concat(newBoooking));
      })
    );
    // return this.bookings.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(bookign => {
    //     this._bookings.next(bookign.concat(newBoooking));
    //   })
    // );
  }
  cancelBooking(bookingId: string) {
    return this.http
      .delete(
        `https://ionic-app-2b5a7.firebaseio.com/bookings/${bookingId}.json`
      )
      .pipe(
        switchMap(() => {
          return this.bookings;
        }),
        take(1),
        tap(bookings => {
          this._bookings.next(bookings.filter(b => b.id !== bookingId));
        })
      );
    // return this.bookings.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(bookign => {
    //     this._bookings.next(bookign.filter(book => book.id !== bookingId));
    //   })
    // );
  }

  fetchBookings() {
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error("No user found");
        }
        return this.http.get<{ [key: string]: BookingData }>(
          `https://ionic-app-2b5a7.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${userId}"`
        );
      }),
      map(bookignData => {
        const bookings = [];
        for (const key in bookignData) {
          if (bookignData.hasOwnProperty(key)) {
            const selected = bookignData[key];
            bookings.push(
              new Booking(
                key,
                selected.placeId,
                selected.userId,
                selected.placeTitle,
                selected.placeImg,
                selected.firstName,
                selected.lastName,
                selected.guestNumber,
                new Date(selected.bookedFrom),
                new Date(selected.bookedTo)
              )
            );
          }
        }
        return bookings;
      }),
      tap(bookings => {
        this._bookings.next(bookings);
      })
    );
  }
}
