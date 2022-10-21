
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
    getTags(matchingRecipes)
    tagDisplay()
}

function removingDouble(listOfTags){
    return listOfTags.filter((tag, index) => listOfTags.indexOf(tag) === index);
}

let matchingRecipes = []
let generalListOfTags = {}

function getTags(matchingRecipes){
    let ingredientsTagsListWithDouble = []
    let applianceTagsListWithDouble = []
    let ustensilsTagsListWithDouble = []
    matchingRecipes.forEach(recipe =>{
        recipe.ingredients.forEach(i => ingredientsTagsListWithDouble.push(i.ingredient.toLowerCase()))
        applianceTagsListWithDouble.push(recipe.appliance.toLowerCase())
        recipe.ustensils.forEach(ustensil => ustensilsTagsListWithDouble.push(ustensil.toLowerCase()))
    })
    let ingredientsTagsList = removingDouble(ingredientsTagsListWithDouble)
    let applianceTagsList = removingDouble(applianceTagsListWithDouble)
    let ustensilsTagsList = removingDouble(ustensilsTagsListWithDouble)

    generalListOfTags = {
        "ingredients":ingredientsTagsList,
        "appliance":applianceTagsList,
        "ustensils":ustensilsTagsList
    }

}

const searchTagDom = document.getElementById("tagSearch")
const searchByTagOptionsDOM = document.getElementsByClassName("tags-display");
let tagField = ""
let currentTagFieldDOM = ""
let othersTagFieldDOM = ""

searchTagDom.addEventListener("focusin", e => selectTagsField(e))

function selectTagsField(e){
    tagField = e.target.id
    currentTagFieldDOM = document.getElementById(`${tagField}-display`)
    othersTagFieldDOM = Array.from(searchByTagOptionsDOM).filter(e => e !== currentTagFieldDOM)
    tagDisplay()
}

function tagDisplay(){
 
    let currentListofTags = generalListOfTags[tagField]
    let html = ""
    currentListofTags.forEach(tag => html += `<p class="tagListElements" id="${tag}">${tag}</p>`)
    currentTagFieldDOM.innerHTML = html
    othersTagFieldDOM.forEach(e => e.innerHTML = "")   
}

searchTagDom.addEventListener("click", event => tagSelection(event))

const tagsSelected = []

function tagSelection(event){
    let tagSelected = event.target.closest("p").id
    tagsSelected.push(tagSelected)
    tagsSelectedDisplay()
    trimRecipesByTag()
}

function tagsSelectedDisplay(){
    const tagsSelectedDOM = document.getElementById("tags-selected")
    console.log(tagsSelected)
    let html=""

    tagsSelected.forEach(function(tag, index) {
        html += `<div class="tagSelected"><p>${tag}</p><i class="fa-solid fa-xmark" onclick="removeTag('${index}')"></i></div>`
    })

    tagsSelectedDOM.innerHTML = html


}

function removeTag(index){
    
    tagsSelected.splice(index, 1)
    tagsSelectedDisplay()
    search()
}

function trimRecipesByTag(){
    console.log(matchingRecipes)
}

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

function init(){
    recipesDisplay(recipes)
    matchingRecipes = recipes
    getTags(matchingRecipes)
}


init()