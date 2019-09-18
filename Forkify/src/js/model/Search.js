//https://www.food2fork.com/api/search
//https://www.food2fork.com/api/get
import axios from 'axios';
export default class Search{
    constructor(query){
        this.query = query;
    }

    async getResults(){
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const apikey = '0eca13afea21c9baa21d7ae0ffa3b05f';
        try{
            const response = await axios(`${proxy}https://www.food2fork.com/api/search?key=${apikey}&q=${this.query}`);
            this.recipes = response.data.recipes;
            //console.log(this.recipes);
            //return this.recipes;
        }catch(error){
            console.log(error);
        }
    }
}