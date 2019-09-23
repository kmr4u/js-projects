import {elements} from './base';

export const getInput = () => elements.searchInput.value;


const renderRecipe = (recipe) => {
    const markup = `
    <li>
        <a class="results__link " href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;

    elements.serachResultList.insertAdjacentHTML('beforeend', markup);
}

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1 : page+1}>
    <span>Page ${type === 'prev' ? page-1 : page+1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
    </button>
`;
const renderButton = (page, numResults, pagination) => {
    const pages = Math.ceil(numResults/pagination);

    let button;
    if(page === 1 && pages > 1){
        //Show only the next page button
        button = createButton(page, 'next');
    }else if(page < pages ){
        //Show both the next and prev button
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `;
    }
    else if(page === pages && pages >1){
        //Show only the prev page button
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};
export const renderResults = (recipes, page=1, pagination=10) =>{
    const start = (page-1)*pagination;
    const end = page*pagination;

    recipes.slice(start, end).forEach(renderRecipe);

    renderButton(page, recipes.length, 10);
};

export const clearSearch = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.serachResultList.innerHTML = '';
    elements.searchResPages.innerHTML='';
};

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit){

        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit){
                newTitle.push(cur);
            }else{
                newTitle.push(cur.substring(0, 16));
            }
            return acc + cur.length;
        },0);

        return `${newTitle.join(' ')}...`;
    }
    return title;
}