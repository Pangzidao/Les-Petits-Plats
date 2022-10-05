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

// getting tags
recipes.forEach(recipe =>{
    recipe.ingredients.forEach(e => listOfIngredientTagsWithDouble.push(e.ingredient.toLowerCase()))
    recipe.ustensils.forEach(e => listOfUstensilTagsWithDouble.push(e.toLowerCase()))
    listOfApplianceTagsWithDouble.push(recipe.appliance.toLowerCase())
})


//tags without double

function removingDouble(listOfTags){
    return listOfTags.filter((tag, index) => listOfTags.indexOf(tag) === index);
}

listOfIngredientTags = removingDouble(listOfIngredientTagsWithDouble)
listOfApplianceTags = removingDouble(listOfApplianceTagsWithDouble);
listOfUstensilTags = removingDouble(listOfUstensilTagsWithDouble)

// search bar

function searchBar(){
      // transformer la recherche en un tableau contenant les éléments recherchés
      searchedElements.length = 0
      let searchString = searchedElementInput.value.toLowerCase()
      let searchedElementsBar = searchString.split(" ");
      searchedElementsBar.forEach(e => searchedElements.push(e))        
      search()

}

// search function
function search(){
    
    // emptying matching recipes array
    matchingRecipes.length = 0;

    // searching in each recipe
    recipes.forEach(recipe => {

        let listOfIngredients = []
        let ingredientsString = ""

        // making ingredients list
        recipe.ingredients.forEach(e => listOfIngredients.push(e.ingredient.toLowerCase()))

        // converting ingredient list into a string
        ingredientsString = listOfIngredients.toString()

        // emptying the array of matching recipes ex: [false, true] => []
        recipesIsMatching.length = 0;

        // creating matching recipe array by comparing search elements and recipe elements
        searchedElements.forEach(searchedElement =>{
            if (recipe.name.toLowerCase().includes(searchedElement)
            ||recipe.description.toLowerCase().includes(searchedElement)
            ||ingredientsString.includes(searchedElement)
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
            matchingRecipes.push(recipe.name)
        }
    })
    console.log(searchedElements)
    console.log(matchingRecipes)
}


// research by tags

// selecting tags field
const searchByTagDOM = document.getElementsByClassName("searchByTag");
const generalListOfTags = {
    "ingredientTags" : listOfIngredientTags,
    "applianceTags" : listOfApplianceTags,
    "ustensilTags" : listOfUstensilTags
}

Array.from(searchByTagDOM).forEach(element => {

    let html = ""
    element.addEventListener("focus", function(){
        html = ""
        let tagsType = element.id
        const currentListOfTags = generalListOfTags[tagsType]
        const currentTagFieldDOM = document.getElementById(`${tagsType}-display`)

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

            let tagListElementsDOM = document.getElementsByClassName("tagListElements");

            Array.from(tagListElementsDOM).forEach(tag =>{
                tag.addEventListener("click", function(e){
                    console.log(e.target.id)
                    tagsSelected.push(e.target.id)
                    console.log(tagsSelected)
                    //tagsSelectedDisplay()
                    searchedElements.push(...tagsSelected)
                    search()
                })
            })

        })


    })


    /*element.addEventListener("focusout", function(){
        html = ""
        let tagsType = element.id
        const lastTagFieldDOM = document.getElementById(`${tagsType}-display`)
        lastTagFieldDOM.innerHTML = html
    })*/
});

const tagsSelected = []
/*
function tagsSelectedDisplay(tag){
    const tagsSelectedDOM = document.getElementById("tags-selected")
    tagsDisplay.push(tag)

    console.log(tagsDisplay)

    let html=""

    tagsDisplay.forEach(function(tag, index) {
        html += `<p>${tag}</p><i class="fa-solid fa-xmark" onclick="removeTag('${index}')"></i>`
    })

    tagsSelectedDOM.innerHTML = html
}

function removeTag(index){
    
    tagsDisplay.splice(index, 1)
}



*/










