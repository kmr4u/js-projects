import axios from 'axios';
import {apikey, proxy} from '../config';

export default class Recipe{
    constructor(id){
        this.id = id;
    }

   async getRecipe(){
       try{

        const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${apikey}&rId=${this.id}`);
        //console.log(res);

        this.title = res.data.recipe.title;
        this.author = res.data.recipe.publisher;
        this.img = res.data.recipe.image_url;
        this.source = res.data.recipe.source_url;
        this.ingredients = res.data.recipe.ingredients;

       }catch(error){
           console.log(error);
       }
   }

   calcTime(){
       //assuming we need 15 mins each 3 Ingredients
       const numIng = this.ingredients.length;
       const periods = Math.ceil(numIng/3);

       this.time = periods*15;
   }

   calcServings(){
       this.servings = 4;
   }

   parseIngredients(){
       const unitsLong = ['tablespoons', 'tablespoon', 'teaspoons', 'teaspoon', 'ounces', 'ounce', 'cups', 'pounds'];
       const unitsShort = ['tbsp', 'tbsp', 'tsp', 'tsp', 'oz', 'oz', 'cup', 'lb'];
       const units = [...unitsShort, 'kg', 'g']

       const newIngredients = this.ingredients.map(el => {
           //1. Uniform Units
           let ingredient = el.toLowerCase();

           unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
           });

           //console.log(ingredient);
           //2. Remove paranthesis
           ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

           //console.log(ingredient);

           const arrayIng = ingredient.split(' ');
           const unitIndex = arrayIng.findIndex(el2 => units.includes(el2));

           //console.log(arrayIng);
           let objIng;
           if(unitIndex > -1){
                //Theres is Unit
                //Ex: 4 1/2 cups => arrCount is 4, 1/2
                //Ex: 4 cups... => arrCount is 4
                const arrCount = arrayIng.slice(0, unitIndex); 

                let count;

                if(arrCount.length === 1){ //Ex.[4 ], cups of... or [4-1/2], cups of...
                    if(arrCount[0] !== ""){
                        count = eval(arrCount[0].replace('-', '+')); //eval(4-1/2) => 4.5
                    }
                    else count = 1;
                    
                }
                else{ //[1, 1/2], cups of..
                    count = eval(arrayIng.slice(0, unitIndex).join('+')); //eval(1+1/2)= 1.5
                }

                objIng = {
                    count,
                    unit: arrayIng[unitIndex],
                    ingredient: arrayIng.slice(unitIndex+1).join(' ')
                }

           }
           else if(parseInt(arrayIng[0], 10)){
                //There is no Unit but the first element is a number

                objIng = {
                    count : parseInt(arrayIng[0], 10),
                    unit: '',
                    ingredient: arrayIng.slice(1).join(' ')
                }
           }
           else{
               //There is no Unit and no number in the first position
               objIng = {
                   count: 1,
                   unit: '',
                   ingredient
               }
           }
           return objIng;
       });

       this.ingredients = newIngredients;
   }

   updateServings(type){

    const newServings = type === 'inc' ? this.servings+1 : this.servings-1;

    this.ingredients.forEach(ing => {
        ing.count *= newServings/this.servings;
    })

    this.servings = newServings;
   }

}

