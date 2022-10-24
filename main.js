let matchingRecipes = recipes
let matchingIds = []

function init(){
    recipesDisplay(matchingRecipes)
}

function update(){
    filterRecipes()
    tagsDisplay()
    recipesDisplay(matchingRecipes)
}

function filterRecipes(){
    matchingRecipes = recipes.filter(recipe => matchingIds.includes(recipe.id))
}

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
    matchingIds = []
    recipes.forEach(recipe => {
        let recipeNameDescriptionIngredientsString = getRecipeNameDescriptionIngredientsString(recipe)
        let recipeIsMatching = searchedElementsBar.every(element => recipeNameDescriptionIngredientsString.includes(element))
        if(recipeIsMatching === true){
            matchingIds.push(recipe.id)
        }
    })
    update()
}

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

    function removingDouble(listOfTags){
        return listOfTags.filter((tag, index) => listOfTags.indexOf(tag) === index);
    }

    let ingredientsTagsList = removingDouble(ingredientsTagsListWithDouble)
    let applianceTagsList = removingDouble(applianceTagsListWithDouble)
    let ustensilsTagsList = removingDouble(ustensilsTagsListWithDouble)

    generalListOfTags = {
        "ingredients":ingredientsTagsList,
        "appliances":applianceTagsList,
        "ustensils":ustensilsTagsList
    }
}

const ingredientsTagsDisplay = document.getElementById("ingredients-display")
const appliancesTagsDisplay = document.getElementById("appliances-display")
const ustensilsTagsDisplay = document.getElementById("ustensils-display")


function tagsDisplay(){
    getTags(matchingRecipes)
    let ingredientsHtml = ""
    generalListOfTags.ingredients.forEach(ingredient => 
        ingredientsHtml += `<p class="tagListElements" id="${ingredient}" onclick="selectTag(id)">${ingredient}</p>`
        )

    if (tagsFieldOpened.ingredients === true){
        ingredientsTagsDisplay.innerHTML = ingredientsHtml
    }else{
        ingredientsTagsDisplay.innerHTML = ""
    }

    let appliancesHtml = ""
    generalListOfTags.appliances.forEach(appliance => 
        appliancesHtml += `<p class="tagListElements" id="${appliance}" onclick="selectTag(id)">${appliance}</p>`
        )

    if (tagsFieldOpened.appliances === true){
        appliancesTagsDisplay.innerHTML = appliancesHtml
    }else{
        appliancesTagsDisplay.innerHTML = ""
    }
    let ustensilsHtml = ""
    generalListOfTags.ustensils.forEach(ustensil => 
        ustensilsHtml += `<p class="tagListElements" id="${ustensil}" onclick="selectTag(id)">${ustensil}</p>`
        )
    
    if (tagsFieldOpened.ustensils === true){
        ustensilsTagsDisplay.innerHTML = ustensilsHtml
    }else{
        ustensilsTagsDisplay.innerHTML = ""
    }
}

const searchTagDom = document.getElementById("tagSearch")

searchTagDom.addEventListener("focusin", e => openTagsField(e))

let tagsFieldOpened = {
    "ingredients":false,
    "appliances":false,
    "ustensils":false
}


function openTagsField(e){
    tagsFieldOpened = {
        "ingredients":false,
        "appliances":false,
        "ustensils":false
    }
    tagField = e.target.id;
    tagsFieldOpened[tagField] = true
    tagsDisplay()
}



function selectTag(tag){
    console.log(tag)
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

init()


/*

données de départ => recipes

données à afficher => matchingRecipes

fonction filterRecipes:

je récupère l'id de matchingRecipes et filter les recipes grace à cela
j'actualise recipesDisplay

fonction searchBar:

get the input of the search bar
see if it match description, name or ingredients list
if it match add the recipe.id in matchingIds

fonction tags:
select the tags based on the current matchingRecipes

fonction tagsDisplay:
on focusin => display the tags of the current tagsfield




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
let tagField = "ingredients"
let currentTagFieldDOM = document.getElementById(`${tagField}-display`)
let othersTagFieldDOM = Array.from(searchByTagOptionsDOM).filter(e => e !== currentTagFieldDOM)

searchTagDom.addEventListener("focusin", e => selectTagsField(e))

function selectTagsField(e){
    tagField = e.target.id
    currentTagFieldDOM = document.getElementById(`${tagField}-display`)
    othersTagFieldDOM = Array.from(searchByTagOptionsDOM).filter(e => e !== currentTagFieldDOM)
    tagDisplay()
}

function tagDisplay(){
 
    let currentListOfTags = generalListOfTags[tagField]
    console.log(currentListOfTags)
    let html = ""
    currentListOfTags.forEach(tag => html += `<p class="tagListElements" id="${tag}">${tag}</p>`)
    currentTagFieldDOM.innerHTML = html
    othersTagFieldDOM.forEach(e => e.innerHTML = "")   
}

searchTagDom.addEventListener("click", event => tagSelection(event))

let tagsSelected = []

function tagSelection(event){
    console.log(event)
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
}

function getRecipeIngredientsApplianceUstensilsString(recipe){
    console.log(matchingRecipes)
    console.log(recipe.appliance)

    let recipeApplianceString = stringLoweredCaseWithoutAccent(recipe.appliance)
    let recipeUstensilsArray = []
    recipe.ustensils.forEach(u => {
        recipeUstensilsArray.push(stringLoweredCaseWithoutAccent(u))
    })
    const recipeUstensilsString = recipeUstensilsArray.toString();
    let recipeIngredientsArray = []
    recipe.ingredients.forEach(i => {
        recipeIngredientsArray.push(stringLoweredCaseWithoutAccent(i.ingredient))
    })
    const recipeIngredientString = recipeIngredientsArray.toString();
    return recipeApplianceString + " " + recipeUstensilsString + " " + recipeIngredientString;
}

function trimRecipesByTag(){

    recipes.forEach(recipe => {
        let recipeIngredientsApplianceUstensilsString = getRecipeIngredientsApplianceUstensilsString(recipe)
        let recipeIsMatching = tagsSelected.every(element => recipeIngredientsApplianceUstensilsString.includes(element))
        if(recipeIsMatching === true){
            matchingRecipes.push(recipe)
        }
    })
    recipesDisplay(matchingRecipes)
    getTags(matchingRecipes)
    tagDisplay()
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

*/