const apiKey = "5756538a49f5440c96d43618a8b32791"; // 🔑 Insert your Spoonacular API key here

const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

// Function to fetch recipes list
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=${apiKey}`);
        const data = await response.json();
        recipeContainer.innerHTML = "";

        if (!data.results || data.results.length === 0) {
            recipeContainer.innerHTML = "<h2>No recipes found</h2>";
            return;
        }

        data.results.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${meal.image}">
                <h3>${meal.title}</h3>
                <p><span>Recipe ID:</span> ${meal.id}</p>
            `;
            const button = document.createElement('button');
            button.textContent = "View Recipe";
            button.addEventListener('click', () => {
                fetchRecipeDetails(meal.id);
            });

            recipeDiv.appendChild(button);
            recipeContainer.appendChild(recipeDiv);
        });
    } catch (error) {
        recipeContainer.innerHTML = "<h2>Error fetching recipes</h2>";
        console.error(error);
    }
};

// Fetch full recipe details using recipe ID
const fetchRecipeDetails = async (id) => {
  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`);
    const meal = await response.json();

    // Format ingredients as bullet list
    const ingredientsList = meal.extendedIngredients
      .map(ing => `<li>${ing.original}</li>`)
      .join('');

    // Format instructions as numbered steps (point-wise)
    let instructionsList = '';
    if (meal.analyzedInstructions.length > 0) {
      const steps = meal.analyzedInstructions[0].steps;
      instructionsList = steps
        .map(step => `<li>${step.step}</li>`)
        .join('');
    } else {
      instructionsList = `<li>${meal.instructions || "Instructions not available."}</li>`;
    }

    // Inject into popup
    recipeDetailsContent.innerHTML = `
      <h2 class="recipeName">${meal.title}</h2>
      <h3>🧾 Ingredients:</h3>
      <ul class="IngredientList">${ingredientsList}</ul>

      <h3>📋 Instructions:</h3>
      <ol class="InstructionList">${instructionsList}</ol>
    `;

    recipeDetailsContent.parentElement.style.display = "block";

  } catch (error) {
    console.error("Error fetching recipe details:", error);
  }
};


// Close recipe popup
recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = "none";
});

// Search button click
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (!searchInput) {
        recipeContainer.innerHTML = `<h2>Type the meal in the search box</h2>`;
        return;
    }
    fetchRecipes(searchInput);
});
