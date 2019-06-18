import { Component, OnInit, OnDestroy } from "@angular/core";
import { Recipe } from "./recipe.model";
import { RecipesService } from "./recipes.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-recipes",
  templateUrl: "./recipes.page.html",
  styleUrls: ["./recipes.page.scss"]
})
export class RecipesPage implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;
  constructor(private recipesService: RecipesService) {}

  ngOnInit() {
    // this.recipes = this.recipesService.getAllRecipes();
    // this.subscription = this.recipesService.recipesChanged.subscribe(
    //   recipes => (this.recipes = recipes)
    // );
  }
  ionViewWillEnter() {
    this.recipes = this.recipesService.getAllRecipes();
    console.log("ionViewWillEnter");
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter");
  }
  ionViewWillLeave() {
    console.log("ionViewWillLeave");
  }
  ionViewDidLeave() {
    console.log("ionViewDidLeave");
  }
  ngOnDestroy() {
    // this.subscription.unsubscribe();
    console.log("ngOnDestroy");
  }
}
