
const searchedElementInput = document.getElementById("elementSearched")
searchedElementInput.addEventListener("input", searchBarInput)

function searchBarInput(){
    
    let searchString = stringLoweredCaseWithoutAccent(searchedElementInput.value)
    let searchedElementsBar = []
    if (searchString.length > 2){
        searchedElementsBar = searchString.split(" ");
        searchBar(searchedElementsBar)
    }else{
        searchedElementsBar =[];
        searchBar(searchedElementsBar)
    }
}

function stringLoweredCaseWithoutAccent(string){
    return string.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
}

function getRecipeNameDescriptionIngredientsString(recipe){

    let recipeNameString = stringLoweredCaseWithoutAccent(recipe.name)
    let recipeDescriptionString = stringLoweredCaseWithoutAccent(recipe.description)
    let recipeIngredientsArray = []
    recipe.ingredients.forEach(i => {
        recipeIngredientsArray.push(stringLoweredCaseWithoutAccent(i.ingredient))
    })
    const recipeIngredientString = recipeIngredientsArray.toString();
    return recipeNameString + " " + recipeDescriptionString + " " + recipeIngredientString;
}

function searchBar(searchedElementsBar){
    matchingRecipes = []
    recipes.forEach(recipe => {
        let recipeNameDescriptionIngredientsString = getRecipeNameDescriptionIngredientsString(recipe)
        let recipeIsMatching = searchedElementsBar.every(element => recipeNameDescriptionIngredientsString.includes(element))
        if(recipeIsMatching === true){
            matchingRecipes.push(recipe)
        }
    })

    recipesDisplay(matchingRecipes)
}

const searchTagDom = document.getElementById("tagSearch")

searchTagDom.addEventListener("focusin", e => console.log(e.target.id))


function recipesDisplay(recipes){

    const recipesSection = document.getElementById("recipes");
    
    let html = ""

    recipes.forEach(recipe =>{
        
        let ingredientHtml = ""

        recipe.ingredients.forEach(i => {
            if("quantity" in i === false){
                ingredientHtml +=`
            <p>${i.ingredient}</p>
            `
            }else if("unit" in i === false){
                ingredientHtml +=`
            <p>${i.ingredient}: ${i.quantity}</p>
            `                  
            }else{
                ingredientHtml += `
                <p>${i.ingredient}: ${i.quantity} ${i.unit}</p>
                `  
            } 
        })

        html += `
            <div class="recipe-card">
                <div class="photo-holder"></div>
                <div class="recipe-text">
                    <div class="recipe-header">
                        <h2>${recipe.name}</h2>
                        <p class="recipe-time"><i class="fa-regular fa-clock"></i>${recipe.time} min</p>
                    </div>

                    <div class="recipe-main-text">
                        <div class="ingredients-list">${ingredientHtml}</div>
                        <p class="recipe-description">${recipe.description}</p>
                    </div>

                    
                </div>

            </div>
        `
    })

    recipesSection.innerHTML = html

}

recipesDisplay(recipes)