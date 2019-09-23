import {elements} from './base';
import {Fraction} from 'fractional';


export const highlightSelectedRecipe = (id) => {

    const recipes = Array.from(document.querySelectorAll('.results__link'));

    recipes.forEach(el => {
        el.classList.remove('results__link--active');
    })
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');

};
const formatCount = (count) => { //format float numbers into mixed number format i.e. 2.5 to 2 1/2
    if(count){

        const [int, dec] = count.toString().split('.').map(el => parseInt(el, 10));

        if(!dec) return count;

        if(int === 0){
            var fr = new Fraction(count);
            return `${fr.numerator}/${fr.denominator}`;
        }
        else{
            var fr = new Fraction(count - int);
            if(dec.toString().startsWith('3'))
                return `${int} 1/3`;
            return `${int} ${fr.numerator}/${fr.denominator}`;
        }

    }

    return '?'
};
const createRecipeItem = (ingredient) => `
    <li class="recipe__item">
    <svg class="recipe__icon">
        <use href="img/icons.svg#icon-check"></use>
    </svg>
    <div class="recipe__count">${formatCount(ingredient.count)}</div>
    <div class="recipe__ingredient">
        <span class="recipe__unit">${ingredient.unit}</span>
        ${ingredient.ingredient}
    </div>
    </li>
`;
export const renderRecipe = (recipe, isLiked) =>{
    const markup = `
    <figure class="recipe__fig">
    <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
    <h1 class="recipe__title">
        <span>${recipe.title}</span>
    </h1>
</figure>
<div class="recipe__details">
    <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="img/icons.svg#icon-stopwatch"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
        <span class="recipe__info-text"> minutes</span>
    </div>
    <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="img/icons.svg#icon-man"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
        <span class="recipe__info-text"> servings</span>

        <div class="recipe__info-buttons">
            <button class="btn-tiny btn-decrease">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-minus"></use>
                </svg>
            </button>
            <button class="btn-tiny btn-increase">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-plus"></use>
                </svg>
            </button>
        </div>

    </div>
    <button class="recipe__love">
        <svg class="header__likes">
            <use href="img/icons.svg#icon-heart${isLiked ? '': '-outlined'}"></use>
        </svg>
    </button>
</div>



<div class="recipe__ingredients">
    <ul class="recipe__ingredient-list">
        ${recipe.ingredients.map(el => createRecipeItem(el)).join('')}

        
    </ul>

    <button class="btn-small recipe__btn recipe__btn--add">
        <svg class="search__icon">
            <use href="img/icons.svg#icon-shopping-cart"></use>
        </svg>
        <span>Add to shopping list</span>
    </button>
</div>

<div class="recipe__directions">
    <h2 class="heading-2">How to cook it</h2>
    <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
    </p>
    <a class="btn-small recipe__btn" href="${recipe.source}" target="_blank">
        <span>Directions</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>

    </a>
</div>
    `;

    elements.searchRecipe.insertAdjacentHTML('afterbegin', markup);
};

export const clearRecipe = () => {
    elements.searchRecipe.innerHTML = '';
}

export const updateCounts = (recipe)=>{
    //1.Update the servings

    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;
    //2.Update the Ingredients Counts

    var recipeCounts = Array.from(document.querySelectorAll('.recipe__count'));
    recipeCounts.forEach((el, i) => {
        el.textContent = recipe.ingredients[i].count;
    })
}