var budgetContoller = (function(){

    var Expense = function(id, desc, val){
        this.id = id;
        this.description = desc;
        this.value = val;
    };
    Expense.prototype.share = function(totatlIncome){

        if(totatlIncome > 0)
            this.percentage = Math.round((this.value/totatlIncome)*100);
        else
            this.percentage = -1;
    };
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };
    var Income = function(id, desc, val){
        this.id = id;
        this.description = desc;
        this.value = val
    };

    var data = {
       allItems: {
           inc: [],
           exp: []
       },
       totals: {
           inc: 0,
           exp: 0
       },
       budget: 0,
       percentage: -1
    };

    var calculateTotal = function(type){
        var sum=0;
        data.allItems[type].forEach(function(elem){
            sum += elem.value;
        })
        data.totals[type] = sum;

    };

    //public method to add items in to  data obj

    return {
        addItem: function(type, desc, val){
            var newItem, ID;

            if(data.allItems[type].length >0){
                ID = data.allItems[type][data.allItems[type].length-1].id + 1; //incremnt 1 to the id of the previously stored item in the array
            }else{
                ID = 0; //first item in the array
            }
            
            if(type === 'exp'){
                newItem = new Expense(ID, desc, val);
            }else if(type === 'inc'){
                newItem = new Income(ID, desc, val);
            }

            data.allItems[type].push(newItem);

            return newItem;
        },
        printData: function(){
            console.log(data);
        },

        calculateBudget: function(){
            calculateTotal('exp');
            calculateTotal('inc');

            data.budget = data.totals.inc - data.totals.exp;

            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
            }else{
                data.percentage = -1;
            }
            
        },
        calculatePercentages: function(){
            data.allItems.exp.forEach(function(cur){
                cur.share(data.totals.inc);
            })

        },
        getPercentages: function(){
          var allPerc =   data.allItems.exp.map(function(cur){
               return cur.getPercentage();
            });
          return allPerc;
        },
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        deleteItem: function(id, type){
            var items, index;

            //ex: item-id=6
            //data.allItems[type][id] -> cannot use
            //[1, 2, 4, 6, 8]
            //index = 3
            items = data.allItems[type].map(function(elem){
                return elem.id; //ids of all the elements currently present in the array
            })

            index = items.indexOf(id); //index of the item id

            if(index !== -1){
                data.allItems[type].splice(index, 1); //delete one item at the idex from the type array
            }
        }
    }

})();

var UIController = (function(){
    var DOMSTRINGS = {
        type: '.add__type',
        desc: '.add__description',
        val: '.add__value',
        button: '.add__btn',
        income_list: '.income__list',
        expense_list: '.expenses__list',
        budgetLable: '.budget__value',
        incomeLable: '.budget__income--value',
        expenseLable: '.budget__expenses--value',
        percentageLable: '.budget__expenses--percentage',
        container: '.container',
        expPercLable: '.item__percentage',
        monthLable: '.budget__title--month'
    };

    var nodeListForEach = function(list, callback){
        for(var i=0; i<list.length; i++){
            callback(list[i], i);
        }
    }

    var formatNumber= function(num, type){
        var numSplit, int, dec, sign;
        /** + or - before the number
         * thosand separator
         * exactly 2 decimal points
         */
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];
        dec = numSplit[1];

        if(int.length > 3){
            int = int.substr(0, int.length-3)+','+int.substr(int.length-3, 3);
        }

        return (type === 'exp' ?  '-' : '+')+' '+int+'.'+dec;
    };
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMSTRINGS.type).value, //will be either inc or exp
                description: document.querySelector(DOMSTRINGS.desc).value,
                value: parseFloat(document.querySelector(DOMSTRINGS.val).value)
            }
            
        },
        getDomStrings: function(){
            return DOMSTRINGS; //passing the private around through a public method
        },

        addListItem: function(item, type){
            var html, newhtml, element;

            //store the html in a variable with place holders for values that can be set dynamically

            if(type === 'inc'){
                element = DOMSTRINGS.income_list;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type === 'exp'){
                element = DOMSTRINGS.expense_list;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace the placeholders with actual values

            newhtml = html.replace('%id%', item.id);
            newhtml = newhtml.replace('%description%', item.description);
            newhtml = newhtml.replace('%value%', formatNumber(item.value, type));

            //Insert html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newhtml);

        },

        deleteListItem: function(selectorId){ //inc-0, exp-1 etc
            var elem = document.getElementById(selectorId);
            elem.parentNode.removeChild(elem);
        },

        clearInputs: function(){
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMSTRINGS.desc+', '+DOMSTRINGS.val); //returns a list
            fieldsArr = Array.prototype.slice.call(fields); //converts list to array

            //clear the inputs
            //fieldsArr[0].value = "";
            //fieldsArr[1].value = "";
            fieldsArr.forEach(function(element, index, arr) {
                element.value = "";   
            });
           

            fieldsArr[0].focus();
        },
        displayBudget: function(obj){
            var type;
            type = obj.budget > 0 ? 'inc':'exp';
            document.querySelector(DOMSTRINGS.budgetLable).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMSTRINGS.incomeLable).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMSTRINGS.expenseLable).textContent = formatNumber(obj.totalExp, 'exp');
            if(obj.percentage > 0){
                document.querySelector(DOMSTRINGS.percentageLable).textContent = obj.percentage;
            }else{
                document.querySelector(DOMSTRINGS.percentageLable).textContent = '---';
            }
            
        },
        displayExpPercentages: function(percentages){
            
            var fields = document.querySelectorAll(DOMSTRINGS.expPercLable);

            
            nodeListForEach(fields, function(cur, index){

                if(percentages[index]> 0){
                    cur.textContent = percentages[index]+'%';
                }else{
                    cur.textContent = '---';
                }
            })


        },
        displayMonth: function(){
            var now, month, months;
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            now = new Date();
            month = now.getMonth(); //integer. indexed from 0;

            document.querySelector(DOMSTRINGS.monthLable).textContent = months[month]+' '+now.getFullYear();

        },
        changeLayout: function(){
            
            var fields;
            fields = document.querySelectorAll(DOMSTRINGS.type+', '+DOMSTRINGS.desc+', '+DOMSTRINGS.val);            
            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });
            
            document.querySelector(DOMSTRINGS.button).classList.toggle('red');
        }

    };

})();


var controller = (function(budgetCntrl, uiCntrl){

    var setUpEventListeners = function(){
        
        var DOMSTRINGS = uiCntrl.getDomStrings();
        
        document.querySelector(DOMSTRINGS.button).addEventListener('click', handleInput);
        
        document.addEventListener('keypress', function(event){ //Handle the Enter key press event
        
            if(event.keyCode === 13 || event.which === 13) //KeyCode=13 for Enter key
            {
                handleInput();
            }
        });

        document.querySelector(DOMSTRINGS.container).addEventListener('click', handleDelete);

        document.querySelector(DOMSTRINGS.type).addEventListener('change', uiCntrl.changeLayout);
    };
    var updateBudget = function(){
        //calculate budget
        budgetCntrl.calculateBudget();
 
        //return the budget and store in the UI
 
        var budget = budgetCntrl.getBudget();
        //return budget

        //display budget on the UI
        uiCntrl.displayBudget(budget);
        
    };

    var updateExpPercentages = function(){
        var expPerc;
        //calculate the percentages

        budgetCntrl.calculatePercentages();
        expPerc = budgetCntrl.getPercentages();

        //console.log(expPerc);
        uiCntrl.displayExpPercentages(expPerc);

    }
    var handleInput = function(){
        
        var input = uiCntrl.getInput();
       // console.log(input);
        if(input.description !== '' && !isNaN(input.value) && input.value >0){ //Ensuring a valid input
            var newItem = budgetCntrl.addItem(input.type, input.description, input.value);
            
            //console.log(newItem);
            
            //budgetCntrl.printData();
            
            uiCntrl.addListItem(newItem, input.type);
            
            uiCntrl.clearInputs();
            
           updateBudget();

           updateExpPercentages();
            //console.log(budget);

        };
    };

    var handleDelete = function(event){
        var itemID, splitArr, ID, type;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; //exp-1, inc-0 etc

        //console.log(itemID);
        if(itemID){
            splitArr = itemID.split('-');
            type = splitArr[0];
            ID = parseInt(splitArr[1]);

            budgetCntrl.deleteItem(ID, type);
            uiCntrl.deleteListItem(itemID);
            updateBudget();

            updateExpPercentages();
        }
        
        //delete item from the data structure
        //delte item from the UI
        //update and display new budget
    };

    return {
        init: function(){
            uiCntrl.displayMonth();
            uiCntrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setUpEventListeners();
        }
    }

})(budgetContoller, UIController);

controller.init();