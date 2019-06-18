import { Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class RecipesService {
  recipesChanged = new Subject<Recipe[]>();
  recipes: Recipe[] = [
    {
      id: "0",
      title: "Schnitzel",
      imageUrl:
        "http://lovethatbite.com/wp-content/uploads/2018/10/wiener-schnitzel-kalb-veal-meat-cranberry-lemon-chives-potato-salad-salad-wiener-austrian-food-dish-original-recipe.jpeg",
      ingredients: ["French Fries", "Pork Meat", "Salad"]
    },
    {
      id: "1",
      title: "Spaghetti",
      imageUrl:
        "https://www.recepti.com/images/stories/kuvar/glavna-jela/02401-spageti-sa-piletinom.jpg",
      ingredients: ["Spaghetti", "Meat", "Tomatoes"]
    }
  ];
  constructor() {}
  getAllRecipes() {
    return this.recipes.slice();
  }
  getRecipe(id: number) {
    return this.recipes.find(el => +el.id === id);
  }
  deleteRecipe(id: number) {
    // this.recipes.splice(id, 1);

    this.recipes = this.recipes.filter(el => +el.id !== id);
    console.log(this.recipes);
    this.recipesChanged.next(this.recipes);
  }
}
