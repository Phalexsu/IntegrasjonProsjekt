/**
 * @file oppskrift.js
 * @brief oppskrift.js contains the functions that are used when viewing a single recipe.
 */

/***    DOM ELEMENTS AND GLOBALS   ***/
let recipeEdit = document.querySelector("#edit-recipe-btn");
let editRecipePopup = document.querySelector("#edit-recipe-popup");
let closeEditRecipePopup = document.querySelector("#close-recipe-popup");
let editRecipeDifficulty = document.querySelector("#edit-difficulty");
let displayedRecipe = null;
let deleteRecipeBtn = document.querySelector("#delete-recipe");
let owner = null;

//If edit button is pressed
recipeEdit.addEventListener("click", function () {
    //Check login status
    if(sessionStorage.getItem("loggedIn") !== "true"){
        alert("Du må logge inn for å endre oppskrifter");
        return;
    }
    //Check if recipe is loaded
    if(displayedRecipe === null){
        alert("Kunne ikke finne oppskriften");
        return;
    }
    //Get elements
    let recipeName = document.querySelector("#edit-name");
    let recipeURL = document.querySelector("#edit-url");
    let description = document.querySelector("#edit-description");
    let time = document.querySelector("#edit-time");
    let difficulty = document.querySelector("#edit-difficulty");
    let difficultyText = document.querySelector("#difficulty-value-label");

    let urlDiv = document.querySelector("#url-recipe");
    let manualRecipeDiv = document.querySelector("#manual-recipe");

    //Prefill values from displayed recipe
    recipeName.value = displayedRecipe.name;
    recipeURL.value = displayedRecipe.URL;
    description.value = displayedRecipe.description;
    time.value = displayedRecipe.time;
    difficulty.value = displayedRecipe.difficulty;
    difficultyText.innerHTML = displayedRecipe.difficulty;

    //Clear categories
    let categoryDiv = document.querySelector("#category-checkboxes");
    categoryDiv.innerHTML = "";
    //Add exclusive categories
    let exclusiveCategories = document.createElement("div");
    exclusiveCategories.setAttribute("class", "exclusive-categories");
    for(const ex in Categories.exclusive){
        //Add category name
        let categoryName = document.createElement("h3");
        categoryName.appendChild(document.createTextNode(ex));
        exclusiveCategories.appendChild(categoryName);
        //Add radio buttons
        for (const exclusiveCategoriesKey in Categories.exclusive[ex]) {
            let category = exclusiveCategoriesKey;
            let listItem = document.createElement("li");
            let checkbox = document.createElement("input");
            checkbox.setAttribute("type", "radio");
            checkbox.setAttribute("id", "category_" + category);
            checkbox.setAttribute("name", "category_" + ex);
            checkbox.setAttribute("value", category);
            checkbox.setAttribute("class", "category-checkbox");
            if(displayedRecipe.categories !== null) {
                checkbox.checked = displayedRecipe.categories.includes(category);
            }
            let label = document.createElement("label");
            label.setAttribute("for", "category_" + category);
            label.setAttribute("class", "category-label");
            label.appendChild(document.createTextNode(category));
            listItem.appendChild(checkbox);
            listItem.appendChild(label);
            exclusiveCategories.appendChild(listItem);
        }
    }
    //Add non-exclusive categories
    let nonExclusiveCategories = document.createElement("div");
    nonExclusiveCategories.setAttribute("class", "non-exclusive-categories");
    let nonExclusiveCategoriesName = document.createElement("h3");
    nonExclusiveCategoriesName.textContent = "Øvrige kategorier";
    nonExclusiveCategories.appendChild(nonExclusiveCategoriesName);
    for(let i = 0; i < Categories.categories.length; i++){
        let category = Categories.categories[i];
        let listItem = document.createElement("li");
        let checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", "category_" + category);
        checkbox.setAttribute("name", "category_" + category);
        checkbox.setAttribute("value", category);
        checkbox.setAttribute("class", "category-checkbox");
        if(displayedRecipe.categories !== null) {
            checkbox.checked = displayedRecipe.categories.includes(category);
        }
        let label = document.createElement("label");
        label.setAttribute("for", "category_" + category);
        label.setAttribute("class", "category-label");
        label.appendChild(document.createTextNode(category));
        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        nonExclusiveCategories.appendChild(listItem);
    }
    //Add allergies
    let allergyCategories = document.createElement("div");
    allergyCategories.setAttribute("class", "allergy-categories");
    let allergyCategoriesName = document.createElement("h3");
    allergyCategoriesName.textContent = "Allergier";
    allergyCategories.appendChild(allergyCategoriesName);
    for(let i = 0; i < Categories.allergies.length; i++){
        let category = Categories.allergies[i];
        let listItem = document.createElement("li");
        let checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", "category_" + category);
        checkbox.setAttribute("name", "category_" + category);
        checkbox.setAttribute("value", category);
        checkbox.setAttribute("class", "category-checkbox");
        if(displayedRecipe.categories !== null) {
            checkbox.checked = displayedRecipe.categories.includes(category);
        }
        let label = document.createElement("label");
        label.setAttribute("for", "category_" + category);
        label.setAttribute("class", "category-label");
        label.appendChild(document.createTextNode(category));
        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        allergyCategories.appendChild(listItem);
    }
    categoryDiv.appendChild(exclusiveCategories);
    categoryDiv.appendChild(nonExclusiveCategories);
    categoryDiv.appendChild(allergyCategories);

    //Prefill instructions
    if(displayedRecipe.URL === null || displayedRecipe.URL === "" && displayedRecipe.ingredients !== null  && displayedRecipe.instructions !== null) {
        let instructions = document.querySelector("#edit-instructions-list");
        let addInstructionBtn = document.querySelector("#add-instruction-btn");
        let instruction = document.querySelector("#recipe-instructions");

        addInstructionBtn.addEventListener("click", function (event) {
            event.preventDefault();
            //Check if instruction is filled
            if (instruction.value === "") {
                alert("Fyll ut instruksjon");
                return;
            }
            addInstruction();
        });

        instruction.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                addInstructionBtn.click();
            }
        });


        function addInstruction(){
            //Create list item
            let instructionLi = document.createElement("li");
            let label = document.createElement("label");
            label.innerHTML = instruction.value;
            instructionLi.appendChild(label);
            //create a remove icon for the list item
            let removeItem = document.createElement("a");
            let removeIcon = document.createElement("img");
            removeIcon.setAttribute("src", "../../Images/trashcan.svg");
            removeIcon.setAttribute("alt", "Slett ingrediens");
            removeIcon.setAttribute("class", "close-svg");
            removeIcon.classList.add("remove-item");
            removeItem.appendChild(removeIcon);
            //Add event listener to remove the list item when the icon is clicked
            removeItem.addEventListener("click", function (event) {
                instructions.removeChild(instructionLi);
            });
            instructionLi.appendChild(removeItem);
            instructions.appendChild(instructionLi);
            //Reset input field
            instruction.value = "";
        }
        //Reset instructions
        instructions.innerHTML = "";
        //For each instruction in the displayed recipe, create a list item
        for (let i = 0; i < displayedRecipe.instructions.length; i++) {
            let instruction = document.createElement("li");
            let label = document.createElement("label");
            label.innerHTML = displayedRecipe.instructions[i];
            instruction.appendChild(label);
            //create a checkbox for the list item
            let removeItem = document.createElement("a");
            let removeIcon = document.createElement("img");
            removeIcon.setAttribute("src", "../../Images/trashcan.svg");
            removeIcon.setAttribute("alt", "Slett ingrediens");
            removeIcon.setAttribute("class", "close-svg");
            removeIcon.classList.add("remove-item");
            removeItem.appendChild(removeIcon);
            //Add event listener to remove the list item when the icon is clicked
            removeItem.addEventListener("click", function (event) {
                instructions.removeChild(instruction);
            });
            instruction.appendChild(removeItem);
            instructions.appendChild(instruction);
        }

        let ingredients = document.querySelector("#edit-ingredient-list");
        let addIngredientBtn = document.querySelector("#add-ingredient-btn");
        let ingredientName = document.querySelector("#add-ingredient");
        let ingredientAmount = document.querySelector("#recipe-ingredient-qty");
        //Add event listener to add ingredient button
        addIngredientBtn.addEventListener("click", function (event) {
            event.preventDefault();
            //Check if ingredient name and amount are filled
            if (ingredientName.value === "" || ingredientAmount.value === "") {
                alert("Fyll ut ingrediensnavn og mengde");
                return;
            }
            addIngredient();
        });

        //Add event listener to ingredient name input field
        ingredientName.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                addIngredientBtn.click();
            }
        });

        //Add event listener to ingredient amount input field
        ingredientAmount.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                addIngredientBtn.click();
            }
        });

        function addIngredient(){
            //Create list item
            let ingredient = document.createElement("li");
            let label = document.createElement("label");
            label.innerHTML = ingredientName.value + ": " + ingredientAmount.value;
            ingredient.appendChild(label);
            //create a remove icon for the list item
            let removeItem = document.createElement("a");
            let removeIcon = document.createElement("img");
            removeIcon.setAttribute("src", "../../Images/trashcan.svg");
            removeIcon.setAttribute("alt", "Slett ingrediens");
            removeIcon.setAttribute("class", "close-svg");
            removeIcon.classList.add("remove-item");
            removeItem.appendChild(removeIcon);
            //Add event listener to remove the list item when the icon is clicked
            removeItem.addEventListener("click", function (event) {
                ingredients.removeChild(ingredient);
            });
            ingredient.appendChild(removeItem);
            ingredients.appendChild(ingredient);
            //Reset input fields
            ingredientName.value = "";
            ingredientAmount.value = "";
        }
        //Reset ingredients
        ingredients.innerHTML = "";
        //For each ingredient in the displayed recipe, create a list item
        for (let [key, value] of Object.entries(displayedRecipe.ingredients)) {
            let ingredient = document.createElement("li");
            let label = document.createElement("label");
            label.innerHTML = key + ": " + value;
            ingredient.appendChild(label);
            //create a remove icon for the list item
            let removeItem = document.createElement("a");
            let removeIcon = document.createElement("img");
            removeIcon.setAttribute("src", "../../Images/trashcan.svg");
            removeIcon.setAttribute("alt", "Slett ingrediens");
            removeIcon.setAttribute("class", "close-svg");
            removeIcon.classList.add("remove-item");
            removeItem.appendChild(removeIcon);
            //Add event listener to remove the list item when the icon is clicked
            removeItem.addEventListener("click", function (event) {
                ingredients.removeChild(ingredient);
            });
            ingredient.appendChild(removeItem);
            ingredients.appendChild(ingredient);
        }
        manualRecipeDiv.style.display = "block";
        urlDiv.style.display = "none";

    } else {
        manualRecipeDiv.style.display = "none";
        urlDiv.style.display = "block";
    }

    editRecipePopup.style.display = "block";
});

//Update difficulty text when difficulty slider is moved
editRecipeDifficulty.addEventListener("input", function (event){
    let recipeDifficultyText = document.querySelector("#difficulty-value-label");
    recipeDifficultyText.innerHTML = editRecipeDifficulty.value;
});

//Close edit recipe popup
closeEditRecipePopup.addEventListener("click", function (event) {
    event.preventDefault();
    editRecipePopup.style.display = "none";
});


//Submit changes to recipe
let submitEditRecipeBtn = document.querySelector("#submit-edit-recipe");
submitEditRecipeBtn.addEventListener("click", function(event ) {
    event.preventDefault();
    editRecipe();
});

//Delete recipe
deleteRecipeBtn.addEventListener("click", function (event) {
    event.preventDefault();
    let url = window.location.search;
    //User needs to confirm that they want to delete the recipe
    let confirm = window.confirm("Er du sikker på at du vil slette oppskriften?");
    if(!confirm){
        alert("Oppskrift ble IKKE slettet");
        return;
    }
    // Send delete request to API
    const params = new URLSearchParams(url);
    fetch(API_IP + "/recipe/" + params.get('id'), {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"username": owner})
    }).then(response => {
        if (response.status === 200) {
            alert("Oppskriften ble slettet");
            window.location.href = "../index.html";
        } else {
            alert("Kunne ikke slette oppskriften");
        }
    }).catch(error  => {
        alert("Det skjedde en feil ved sletting av oppskrift");
        console.log("Error when sending HTTPS request");
    });
});

// Load recipe when page is loaded
window.onload = function () {
    //Load recipe
    updateLoginStatus();
    getRecipe();
    getCategories();
};

/***        FUNCTIONS        ***/

/**
 * Gets recipe from API
 * @returns {Promise<void>}
 */
async function getRecipe() {
    let url = window.location.search;
    //Get recipe ID from URL
    const params = new URLSearchParams(url);
    //Get recipe from API
    let response = await fetch(API_IP + "/recipe/"+params.get('id')+"?single=true");
    if (!response.ok) {
        console.log("Error when fetching recipe");
        return;
    }
    let data = await response.json();
    //Display recipe
    displayedRecipe = data;
    displayRecipe(data);
}

/**
 * Checks updated recipe and sends it to the API
 */
function editRecipe() {
    //Get elements
    let recipeName = document.querySelector("#edit-name");
    let recipeURL = document.querySelector("#edit-url");
    let instructionList = document.querySelector("#edit-instructions-list").getElementsByTagName("li");
    let ingredientList = document.querySelector("#edit-ingredient-list").getElementsByTagName("li");
    let description = document.querySelector("#edit-description");
    let time = document.querySelector("#edit-time");
    let difficulty = document.querySelector("#edit-difficulty");

    //Check if all fields are filled
    if(recipeName.value === "" || description.value === "" || time.value === "" || difficulty.value === ""){
        alert("Fyll ut alle feltene");
        return;
    }
    //Get instructions and ingredients
    let instructions = [];
    for (let i = 0; i < instructionList.length; i++) {
        instructions.push(instructionList[i].getElementsByTagName("label")[0].innerHTML);
    }
    let ingredients = {};
    for (let i = 0; i < ingredientList.length; i++) {
        let ingredient = ingredientList[i].getElementsByTagName("label")[0].innerHTML.split(": ");
        ingredients[ingredient[0]] = ingredient[1];
    }
    //Get categories
    let categories = [];
    let categoriesDOM = document.querySelectorAll(".category-checkbox");
    for(let i = 0; i < categoriesDOM.length; i++){
        if(categoriesDOM[i].checked){
            categories.push(categoriesDOM[i].value);
        }
    }
    //Create recipe object
    let recipe = {
        "name": recipeName.value,
        "URL": recipeURL.value,
        "instructions": instructions,
        "ingredients": ingredients,
        "description": description.value,
        "time": parseInt(time.value),
        "difficulty": parseInt(difficulty.value),
        "documentID": displayedRecipe.documentID,
        "image": displayedRecipe.image,
        "categories": categories,
    };
    //Send recipe to API
    fetch(API_IP + "/recipe/" + recipe.documentID, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(recipe)
    }).then(response => {
        if (response.status === 200) {
            alert("Oppskriften ble endret");
            //Reload page
            window.location.reload();
        } else {
            alert("Kunne ikke endre oppskriften");
        }
    }).catch(error => {
        alert("Det skjedde en feil ved endring av oppskrift");
        console.log("Error when sending HTTPS request");
        console.log(error);
    });
}

/**
 * Displays a single recipe
 * @param Recipe - Recipe object to be displayed
 * @returns {Promise<void>}
 */
// Async function to display a recipe
async function displayRecipe(Recipe) {
    // Hide the edit button as default
    recipeEdit.style.display = "none";

    // Check if the user is logged in
    if (sessionStorage.getItem("username") != null && sessionStorage.getItem("loggedIn") === "true") {
        // Get recipes from the API for the logged-in user
        let response = await fetch(API_IP + "/recipe" + "/" + sessionStorage.getItem("username"));

        // If there is an issue with the API request, hide the edit button
        if (response.ok) {
            // Parse the response data
            let data = await response.json();

            // Check if the user is the owner of the displayed recipe
            for (let i = 0; i < data.userRecipes.length; i++) {
                if (data.userRecipes[i].documentID === Recipe.documentID) {
                    recipeEdit.style.display = "inline";
                    // Set the owner variable to the username
                    owner = sessionStorage.getItem("username");
                }
            }
        }
    }

    // Get elements from the DOM
    let name = document.querySelector("#recipe-name");
    let recipeContent = document.querySelector("#recipe-content");
    let recipeImage = document.querySelector("#recipe-image");

    // Clear existing content
    recipeContent.innerHTML = "";
    recipeImage.innerHTML = "";

    // Set the recipe name
    name.innerHTML = Recipe.name;

    // If the recipe is manual (not a link)
    if (Recipe.URL === null || Recipe.URL === "" && Recipe.ingredients !== null && Recipe.instructions !== null) {
        // Create a list of ingredients
        let ingredients = document.createElement("div");
        let header = document.createElement("span");
        header.setAttribute("class", "sub-header");
        header.innerHTML = "Ingredients: ";
        ingredients.appendChild(header);

        let ingredientList = document.createElement("ul");
        ingredientList.setAttribute("id", "ingredientsList");

        // Add each ingredient to the list
        for (let [key, value] of Object.entries(Recipe.ingredients)) {
            let ingredient = document.createElement("li");
            ingredient.innerHTML = key + ": " + value;
            ingredientList.appendChild(ingredient);
        }

        ingredients.appendChild(ingredientList);
        recipeContent.appendChild(ingredients);

        // Create a list of instructions
        header = document.createElement("span");
        header.setAttribute("class", "sub-header");
        header.innerHTML = "Instructions: ";
        recipeContent.appendChild(header);

        let instructions = document.createElement("ol");
        instructions.setAttribute("id", "instructions");

        // Add each instruction to the list
        for (let i = 0; i < Recipe.instructions.length; i++) {
            let instruction = document.createElement("li");
            instruction.innerHTML = Recipe.instructions[i];
            instructions.appendChild(instruction);
        }

        recipeContent.appendChild(instructions);
    } else {
        // Create a link to the recipe
        let link = document.createElement("a");
        link.href = Recipe.URL;
        link.setAttribute("target", "_blank");
        link.setAttribute("id", "recipe-link");
        link.innerHTML = "Link to Recipe";
        recipeContent.appendChild(link);
    }

    // Create a description
    if (Recipe.description !== null && Recipe.description !== "") {
        let description = document.createElement("div");
        description.setAttribute("id", "description");
        let header = document.createElement("span");
        header.setAttribute("class", "sub-header");
        header.innerHTML = "Description: ";
        description.appendChild(header);
        description.appendChild(document.createTextNode(Recipe.description));
        recipeContent.appendChild(description);
    }

    // Create time
    let time = document.createElement("div");
    time.setAttribute("id", "time");
    let header = document.createElement("span");
    header.setAttribute("class", "sub-header");
    header.innerHTML = "Time: ";
    let timeText = document.createTextNode(Recipe.time + " minutes");
    time.appendChild(header);
    time.appendChild(timeText);
    recipeContent.appendChild(time);

    // Create difficulty
    let difficulty = document.createElement("div");
    difficulty.setAttribute("id", "difficulty");
    header = document.createElement("span");
    header.setAttribute("class", "sub-header");
    header.innerHTML = "Difficulty: ";
    difficulty.appendChild(header);
    difficulty.appendChild(document.createTextNode(Recipe.difficulty));
    recipeContent.appendChild(difficulty);

    // Create an image if it exists on the server
    if (Recipe.image !== null && Recipe.image !== "") {
        // Check if the image exists on the server
        checkImageExists("../../" + IMAGEDIR + Recipe.image + ".jpeg", function (exists) {
            if (!exists) {
                return;
            }

            // Create an image element
            let image = document.createElement("img");
            image.src = "../../" + IMAGEDIR + Recipe.image + ".jpeg";
            recipeImage.appendChild(image);
        });
    }

    // Create a category list if categories exist
    if (Recipe.categories !== null) {
        let categories = document.createElement("div");
        categories.setAttribute("id", "categories");
        let header = document.createElement("span");
        header.setAttribute("class", "sub-header");
        header.innerHTML = "Categories: ";
        categories.appendChild(header);

        let categoryList = document.createElement("ul");
        categoryList.setAttribute("id", "categoryList");

        // Add each category to the list
        for (let i = 0; i < Recipe.categories.length; i++) {
            let category = document.createElement("li");
            category.appendChild(document.createTextNode(Recipe.categories[i]));
            categoryList.appendChild(category);
        }

        categories.appendChild(categoryList);
        recipeContent.appendChild(categories);
    }
}