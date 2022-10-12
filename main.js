// getting tags

// tags arrays
let listOfIngredientTagsWithDouble = []
let listOfApplianceTagsWithDouble = []
let listOfUstensilTagsWithDouble = []
let listOfIngredientTags = []
let listOfApplianceTags = []
let listOfUstensilTags = []

// raw tags arrays
recipes.forEach(recipe =>{
    recipe.ingredients.forEach(e => listOfIngredientTagsWithDouble.push(e.ingredient.toLowerCase()))
    recipe.ustensils.forEach(e => listOfUstensilTagsWithDouble.push(e.toLowerCase()))
    listOfApplianceTagsWithDouble.push(recipe.appliance.toLowerCase())
})

// removing double from raw tags arrays
function removingDouble(listOfTags){
    return listOfTags.filter((tag, index) => listOfTags.indexOf(tag) === index);
}

listOfIngredientTags = removingDouble(listOfIngredientTagsWithDouble)
listOfApplianceTags = removingDouble(listOfApplianceTagsWithDouble);
listOfUstensilTags = removingDouble(listOfUstensilTagsWithDouble)

// generalListOfTags object
const generalListOfTags = {
    "ingredientTags" : listOfIngredientTags,
    "applianceTags" : listOfApplianceTags,
    "ustensilTags" : listOfUstensilTags
}

// search bar

const searchedElementInput = document.getElementById("elementSearched")
searchedElementInput.addEventListener("input", function(){
    searchBar()
}) 

let searchedElementsBar = []

function searchBar(){
    
    let searchString = searchedElementInput.value.toLowerCase().trim()

    console.log(searchString)
    
    if (searchString.length > 2){
        searchedElementsBar = searchString.split(" ");
        search()
    }else{
        searchedElementsBar =[];
        search()
    } 
}


// research by tagsbb
const searchByTagDOM = document.getElementById("tagSearch")

// event when focus in one of the tags fields
searchByTagDOM.addEventListener("focusin", function(e){
    const currentTagsInputDOM = e.target
    const tagsType = currentTagsInputDOM.id
    const currentListOfTags = generalListOfTags[tagsType]
    const searchByTagOptionsDOM = document.getElementsByClassName("tags-display")
    const currentTagFieldDOM = document.getElementById(`${tagsType}-display`)
    const othersTagFieldDOM = Array.from(searchByTagOptionsDOM).filter(e => e !== currentTagFieldDOM)

    // event when an input is entered in one of the tags fields
    currentTagsInputDOM.addEventListener("input", function(e){
        let searchInput = currentTagsInputDOM.value
        const trimCurrentListOfTags = currentListOfTags.filter(tag => tag.includes(searchInput))
        listOfTagsDisplay(trimCurrentListOfTags, currentTagFieldDOM, othersTagFieldDOM)
    })
    listOfTagsDisplay(currentListOfTags,currentTagFieldDOM, othersTagFieldDOM)
})

// display tags
const tagsSelected = []

function listOfTagsDisplay(ListOfTags, currentTagFieldDOM, othersTagFieldDOM){

    let html = ""
    ListOfTags.forEach(tag => html += `<p class="tagListElements" id="${tag}">${tag}</p>`)
    currentTagFieldDOM.innerHTML = html
    othersTagFieldDOM.forEach(e => e.innerHTML = "")
    
    //mettre en dehors de listOfTags...
    currentTagFieldDOM.addEventListener("click", function(e){
        e.stopImmediatePropagation()
        let tagSelected = e.target.closest("p").id
        tagsSelected.push(tagSelected)
        console.log(tagsSelected)
        currentTagFieldDOM.innerHTML = ""
        tagsSelectedDisplay()
        search()
    })
}


// display tags selected

function tagsSelectedDisplay(){
    const tagsSelectedDOM = document.getElementById("tags-selected")

    let html=""

    tagsSelected.forEach(function(tag, index) {
        html += `<div class="tagSelected"><p>${tag}</p><i class="fa-solid fa-xmark" onclick="removeTag('${index}')"></i></div>`
    })

    tagsSelectedDOM.innerHTML = html
}

// remove tags by clicking on the xmark
function removeTag(index){
    
    tagsSelected.splice(index, 1)
    tagsSelectedDisplay()
    search()
}


// search function
function search(){

    let matchingRecipes = []
    let recipesIsMatching = []
    let searchedElements = []


    searchedElements = searchedElementsBar.concat(tagsSelected)

    matchingRecipes.length = 0;

    // searching in each recipe
    recipes.forEach(recipe => {

        let listOfIngredients = []
        let ingredientsString = ""

        let listOfUstensils = []
        let ustensilsString = []

        // making ingredients list
        recipe.ingredients.forEach(e => listOfIngredients.push(e.ingredient.toLowerCase()))
        recipe.ustensils.forEach(e => listOfUstensils.push(e.toLowerCase()))

        // converting ingredient list into a string
        ingredientsString = listOfIngredients.toString()
        ustensilsString = listOfUstensils.toString()


        // emptying the array of matching recipes ex: [false, true] => []
        recipesIsMatching.length = 0;

        // creating matching recipe array by comparing search elements and recipe elements
        searchedElements.forEach(searchedElement =>{
            if (recipe.name.toLowerCase().includes(searchedElement)
            ||recipe.description.toLowerCase().includes(searchedElement)
            ||ingredientsString.includes(searchedElement)
            ||ustensilsString.includes(searchedElement)
            ||recipe.appliance.toLowerCase().includes(searchedElement)



            ){
                recipesIsMatching.push(true)
            }else{
                recipesIsMatching.push(false)
            }
        })

        // checking if the matching recipe contain false. If not adding the matching recipe to the matching recipe array
        if (recipesIsMatching.includes(false)){
            return
        }else{
            matchingRecipes.push(recipe)
        }
    })
    //console.log(matchingRecipes)
    recipesDisplay(matchingRecipes)
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

recipesDisplay(recipes)











