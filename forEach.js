// var myData = function(name, job, age){

// 	this.name = name;
// 	this.job = job;
// 	this.age = age;
// 	this.gender = "male";
// };

// // myData.prototype.forEach = function() {
	
// // };
// myData.prototype = {
// 	forEach:function(func){
// 		for(var i = 0; i < Object.keys(this).length; i++){
// 			func(Object.keys(this)[i], this);
// 		}
// 	}
// }

// var myArray = [];
// var kareem = new myData("kareem shousha", "devoloper", 20);

// kareem.forEach(function(curKey){
// 	console.log(kareem.curKey);
	
// });
// console.log(kareem.name, myArray);

var date = new Date();
console.log(date.getFullYear(), date.toLocaleString("default", { month: "long" }));