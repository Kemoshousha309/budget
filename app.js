// /*****************************
// module pattren 
// */

// // this is called module pattren 

// var budgetController = (function (){

// 	var x = 23;

//     function add(a) {
//     	return x + a;
//     }
//      // this code can't be access from out scope but the returned object  can access them 
//     // thanks of closure

//     // console.log('shaker');
//     // inside the module you can access to out side not the oppiste so you can print "shaker"
//     return {
//     	test: function(b){
//     		// console.log(add(b));
//     		return add(b);
//     	}
//     }	
//     // this module just return this object
// })();

// var UIcontroller = (function (){
// 	//some code
// })();

// var controller = (function (budctr){

// 	var z = budctr.test(6);
// 	// when you do this and the test method is printing you will show the result of the 
// 	// variable z on the console 

// 	return {
// 		include: function (){
// 			console.log(z);
// 		}
// 	}

// })(budgetController);


/******************************
our real project "budget"
*/

// this is called module pattren 

var budgetController = (function (){
	
    var Expenses = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expenses.prototype = {
        calcpercent: function(totalInc){
            if(totalInc > 0){
            this.percentage = Math.floor((this.value/totalInc) * 100);
            }
        }
    }

    var Incomes = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calcTotals = function(type){
        var total = 0;
        data.allItems[type].forEach(function(cur){
            total += cur.value;
        })
        data.totals[type] = total;
    }

    var data = {

        allItems:{
            exp: [],
            inc: []
        },
        totals: {
            exp:0,
            inc:0
        },
        budget:0,
        percentage: 0
    };


     
    return{

        addItem: function(ty, des, val){

            var newItem;

            //set an id number
            if(data.allItems[ty].length > 0){
             id = data.allItems[ty][data.allItems[ty].length-1].id + 1
            }else{
                id = 0;
            }

            //dicide the type of instaniation
            if(ty === "exp"){

                newItem = new Expenses(id, des, val);
            }else{
                newItem = new Incomes(id, des, val);               
            }

            // add the item to our data structure

            data.allItems[ty].push(newItem);

            return newItem;

        },

        exPercentages: function(){

            data.allItems.exp.forEach(function(cur){
                cur.calcpercent(data.totals.inc);
            })
        },

        getexPercentages: function(){

            var percentages = data.allItems.exp.map(function(cur){
                return cur.percentage;
            });
            return percentages;
        },

        calculateBudget: function(){
            
            // calculate the total inc and exp
            calcTotals("exp");
            calcTotals("inc");
            
            // calculate the budget
            var budget = Math.abs(data.totals["inc"] - data.totals["exp"]);
            data.budget = budget;

            // calctlate the percentage
            if(data.totals["inc"] !== 0){
            var percentage = Math.round((data.totals["exp"] / data.totals["inc"]) * 100);
            }else{
                var percentage = -1;
            }
            data.percentage = percentage;
        },

        delete: function(type, id){
            var ids, index;

            // map function that's just like the for each one but return an array of an ittrable
            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);
            // this the object index in the original array

            // delete from data structure by splice method
            data.allItems[type].splice(index, 1);


        },

        budgetProperties: function(){
            return{
                budget:data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            }
        },

        dataTest: function(){
            return data;
        }
        
    }


})();



var UIcontroller = (function (){
	
    var DomStrings = {
         type: ".add__type",
         description: ".add__description",
         value: ".add__value",
         inputbtn:".add__btn",
         expensescontainer:".expenses__list",
         incomescontainer:".income__list",
         budgetValue:".budget__value",
         incomeValue:".budget__income--value",
         expensesValue:".budget__expenses--value",
         percentageValue:".budget__expenses--percentage",
         container:".container",
         expPercentage:".item__percentage",
         month: ".budget__title--month"
    };
     var listNodeForEach = function(list, callback){
                for(var i = 0; i < list.length; i++){
                    callback(list[i], i);
                }
            };

    var numFormating = function(num, type){
        var number, int, dec, arType;

        number = num.toFixed(2);
        // this method produce the string so i don't need the next line
        // number = String(number)
        number = number.split(".");
        int = number[0];
        dec = number[1];

        function format(int){
            var rest = int;
            var digets =[];
        while(true){
            formated = rest.substr(0, 3);
            digets.push(formated);
            rest = rest.replace(formated, "")
            if(!rest){break}
            }
            return digets.join();
        }
        if(type == "equal"){
            arType = "";
        }else if (type == "inc"){
            arType = "+";
        }else{
            arType = "-";
        }
        return arType + format(int) + "." + dec

    };
    function decideType(obj){
        var type;
        if (obj.totalInc == obj.totalExp){type = "equal"}
        else if (obj.totalInc > obj.totalExp){type = "inc"}
        else{type = "exp"}
        return type
    };

    return {
        // create a property to store the input in a object
        input: function(){
            return{
                 type: document.querySelector(DomStrings.type).value,
                 description: document.querySelector(DomStrings.description).value,
                 value: parseFloat(document.querySelector(DomStrings.value).value)
                        // to convert the value string into the diget   
            }
        },

        addListItem: function(type, obj){
            // get html content and mark the placeholder
            var html, newHtml, element;
            if (type === "inc"){
                element = document.querySelector(DomStrings.incomescontainer);
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            }else{
                element = document.querySelector(DomStrings.expensescontainer);
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // replace the placeholder by string replace method
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", numFormating(obj.value, type));

            // add to adjecent html
            element.insertAdjacentHTML("beforeend", newHtml);
        },

        displayExPercentage: function(pers){

            var feilds = document.querySelectorAll(DomStrings.expPercentage);

            // let's create our forEach function that take the feilds and call back func that select 
            // the  current and its index each loop 

           

            listNodeForEach(feilds, function(cur, index){
                 if(pers[index] > 0){
                cur.textContent = pers[index] + "%";
                }else{
                cur.textContent = "---";
                }
            });
               
            



        },

        clearFields: function(){
            var fields, arrFields;

            // get the fields i want to empty       her we put the string that represnt the css selctor
            fields = document.querySelectorAll(DomStrings.description + ", " + DomStrings.value);

            // the previous line return the something called Nodelist we want to change it into an array
            arrFields = Array.prototype.slice.call(fields);
            // here we call the slice method from the array prototype then pass it to the fields nodelist 
            // the slice method covert the fields into the array that is stored in the arrfields variable

            // current is the item , index is the index of the array, array is the entire array
            arrFields.forEach(function(current, index, array){
                current.value = "";
            }); 
            arrFields[0].focus();


        },

        deleteItem: function(id){
            var parent, child;
            // to remove the element you should use removeChild method but it delete only the child element
            child = document.getElementById(id);
            parent = document.getElementById(id).parentNode;
            parent.removeChild(child);

        },

        displayBudget: function(obj){
            document.querySelector(DomStrings.budgetValue).textContent = numFormating(obj.budget, decideType(obj));
            document.querySelector(DomStrings.incomeValue).textContent = numFormating(obj.totalInc, "inc");
            document.querySelector(DomStrings.expensesValue).textContent = numFormating(obj.totalExp,"exp");

            if (obj.percentage > 0){
                document.querySelector(DomStrings.percentageValue).textContent = obj.percentage +"%";

            }else{
                document.querySelector(DomStrings.percentageValue).textContent = "---";

            }
        },
        displayDate: function(){
            var date = new Date();
            var curMonth = date.toLocaleString("default", { month: "long" });
            var curYear = date.getFullYear();
            document.querySelector(DomStrings.month).textContent = curMonth +" " + curYear;

        },
        toggleInputStyle: function(){
            var fields = document.querySelectorAll(
                DomStrings.type + ","+
                DomStrings.description + ","+
                DomStrings.value);
            
            listNodeForEach(fields, function(cur){
                cur.classList.toggle("red-focus")
            });
            document.querySelector(DomStrings.inputbtn).classList.toggle("red");

        },

        DomStrings: function(){
           return DomStrings;
        }
    }


})();


var controller = (function (budctr, UIctr){

    var DomStrings = UIctr.DomStrings();
    var budget = budctr.budgetProperties();

    // to control in the add item setting

    var budgetUpdate = function(){
        // calculate the budget
        budctr.calculateBudget();
        // return the budget 
        budget = budctr.budgetProperties();
        // update the UI
        UIctr.displayBudget(budget);

    }
    var ctrAddItem = function (){
        // to-do list
        // 1-get input values
        var input = UIctr.input();
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){

        // add item to our data structure
        var newItem = budctr.addItem(input.type, input.description, input.value);

        // // view the stored item in the data structure
        // console.log(budctr.dataTest().allItems[input.type]);
        
        // add a new item into the UI
        UIctr.addListItem(input.type, newItem);

        // clear the input fields 
        UIctr.clearFields();

        }
        // Update and calculate the budget
        budgetUpdate();

        updatePrecentages();

    }
	
    // to listen to the events and invoke a function 
    var setUpEventListener = function(){
            document.querySelector(DomStrings.inputbtn).addEventListener("click",ctrAddItem)
            document.addEventListener("keypress",function(event){

                if(event.keyCode === 13 || event.which === 13){
                ctrAddItem();
                }
            })

            document.querySelector(DomStrings.container).addEventListener("click", ctrDeleteItem);
            document.querySelector(DomStrings.type).addEventListener("change", UIctr.toggleInputStyle);
    }

    var updatePrecentages = function(){

        // calculate the income precentages
        budctr.exPercentages();
        //get the update from the budget controller 
        var percentages = budctr.getexPercentages();
        // update the UI
        UIctr.displayExPercentage(percentages);
    }

    var ctrDeleteItem = function(event){
        var itemId, spliter, type, id;
        // what event targets ,then we get the id of the container by parent node method
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemId){

        spliter = itemId.split("-");
        type = spliter[0];
        id = parseInt(spliter[1]);
        console.log(type, id);

        }

        // remove the item form data structure 
        budctr.delete(type, id);

        // update the UI item 
        UIctr.deleteItem(itemId);

        // udate the UI budget
        budgetUpdate();

        updatePrecentages();

    }


    return {
        init: function(){
            console.log("app has started!");
            // budget:data.budget,
            // percentage: data.percentage,
            // totalInc: data.totals.inc,
            // totalExp: data.totals.exp

            // UIctr.displayBudget({
            //     budget:0,
            //     percentage: -1,
            //     totalInc: 0,
            //     totalExp: 0
            // });
            UIctr.displayDate();
            UIctr.displayBudget(budget);

            setUpEventListener();
        }
    }




})(budgetController, UIcontroller);



controller.init();

