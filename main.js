//DOM de la barre de recherche
const searchedElementInput = document.getElementById("elementSearched")

let matchingRecipes = []
let matchingElements = []
let recipesIsMatching = []

let listOfIngredientTagsWithDouble = []
let listOfApplianceTagsWithDouble = []
let listOfUstensilTagsWithDouble = []
let listOfIngredientTags = []
let listOfApplianceTags = []
let listOfUstensilTags = []

let searchedElements = []

// getting tags OK
recipes.forEach(recipe =>{
    recipe.ingredients.forEach(e => listOfIngredientTagsWithDouble.push(e.ingredient.toLowerCase()))
    recipe.ustensils.forEach(e => listOfUstensilTagsWithDouble.push(e.toLowerCase()))
    listOfApplianceTagsWithDouble.push(recipe.appliance.toLowerCase())
})

//tags without double OK

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

searchedElementInput.addEventListener("input", function(){
    searchBar()
}) 

let searchedElementsBar = []

function searchBar(){
      // transformer la recherche en un tableau contenant les éléments recherchés
      searchedElements.length = 0      
      let searchString = searchedElementInput.value.toLowerCase().trim()
      if (searchString.length > 2){
        searchedElementsBar = searchString.split(" ");
        search()
    }else{
        searchedElementsBar =[];
        search()
    }  
}


// research by tags

// selecting tags field
const searchByTagDOM = document.getElementsByClassName("searchByTag");


Array.from(searchByTagDOM).forEach(element => {

    let html = ""
    element.addEventListener("focus", function(){
        html = ""
        let tagsType = element.id
        const currentListOfTags = generalListOfTags[tagsType]
        const currentTagFieldDOM = document.getElementById(`${tagsType}-display`)

        currentTagFieldDOM.addEventListener("click", function(e){
            console.log(e.target.closest("p").id)
            tagsSelected.push(e.target.id)
                    tagsSelectedDisplay()
                    search()
        })

        element.addEventListener("input", function(e){
            html=""
            let searchInput = e.target.value;
            let trimCurrentListOfTags = []

            if (searchInput.length > 0){
                trimCurrentListOfTags = currentListOfTags.filter(tag => tag.includes(searchInput))
            }else{
                trimCurrentListOfTags.length = 0
            };

            trimCurrentListOfTags.forEach(tag =>  html += `<p class="tagListElements" id="${tag}">${tag}</p>`)
            currentTagFieldDOM.innerHTML = html;

        })

    })

});

function removeTag(index){
    
    tagsSelected.splice(index, 1)
    tagsSelectedDisplay()
    search()
}




const tagsSelected = []

function tagsSelectedDisplay(){
    const tagsSelectedDOM = document.getElementById("tags-selected")

    let html=""

    console.log(tagsSelected)


    tagsSelected.forEach(function(tag, index) {
        html += `<p>${tag}</p><i class="fa-solid fa-xmark" onclick="removeTag('${index}')"></i>`
    })

    tagsSelectedDOM.innerHTML = html
}



// search function
function search(){

    searchedElements = searchedElementsBar.concat(tagsSelected)
    //console.log(searchedElements)


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











