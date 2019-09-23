
import Search from './model/Search';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import {elements, renderLoader, clearLoader} from './view/base';
import Recipe from './model/Recipe';
import List from './model/List';
import * as listView from './view/listView';
import Likes from './model/Likes';
import * as likesView from './view/likesView';

const state = {};
/**
 * SEARCH Controller
 */
const handleSearch = async () => {

    const query = searchView.getInput();
    if(query){
        state.search = new Search(query);

        searchView.clearSearch();
        searchView.clearResults();

        renderLoader(elements.results);

        try{
            await state.search.getResults();
            
            //console.log(state.search.recipes);
            clearLoader();
            searchView.renderResults(state.search.recipes);
        }catch(error){
            clearLoader();
            alert('Error finding the search results');
        }
        
    }
}
elements.searchForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    handleSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10); //on base 10
        console.log(goToPage);
        searchView.clearResults();
        searchView.renderResults(state.search.recipes, goToPage);
    }
});



/**
 * Recipe Controller
 */
const handleRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    if(id){
       
        //prepare UI for changes
        recipeView.highlightSelectedRecipe(id);
        recipeView.clearRecipe();
        renderLoader(elements.searchRecipe);

       //create new Recipe Obj

       state.recipe = new Recipe(id);
      

       //get Recipe Data
       try{

        await state.recipe.getRecipe();
        
       //Calculate Servings and Time

       state.recipe.calcTime();
       state.recipe.calcServings();
       //console.log(state.recipe.ingredients);
       state.recipe.parseIngredients();
       //Render Recipe
        clearLoader();
        recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

        }catch(error){
            console.log(error);
            alert('Error processing the Recipe');
       }
       
    }
}
// window.addEventListener('hashchange', handleRecipe);
// window.addEventListener('load', handleRecipe);

 ['hashchange', 'load'].forEach(event => window.addEventListener(event, handleRecipe));

 //Increase, Decrease servings and Ingredients based on button clicks

 elements.searchRecipe.addEventListener('click', e => {
     if(e.target.matches('.btn-decrease, .btn-decrease *')){
         //Decrease button clicked
         if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateCounts(state.recipe);
         }
            
         
     }else if(e.target.matches('.btn-increase, .btn-increase *')){
        //Increase button clicked
        state.recipe.updateServings('inc');
        recipeView.updateCounts(state.recipe);
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){

        handleShoppingCart();
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        handleLike();
    }
 })

//LIST {Controller
 const handleShoppingCart = () =>{

    //1. Create a new List if there is not yet
        if(!state.list){
            state.list = new List();
        }
    //2. Add each ingredient to the list and display on UI
    state.recipe.ingredients.forEach(el => {
       const item =  state.list.addItem(el.count, el.unit, el.ingredient);

       //console.log(item);
       listView.renderItem(item);
    });
    //console.log(state.list);
 };

 elements.shoppingList.addEventListener('click', e => {
    let id = e.target.closest('.shopping__item').dataset.itemid;
    //console.log("Ingredient uniqId: "+id);
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
       //delete from the state.list
        state.list.deleteItem(id);
       //delete from the UI
       listView.deleteItem(id);
    }else if(e.target.matches('.shopping__count-value')){
        let val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
 });



 //When the page loads

 window.addEventListener('load', () => {
    state.likes = new Likes(); 

    //read local storage
    state.likes.readLocalStorage();
    //Toggle like button
    likesView.toggleLikesMenu(state.likes.getNumLikes());

    //render existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
    
 })
 //LIKES controller
 
 const handleLike = () =>{

    if(!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;
    if(!state.likes.isLiked(currentId)){
        //user has not yet liked the current recipe
        //1. Add like to the state

        const newLike = state.likes.addLike(currentId, state.recipe.title, state.recipe.author, state.recipe.img);

        //console.log(state.likes);
        //2. Toggle the like button
        likesView.toggleLikeBtn(true);
        //3. Add like to UI list
        likesView.renderLike(newLike);
    }else{
        //user has liked the current recipe
        //1. Remove the like from state
        state.likes.deleteLike(currentId)

        //2. Toggle the Like button
        likesView.toggleLikeBtn(false);

        //3. Remove the like from UI List

        likesView.removeLike(currentId);
    }
    console.log('number of likes: '+state.likes.getNumLikes());
    likesView.toggleLikesMenu(state.likes.getNumLikes());
 };