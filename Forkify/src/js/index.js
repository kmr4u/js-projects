
import Search from './model/Search'
import * as searchView from './view/searchView'
import {elements, renderLoader, clearLoader} from './view/base'

const state = {};
const handleSearch = async () => {

    const query = searchView.getInput();
    if(query){
        state.search = new Search(query);

        searchView.clearSearch();
        searchView.clearResults();

        renderLoader(elements.results);
        await state.search.getResults();

        //console.log(state.search.recipes);
        clearLoader();
        searchView.renderResults(state.search.recipes);
    }
}
elements.searchForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    handleSearch();
})