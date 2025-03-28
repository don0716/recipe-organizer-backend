const express = require("express");
const app = express();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

const { initializeDatabase } = require("./db/db.connect");
initializeDatabase();

const Recipe = require("./models/recipe.model");

const createRecipe = async (newRecipe) => {
  try {
    const recipe = new Recipe(newRecipe);
    const saveRecipe = await recipe.save();
    console.log("New Recipe Added:: ", saveRecipe);
    return saveRecipe;
  } catch (error) {
    console.log("There was an Error.", error);
  }
};
app.post("/recipes", async (req, res) => {
  try {
    const savedRecipe = await createRecipe(req.body);
    if (savedRecipe) {
      res
        .status(201)
        .json({ message: "Recipe Added Successfully.", recipe: savedRecipe });
    } else {
      res.status(401).json({ error: "There was an error adding Recipe." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Add Recipe. " });
  }
});

const readAllRecipes = async () => {
  try {
    const recipes = await Recipe.find();
    return recipes;
  } catch (error) {
    console.log(error);
  }
};
app.get("/recipes", async (req, res) => {
  try {
    const recipes = await readAllRecipes();

    if (recipes.length != 0) {
      res.json(recipes);
    } else {
      res.status(401).json({ error: "No Recipes Found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Recipes Data." });
  }
});

const readById = async (recipeId) => {
  try {
    const recipe = await Recipe.findById(recipeId);
    return recipe;
  } catch (error) {
    console.log(error);
  }
};
app.get("/recipes/recipebyid/:recipeId", async (req, res) => {
  try {
    const recipe = await readById(req.params.recipeId);
    if (recipe) {
      res.status(201).json({ message: "Found Recipe", recipeDetails: recipe });
    } else {
      res.status(401).json({ error: "No Recipies Found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Recipe." });
  }
});

const recipeDelete = async (recipeId) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    return deletedRecipe;
  } catch (error) {
    console.log(error);
  }
};
app.delete("/recipes/:recipeId", async (req, res) => {
  try {
    const deletedRecipe = await recipeDelete(req.params.recipeId);
    if (deletedRecipe) {
      res.status(201).json({
        message: "Successfully Deleted Recipe.",
        recipe: deletedRecipe,
      });
    } else {
      res.status(401).json({ error: "Failed to Delete Recipe" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Recipe." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is running on, ", PORT);
});
