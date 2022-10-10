// getting tags

let listOfIngredientTagsWithDouble = []
let listOfApplianceTagsWithDouble = []
let listOfUstensilTagsWithDouble = []
let listOfIngredientTags = []
let listOfApplianceTags = []
let listOfUstensilTags = []

recipes.forEach(recipe =>{
    recipe.ingredients.forEach(e => listOfIngredientTagsWithDouble.push(e.ingredient.toLowerCase()))
    recipe.ustensils.forEach(e => listOfUstensilTagsWithDouble.push(e.toLowerCase()))
    listOfApplianceTagsWithDouble.push(recipe.appliance.toLowerCase())
})

function removingDouble(listOfTags){
    return listOfTags.filter((tag, index) => listOfTags.indexOf(tag) === index);
}

listOfIngredientTags = removingDouble(listOfIngredientTagsWithDouble)
listOfApplianceTags = removingDouble(listOfApplianceTagsWithDouble);
listOfUstensilTags = removingDouble(listOfUstensilTagsWithDouble)

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
    
      // transformer la recherche en un tableau contenant les éléments recherchés
      let searchString = searchedElementInput.value.toLowerCase().trim()
      if (searchString.length > 2){
        searchedElementsBar = searchString.split(" ");
        search()
    }else{
        searchedElementsBar =[];
        search()
    } 
    
    console.log(searchedElementsBar)
}


// research by tags
//const searchByTagDOM = document.getElementsByClassName("searchByTag");
const searchByTagDOM = document.getElementById("tagSearch")
const dropDownSymbol = document.getElementsByClassName("fa-chevron-down")
const dropUpSymbol = document.getElementsByClassName("fa-chevron-up")


searchByTagDOM.addEventListener("focusin", function(e){
    const currentTagsInputDOM = e.target
    const tagsType = currentTagsInputDOM.id
    const currentListOfTags = generalListOfTags[tagsType]
    const searchByTagOptionsDOM = document.getElementsByClassName("tags-display")
    const currentTagFieldDOM = document.getElementById(`${tagsType}-display`)
    const othersTagFieldDOM = Array.from(searchByTagOptionsDOM).filter(e => e !== currentTagFieldDOM)

    currentTagsInputDOM.addEventListener("input", function(e){
        let searchInput = currentTagsInputDOM.value
        const trimCurrentListOfTags = currentListOfTags.filter(tag => tag.includes(searchInput))
        listOfTagsDisplay(trimCurrentListOfTags, currentTagFieldDOM, othersTagFieldDOM)
    })
    listOfTagsDisplay(currentListOfTags,currentTagFieldDOM, othersTagFieldDOM)
})

const tagsSelected = []

function listOfTagsDisplay(ListOfTags, currentTagFieldDOM, othersTagFieldDOM){

    let html = ""
    ListOfTags.forEach(tag => html += `<p class="tagListElements" id="${tag}">${tag}</p>`)
    currentTagFieldDOM.innerHTML = html
    othersTagFieldDOM.forEach(e => e.innerHTML = "")
    
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

function removeTag(index){
    
    tagsSelected.splice(index, 1)
    tagsSelectedDisplay()
    search()
}


function tagsSelectedDisplay(){
    const tagsSelectedDOM = document.getElementById("tags-selected")

    let html=""

    tagsSelected.forEach(function(tag, index) {
        html += `<p>${tag}</p><i class="fa-solid fa-xmark" onclick="removeTag('${index}')"></i>`
    })

    tagsSelectedDOM.innerHTML = html
}



// search functiongzrgz
function search(){

    let matchingRecipes = []
    let recipesIsMatching = []
    let searchedElements = []


    searchedElements = searchedElementsBar.concat(tagsSelected)


    // emptying matching recipes array
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











