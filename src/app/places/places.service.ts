import { Injectable } from "@angular/core";
import { Place } from "./place.model";
import { AuthService } from "../auth/auth.service";
import { BehaviorSubject, of } from "rxjs";
import { take, map, tap, delay, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

// [ new Place(
//   "p1",
//   "Manahtan",
//   "in the hart of new york",
//   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx0T_82GbKD7BakV_z7BZL5DTzLR1OmyWCVtud9VWDEO5CnBDZYw",
//   123.99,
//   new Date("2019-01-01"),
//   new Date("2019-12-01"),
//   "abc"
// ),
// new Place(
//   "p2",
//   "Amour Toujorus",
//   "A romantic place in Paris",
//   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-z14rOyb-eRgpLyd-OToeseF2I5w97X18OOZ3i7GgimjAfaMh",
//   143.99,
//   new Date("2019-01-01"),
//   new Date("2019-12-01"),
//   "abc"
// ),
// new Place(
//   "p3",
//   "The Foggy Palace",
//   "Not your average city trip!",
//   "https://upload.wikimedia.org/wikipedia/commons/1/1e/San_Francisco_from_the_Marin_Headlands_in_March_2019.jpg",
//   99.99,
//   new Date("2019-01-01"),
//   new Date("2019-12-01"),
//   "abc"
// )]

@Injectable({
  providedIn: "root"
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(
        "https://ionic-app-2b5a7.firebaseio.com/offered-places/" + id + ".json"
      )
      .pipe(
        map(placeData => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId
          );
        })
      );
  }

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        "https://ionic-app-2b5a7.firebaseio.com/offered-places.json"
      )
      .pipe(
        map(res => {
          const places = [];
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              const currentObj = res[key];
              places.push(
                new Place(
                  key,
                  currentObj.title,
                  currentObj.description,
                  currentObj.imageUrl,
                  currentObj.price,
                  new Date(currentObj.availableFrom),
                  new Date(currentObj.availableTo),
                  currentObj.userId
                )
              );
            }
          }
          return places;
        }),
        tap(places => {
          this._places.next(places);
        })
      );
  }
  constructor(private authService: AuthService, private http: HttpClient) {}

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId = "";
    let newPlace: Place;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error("User not found");
        }
        newPlace = new Place(
          Math.random().toString(),
          title,
          description,
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-z14rOyb-eRgpLyd-OToeseF2I5w97X18OOZ3i7GgimjAfaMh",
          price,
          dateFrom,
          dateTo,
          userId
        );
        return this.http.post<{ name: string }>(
          "https://ionic-app-2b5a7.firebaseio.com/offered-places.json",
          {
            ...newPlace,
            id: null
          }
        );
      }),
      switchMap(resData => {
        generatedId = resData.name;
        return this.places;
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );

    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(places => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  updateOffer(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        return this.http.put(
          "https://ionic-app-2b5a7.firebaseio.com/offered-places/" +
            placeId +
            ".json",
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
