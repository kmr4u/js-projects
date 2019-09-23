
//https://www.food2fork.com/api/search
//https://www.food2fork.com/api/get
import axios from 'axios';
import {apikey, proxy} from '../config';
export default class Search{
    constructor(query){
        this.query = query;
    }

    async getResults(){
        
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