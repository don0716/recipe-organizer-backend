const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cuisine: {
      type: String,
      required: true,
    },
    imageLink: {
      type: String,
      required: true,
    },
    ingredients: {
      type: String,
      required: true,
    },
    instructions: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model("Recipe", RecipeSchema);
module.exports = Recipe;
