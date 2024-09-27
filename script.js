const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");

//Function to get recipes
const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
  try {
    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const response = await data.json();
    // Debugging the API response
    console.log("API response:", response);

    // Check if meals are returned
    if (response.meals === null) {
      recipeContainer.innerHTML = "<h2>No recipes found.</h2>";
      return;
    }

    recipeContainer.innerHTML = "";

    response.meals.forEach((meal) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");
      recipeDiv.innerHTML = `
    <img src="${meal.strMealThumb}">
    <h3>${meal.strMeal}</h3>;
    <p><span>${meal.strArea} Dish </span></p>;
    <p> Beloangs to <span>${meal.strCategory}</span> Category</p>`;
      const button = document.createElement("button");
      button.textContent = "View Recipe";
      recipeDiv.appendChild(button);

      // Adding Eventlistener to recipe
      button.addEventListener("click", () => {
        openRecipePopup(meal);
      });
      recipeContainer.appendChild(recipeDiv);
    });
  } catch (error) {
    recipeContainer.innerHTML = "<h2>Error in Fetching Recipes...</h2>";
  }
};

// Function to fetch ingredients properly
const fetchIngredients = (meal) => {
  let ingredientsList = "";

  // Log the whole meal object for debugging purposes
  console.log("Meal data for debugging:", meal);

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    // Debugging each ingredient and measure
    console.log(`Ingredient ${i}:`, ingredient, `Measure ${i}:`, measure);

    // Check that ingredient is not null, empty, or undefined
    if (ingredient && ingredient.trim() !== "") {
      ingredientsList += `<li>${measure ? measure : ""} ${ingredient}</li>`;
    }
  }

  // Return the full list of ingredients
  return ingredientsList;
};

// Function to open the recipe popup and display ingredients and instructions
const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientList">${fetchIngredients(meal)}</ul>
    <div class="recipeInstructions">
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
    </div>
  `;
  recipeDetailsContent.parentElement.style.display = "block";
};

// Close button logic
recipeCloseBtn.addEventListener("click", () => {
  recipeDetailsContent.parentElement.style.display = "none";
});

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (!searchInput) {
    recipeContainer.innerHTML = `<h2>Type the meal in the search box.</h2>`;
    return;
  }
  fetchRecipes(searchInput);
  //   console.log("Button Click");
});
