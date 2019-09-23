import {elements} from './base';
import {limitRecipeTitle} from './searchView';

export const toggleLikeBtn = (isLiked) => {

    //#icon-heart-outlined
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
}

export const toggleLikesMenu = (numLikes) => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}

export const renderLike = (like) => 
{
const markup = `
        <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="${limitRecipeTitle(like.title)}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
        </li>`
elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const removeLike = (id) => {
   const element =  document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
   if(element){
       element.parentElement.removeChild(element);
   }
}