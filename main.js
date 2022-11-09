// variables globales
let generalListOfTags = {}
let tagsSelected = []
let tagsFieldOpened = {}
let searchBarMatchingIds = []
let filterByTagMatchingIds = []
let matchingRecipes = []

// event listeners

const searchTagDom = document.getElementById('tagSearch')

searchTagDom.addEventListener('focusin', e => openTagsField(e))
searchTagDom.addEventListener('input', e => tagSearchInput(e.target))

const searchedElementInput = document.getElementById('elementSearched')

searchedElementInput.addEventListener('input', searchBarInput)

//Initialisation à l'ouverture de la page
function init () {
  matchingRecipes = recipes
  recipes.forEach(recipe => searchBarMatchingIds.push(recipe.id))
  recipes.forEach(recipe => filterByTagMatchingIds.push(recipe.id))
  searchByTagsInputDisplay()
  recipesDisplay(recipes)
  getTags(recipes)
}

//Actualisation de l'affichage des recettes et des tags à chaque input de l'utilisateur
function update () {
  recipesDisplay(matchingRecipes)
  getTags(matchingRecipes)
  tagsDisplay()
}

//Modifie les strings en miniscule et enlève les accents pour faciliter le filtrage des recettes
function stringLoweredCaseWithoutAccent (string) {
  return string.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

// Recherche des recettes grâce à la barre de recherche
function searchBarInput () {
  let searchedElementsBar = []
  const searchString = stringLoweredCaseWithoutAccent(searchedElementInput.value)
  if (searchString.length > 2) {
    searchedElementsBar = searchString.split(' ')
    searchBar(searchedElementsBar)
  } else {
    searchedElementsBar = []
    searchBar(searchedElementsBar)
  }
}

function getRecipeNameIngredientsDescriptionString (recipe) {
  const recipeIngredientsArray = []
  recipe.ingredients.forEach(i => {
    recipeIngredientsArray.push(i.ingredient)
  })
  const recipeIngredientString = recipeIngredientsArray.toString()
  return stringLoweredCaseWithoutAccent(recipe.name + ' ' + recipe.description + ' ' + recipeIngredientString)
}

function searchBar (searchedElementsBar) {
  searchBarMatchingIds = []
  recipes.forEach(recipe => {
    const elementsSearched = getRecipeNameIngredientsDescriptionString(recipe)
    const recipeIsMatching = searchedElementsBar.every(element => elementsSearched.includes(element))
    if (recipeIsMatching === true) {
      searchBarMatchingIds.push(recipe.id)
    }
  })

  matchingIds()
}

// Recherche des recettes à l'aide des tags

function getTags (matchingRecipes) {
  const ingredientsTagsListWithDouble = []
  const applianceTagsListWithDouble = []
  const ustensilsTagsListWithDouble = []
  matchingRecipes.forEach(recipe => {
    recipe.ingredients.forEach(i => ingredientsTagsListWithDouble.push(i.ingredient))
    applianceTagsListWithDouble.push(recipe.appliance)
    recipe.ustensils.forEach(ustensil => ustensilsTagsListWithDouble.push(ustensil))
  })

  function removingDouble (listOfTags) {
    return listOfTags.filter((tag, index) => listOfTags.indexOf(tag) === index)
  }

  const completeIngredientsTagsList = removingDouble(ingredientsTagsListWithDouble)
  const completeApplianceTagsList = removingDouble(applianceTagsListWithDouble)
  const completeUstensilsTagsList = removingDouble(ustensilsTagsListWithDouble)

  const ingredientsTagsList = []
  const applianceTagsList = []
  const ustensilsTagsList = []

  const listOfTagsSelected = []

  tagsSelected.forEach(tag => listOfTagsSelected.push(stringLoweredCaseWithoutAccent(tag.tag)))

  completeIngredientsTagsList.forEach(ingredient => {
    if (!listOfTagsSelected.includes(stringLoweredCaseWithoutAccent(ingredient))) {
      ingredientsTagsList.push(ingredient)
    }
  })

  completeApplianceTagsList.forEach(appliance => {
    if (!listOfTagsSelected.includes(stringLoweredCaseWithoutAccent(appliance))) {
      applianceTagsList.push(appliance)
    }
  })

  completeUstensilsTagsList.forEach(ustensil => {
    if (!listOfTagsSelected.includes(stringLoweredCaseWithoutAccent(ustensil))) {
      ustensilsTagsList.push(ustensil)
    }
  })

  generalListOfTags = {
    ingredients: ingredientsTagsList,
    appliances: applianceTagsList,
    ustensils: ustensilsTagsList
  }
}

function openTagsField (e) {
  tagsFieldOpened = {
    ingredients: false,
    appliances: false,
    ustensils: false
  }
  const tagField = e.target.id
  tagsFieldOpened[tagField] = true
  searchByTagsInputDisplay()
  tagsDisplay()
}

function closeTagsField () {
  tagsFieldOpened = {
    ingredients: false,
    appliances: false,
    ustensils: false
  }

  let inputs = document.getElementsByClassName('searchByTagOptions')
  inputs = [...inputs]
  inputs.forEach(input => input.value = '')
  searchByTagsInputDisplay()
  tagsDisplay()
}

function searchByTagsInputDisplay () {
  const chevronUpIngredients = document.getElementById('up-ingredients')
  const chevronUpAppliances = document.getElementById('up-appliances')
  const chevronUpUstensils = document.getElementById('up-ustensils')
  const chevronDownIngredients = document.getElementById('down-ingredients')
  const chevronDownAppliances = document.getElementById('down-appliances')
  const chevronDownUstensils = document.getElementById('down-ustensils')

  const ingredientsResearchDOM = document.getElementById('ingredients')
  const appliancesResearchDOM = document.getElementById('appliances')
  const ustensilsResearchDOM = document.getElementById('ustensils')

  if (tagsFieldOpened.ingredients === true) {
    chevronUpIngredients.style.display = 'none'
    chevronDownIngredients.style.display = 'inline'
    ingredientsResearchDOM.setAttribute('placeholder', 'Rechercher un ingrédient')
  } else {
    chevronUpIngredients.style.display = 'inline'
    chevronDownIngredients.style.display = 'none'
    ingredientsResearchDOM.setAttribute('placeholder', 'Ingredients')
  }

  if (tagsFieldOpened.appliances === true) {
    chevronUpAppliances.style.display = 'none'
    chevronDownAppliances.style.display = 'inline'
    appliancesResearchDOM.setAttribute('placeholder', 'Rechercher un appareil')
  } else {
    chevronUpAppliances.style.display = 'inline'
    chevronDownAppliances.style.display = 'none'
    appliancesResearchDOM.setAttribute('placeholder', 'Appareil')
  }

  if (tagsFieldOpened.ustensils === true) {
    chevronUpUstensils.style.display = 'none'
    chevronDownUstensils.style.display = 'inline'
    ustensilsResearchDOM.setAttribute('placeholder', 'Rechercher un ustensile')
  } else {
    chevronUpUstensils.style.display = 'inline'
    chevronDownUstensils.style.display = 'none'
    ustensilsResearchDOM.setAttribute('placeholder', 'Ustensiles')
  }
}


function tagsDisplay () {

  const ingredientsTagsDisplay = document.getElementById('ingredients-display')
  const appliancesTagsDisplay = document.getElementById('appliances-display')
  const ustensilsTagsDisplay = document.getElementById('ustensils-display')
  let ingredientsHtml = ''
  generalListOfTags.ingredients.forEach(ingredient =>
    ingredientsHtml += `<p class="tagListElements" id="${ingredient}" onclick="selectTag(id)">${ingredient}</p>`
  )

  if (tagsFieldOpened.ingredients === true) {
    ingredientsTagsDisplay.innerHTML = ingredientsHtml
  } else {
    ingredientsTagsDisplay.innerHTML = ''
  }

  let appliancesHtml = ''
  generalListOfTags.appliances.forEach(appliance =>
    appliancesHtml += `<p class="tagListElements" id="${appliance}" onclick="selectTag(id)">${appliance}</p>`
  )

  if (tagsFieldOpened.appliances === true) {
    appliancesTagsDisplay.innerHTML = appliancesHtml
  } else {
    appliancesTagsDisplay.innerHTML = ''
  }
  let ustensilsHtml = ''
  generalListOfTags.ustensils.forEach(ustensil =>
    ustensilsHtml += `<p class="tagListElements" id="${ustensil}" onclick="selectTag(id)">${ustensil}</p>`
  )

  if (tagsFieldOpened.ustensils === true) {
    ustensilsTagsDisplay.innerHTML = ustensilsHtml
  } else {
    ustensilsTagsDisplay.innerHTML = ''
  }
}

function tagSearchInput (dom) {
  let currentInputValue = ''
  getTags(matchingRecipes)
  currentInputValue = dom.value
  generalListOfTags[dom.id] = generalListOfTags[dom.id].filter(tag => stringLoweredCaseWithoutAccent(tag).includes(stringLoweredCaseWithoutAccent(currentInputValue)))
  tagsDisplay()
}

function selectTag (tag) {
  let tagType = ''
  if (generalListOfTags.ingredients.includes(tag)) { tagType = 'ingredient' }
  if (generalListOfTags.appliances.includes(tag)) { tagType = 'appliance' }
  if (generalListOfTags.ustensils.includes(tag)) { tagType = 'ustensils' }
  tagsSelected.push({ tag, tagType })
  // filterByTag()
  // update()
  tagsSelectedDisplay()
  closeTagsField()
  filterByTag()
  update()
}

function tagsSelectedDisplay () {
  const tagsSelectedDOM = document.getElementById('tags-selected')
  let html = ''
  tagsSelected.forEach(function (tag, index) {
    html += `<div class="tagSelected ${tag.tagType}"><p>${tag.tag}</p><i class="fa-regular fa-circle-xmark" onclick="removeTag('${index}')"></i></div>`
  })
  tagsSelectedDOM.innerHTML = html
}

function removeTag (index) {
  tagsSelected.splice(index, 1)
  tagsSelectedDisplay()
  closeTagsField()
  filterByTag()
  update()
}

function getRecipeIngredientsApplianceUstensilsString (recipe) {
  const recipeIngredientsArray = []
  recipe.ingredients.forEach(i => {
    recipeIngredientsArray.push(i.ingredient)
  })

  const recipeUstensilsArray = []

  recipe.ustensils.forEach(u => recipeUstensilsArray.push(u))

  const recipeIngredientString = recipeIngredientsArray.toString()
  const recipeUstensilsString = recipeUstensilsArray.toString()

  return stringLoweredCaseWithoutAccent(recipeIngredientString + ' ' + recipe.appliance + ' ' + recipeUstensilsString)
}

function filterByTag () {
  filterByTagMatchingIds = []
  const tags = []
  tagsSelected.forEach(tag => tags.push(stringLoweredCaseWithoutAccent(tag.tag)))
  recipes.forEach(recipe => {
    const elementsSearched = getRecipeIngredientsApplianceUstensilsString(recipe)
    const recipeIsMatching = tags.every((tag) => elementsSearched.includes(tag))
    if (recipeIsMatching === true) {
      filterByTagMatchingIds.push(recipe.id)
    }
  })

  matchingIds()
}

// Récupération de l'id des recettes filtrées grâce à la barre de recherche et à la recherche par tag
function matchingIds () {
  const allIds = []
  const matchingIds = []
  recipes.forEach(recipe => allIds.push(recipe.id))
  allIds.forEach(id => {
    if (searchBarMatchingIds.includes(id) && filterByTagMatchingIds.includes(id)) {
      matchingIds.push(id)
    }
  })
  filterRecipes(matchingIds)
}

// Filtrage des recettes grâce à l'id des recettes filtrées
function filterRecipes (ids) {
  matchingRecipes = recipes.filter(recipe => ids.includes(recipe.id))
  update()
}

// Affichage des recettes
function recipesDisplay (recipes) {
  const recipesSection = document.getElementById('recipes')

  let html = ''

  if (recipes.length === 0) {
    html += '<p>Aucune recette ne correspond à votre recherche ...<br>vous pouvez chercher "tarte aux pommes", "poisson", etc.</>'
  } else {
    recipes.forEach(recipe => {
      let ingredientHtml = ''

      recipe.ingredients.forEach(i => {
        if ('quantity' in i === false) {
          ingredientHtml += `
                <p><span class = "ingredientName">${i.ingredient}</span></p>
                `
        } else if ('unit' in i === false) {
          ingredientHtml += `
                <p><span class = "ingredientName">${i.ingredient}:</span> ${i.quantity}</p>
                `
        } else {
          ingredientHtml += `
                    <p><span class = "ingredientName">${i.ingredient}:</span> ${i.quantity} ${i.unit}</p>
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


// Sélection des recettes
function selectRecipe (e) {
  console.log(e)
}


init()
