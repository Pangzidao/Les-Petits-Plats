let matchingRecipes = recipes
let generalListOfTags = {}
let tagsSelected = []
let tagsFieldOpened = {}

const ingredientsTagsDisplay = document.getElementById("ingredients-display")
const appliancesTagsDisplay = document.getElementById("appliances-display")
const ustensilsTagsDisplay = document.getElementById("ustensils-display")
const searchTagDom = document.getElementById("tagSearch")

function stringLoweredCaseWithoutAccent(string){
    return string.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
}

function init(){
    recipesDisplay(recipes)
    getTags(recipes)
}

function update(){
    recipesDisplay(matchingRecipes)
    getTags(matchingRecipes)
    tagsDisplay()
}

const searchedElementInput = document.getElementById("elementSearched")

searchedElementInput.addEventListener("input", searchBarInput)

function searchBarInput(){
    let searchedElementsBar = []
    let searchString = stringLoweredCaseWithoutAccent(searchedElementInput.value)
    if (searchString.length > 2){
        searchedElementsBar = searchString.split(" ");
        searchBar(searchedElementsBar)
    }else{
        searchedElementsBar =[];
        searchBar(searchedElementsBar)
    }
}

function getRecipeNameIngredientsDescriptionString(recipe){
    let recipeIngredientsArray = []
    recipe.ingredients.forEach(i => {
        recipeIngredientsArray.push(i.ingredient)
    })
    const recipeIngredientString = recipeIngredientsArray.toString();
    return stringLoweredCaseWithoutAccent(recipe.name + " " + recipe.description + " " + recipeIngredientString)
}

function searchBar(searchedElementsBar){
    searchBarMatchingIds = []
    recipes.forEach(recipe => {
        let elementsSearched = getRecipeNameIngredientsDescriptionString(recipe)
        let recipeIsMatching = searchedElementsBar.every(element => elementsSearched.includes(element))
        if(recipeIsMatching === true){
            searchBarMatchingIds.push(recipe.id)
        }
    })

    matchingIds()

}


function filterByTag(){
    filterByTagMatchingIds = []
    let tags = []
    tagsSelected.forEach(tag => tags.push(stringLoweredCaseWithoutAccent(tag.tag)))
    recipes.forEach(recipe => {
        let elementsSearched = getRecipeIngredientsApplianceUstensilsString(recipe)
        let recipeIsMatching = tags.every((tag) => elementsSearched.includes(tag))
        if(recipeIsMatching === true){
            filterByTagMatchingIds.push(recipe.id)
        }

    })

    matchingIds()
}

let searchBarMatchingIds = []

recipes.forEach(recipe => searchBarMatchingIds.push(recipe.id))

let filterByTagMatchingIds = []
recipes.forEach(recipe => filterByTagMatchingIds.push(recipe.id))


function matchingIds(){
    let allIds = []
    let matchingIds = []
    recipes.forEach(recipe => allIds.push(recipe.id))
    allIds.forEach(id => {
        if (searchBarMatchingIds.includes(id) && filterByTagMatchingIds.includes(id)){
            matchingIds.push(id)
        }
    })
    filterRecipes(matchingIds)
}

function filterRecipes(ids){
    matchingRecipes = recipes.filter(recipe => ids.includes(recipe.id))
    update()
}

function getTags(matchingRecipes){
    let ingredientsTagsListWithDouble = []
    let applianceTagsListWithDouble = []
    let ustensilsTagsListWithDouble = []
    matchingRecipes.forEach(recipe =>{
        recipe.ingredients.forEach(i => ingredientsTagsListWithDouble.push(i.ingredient))
        applianceTagsListWithDouble.push(recipe.appliance)
        recipe.ustensils.forEach(ustensil => ustensilsTagsListWithDouble.push(ustensil))
    })

    function removingDouble(listOfTags){
        return listOfTags.filter((tag, index) => listOfTags.indexOf(tag) === index);
    }

    let completeIngredientsTagsList = removingDouble(ingredientsTagsListWithDouble)
    let completeApplianceTagsList = removingDouble(applianceTagsListWithDouble)
    let completeUstensilsTagsList = removingDouble(ustensilsTagsListWithDouble)

    let ingredientsTagsList = []
    let applianceTagsList = []
    let ustensilsTagsList = []

    let listOfTagsSelected = []

    tagsSelected.forEach(tag => listOfTagsSelected.push(stringLoweredCaseWithoutAccent(tag.tag)))

    completeIngredientsTagsList.forEach(ingredient => {
        if (!listOfTagsSelected.includes(stringLoweredCaseWithoutAccent(ingredient))){
            ingredientsTagsList.push(ingredient)
        }
    })

    completeApplianceTagsList.forEach(appliance => {
        if (!listOfTagsSelected.includes(stringLoweredCaseWithoutAccent(appliance))){
            applianceTagsList.push(appliance)
        }
    })

    completeUstensilsTagsList.forEach(ustensil => {
        if (!listOfTagsSelected.includes(stringLoweredCaseWithoutAccent(ustensil))){
            ustensilsTagsList.push(ustensil)
        }
    })

    generalListOfTags = {
        "ingredients":ingredientsTagsList,
        "appliances":applianceTagsList,
        "ustensils":ustensilsTagsList
    }
}

searchTagDom.addEventListener("focusin", e => openTagsField(e))

function openTagsField(e){


    tagsFieldOpened = {
        "ingredients":false,
        "appliances":false,
        "ustensils":false
    }
    let tagField = e.target.id;
    tagsFieldOpened[tagField] = true
    tagsDisplay()
}


function closeTagsField(){
    tagsFieldOpened = {
        "ingredients":false,
        "appliances":false,
        "ustensils":false
    }
    
    let inputs = document.getElementsByClassName("searchByTagOptions")
    inputs = [... inputs]
    inputs.forEach(input => input.value = "")

    tagsDisplay()
}

function tagsDisplay(){
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

searchTagDom.addEventListener("input", e => tagSearchInput(e.target))

let currentInputValue = ""

function tagSearchInput(dom){
    getTags(matchingRecipes)
    currentInputValue = dom.value
    generalListOfTags[dom.id] = generalListOfTags[dom.id].filter(tag => stringLoweredCaseWithoutAccent(tag).includes(stringLoweredCaseWithoutAccent(currentInputValue)))
    tagsDisplay()
}


function selectTag(tag){
    let tagType = ""
    if (generalListOfTags.ingredients.includes(tag)){tagType = "ingredient"}
    if (generalListOfTags.appliances.includes(tag)){tagType = "appliance"}
    if (generalListOfTags.ustensils.includes(tag)){tagType = "ustensils"}
    tagsSelected.push({tag: tag, tagType : tagType})
    //filterByTag()
    //update()
    tagsSelectedDisplay()
    closeTagsField()
    filterByTag()
    update()
}



function tagsSelectedDisplay(){
    const tagsSelectedDOM = document.getElementById("tags-selected")
    let html=""
    tagsSelected.forEach(function(tag, index) {

        html += `<div class="tagSelected ${tag.tagType}"><p>${tag.tag}</p><i class="fa-solid fa-xmark " onclick="removeTag('${index}')"></i></div>`
        
    })
    tagsSelectedDOM.innerHTML = html
}

function removeTag(index){  
    tagsSelected.splice(index, 1)
    tagsSelectedDisplay()
    closeTagsField()
    filterByTag()
    update()
}

function getRecipeIngredientsApplianceUstensilsString(recipe){
    let recipeIngredientsArray = []
    recipe.ingredients.forEach(i => {
        recipeIngredientsArray.push(i.ingredient)
    })

    let recipeUstensilsArray = []

    recipe.ustensils.forEach(u => recipeUstensilsArray.push(u))
    
    const recipeIngredientString = recipeIngredientsArray.toString();
    const recipeUstensilsString = recipeUstensilsArray.toString();

    return stringLoweredCaseWithoutAccent(recipeIngredientString + " " + recipe.appliance + " " + recipeUstensilsString)
}




function recipesDisplay(recipes){

    const recipesSection = document.getElementById("recipes");
    
    let html = ""

    if (recipes.length === 0){
        html += '<p>Aucune recette ne correspond à votre recherche ...<br>vous pouvez chercher "tarte aux pommes", "poisson", etc.</>'
    }else{

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
                <div class="recipe-card" onclick="selectRecipe('${recipe.name}')">
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

    }



    recipesSection.innerHTML = html

}

function selectRecipe(e){
    console.log(e)
}

init()

