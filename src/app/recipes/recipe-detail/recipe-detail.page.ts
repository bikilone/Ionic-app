import { Component, OnInit } from "@angular/core";
import { RecipesService } from "../recipes.service";
import { Recipe } from "../recipe.model";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-recipe-detail",
  templateUrl: "./recipe-detail.page.html",
  styleUrls: ["./recipe-detail.page.scss"]
})
export class RecipeDetailPage implements OnInit {
  recipe: Recipe;
  recipeId: number;

  constructor(
    private recipeService: RecipesService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.activeRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("recipeId")) {
        // redirect
        this.router.navigate(["/recipes"]);
        return;
      }
      this.recipeId = +paramMap.get("recipeId");
      this.recipe = this.recipeService.getRecipe(this.recipeId);
    });
  }
  onDeleteRecipe() {
    this.alertCtrl
      .create({
        header: "Are you sure?",
        message: "Do you really want to delete the recipe?",
        buttons: [
          {
            text: "Cancel",
            role: "cancel"
          },
          {
            text: "Delete",
            handler: () => {
              this.recipeService.deleteRecipe(this.recipeId);
              this.router.navigate(["/recipes"]);
            }
          }
        ]
      })
      .then(alertEl => alertEl.present());
  }
}
