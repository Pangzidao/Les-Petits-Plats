//DOM de la barre de recherche
const searchedElementInput = document.getElementById("elementSearched")

let matchingRecipes = []
let matchingElements = []
let recipesIsMatching = []
let listOfIngredientTags = []
let listOfApplianceTags = []
let listOfUstensilTags = []
let searchedElements = []

// getting tags
recipes.forEach(recipe =>{
    recipe.ingredients.forEach(e => listOfIngredientTags.push(e.ingredient.toLowerCase()))
    recipe.ustensils.forEach(e => listOfUstensilTags.push(e.toLowerCase()))
    listOfApplianceTags.push(recipe.appliance.toLowerCase())
})

// removing repetive elements in ingredient tags list

listOfIngredientTags.forEach(ingredient => {
    let repetitiveIngredient = listOfIngredientTags.filter(word => word === ingredient)

    while (repetitiveIngredient.length > 1){
        let lastIndexOfRepetiveIngredient = listOfIngredientTags.lastIndexOf(repetitiveIngredient[0])
        listOfIngredientTags.splice(lastIndexOfRepetiveIngredient, 1)
        repetitiveIngredient.pop();
    }
})

// removing repetive elements in appliance tags list

listOfApplianceTags.forEach(appliance => {
    let repetitiveAppliance = listOfApplianceTags.filter(word => word === appliance)

    while (repetitiveAppliance.length > 1){
        let lastIndexOfRepetiveAppliance = listOfApplianceTags.lastIndexOf(repetitiveAppliance[0])
        listOfApplianceTags.splice(lastIndexOfRepetiveAppliance, 1)
        repetitiveAppliance.pop();
    }
})

// removing repetive elements in ustensil tags list

listOfUstensilTags.forEach(ustensil => {
    let repetitiveUstensil = listOfUstensilTags.filter(word => word === ustensil)

    while (repetitiveUstensil.length > 1){
        let lastIndexOfRepetiveUstensil = listOfUstensilTags.lastIndexOf(repetitiveUstensil[0])
        listOfUstensilTags.splice(lastIndexOfRepetiveUstensil, 1)
        repetitiveUstensil.pop();
    }
})

// search bar

function searchBar(){
      // transformer la recherche en un tableau contenant les éléments recherchés
      let searchString = searchedElementInput.value.toLowerCase()
      let searchedElementsBar = searchString.split(" ");
      searchedElementsBar.forEach(e => searchedElements.push(e))        
      search(searchedElements)

}

// search function

function search(searchedElements){
    
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

// research by ingredient tags
let ingredientInput = document.getElementById("ingredientSearched")
let listOfIngredientTagsDOM = document.getElementById("listOfIngredientTags")
let html =""

// at each input, change the ingredient tags list and display it
ingredientInput.addEventListener("input", function(e){
    let ingredientSearched = ingredientInput.value.toLowerCase()
    let listOfIngredientsLowerCase = listOfIngredientTags.map(e => e.toLowerCase())
    const newListOfIngredientTags = listOfIngredientsLowerCase.filter(tag => tag.includes(ingredientSearched))


    html = ""    
    newListOfIngredientTags.forEach(ingredient =>{

        html += `<p class="tagListElements" id="${ingredient}">${ingredient}</p>`

        listOfIngredientTagsDOM.innerHTML = html
    })

    // select tag
    const tagListElementsDOM = document.getElementsByClassName("tagListElements")

    Array.from(tagListElementsDOM).forEach(tagListElement => {
        tagListElement.addEventListener("click", e => {
            console.log(e.target.id)
            searchedElements.push(e.target.id)
            search(searchedElements)
        })
    })
})





