//user id for profile page and login check
let user = "";

//Handlers || Contollers
function home(context) {
        fetch("https://recipes-1a392-default-rtdb.firebaseio.com/recipes.json")
        .then((response) => {return response.json()})
        .then(function (data) {
            data = Object.entries(data).map(arr=>arr[1]);
            context.recipes = data;
            if(user.length != 0){
                context.loggedIn = true;
            }else{
                context.loggedIn = false;
            }
            if(context.recipes.length != 0){
                context.hasRecipes = true;
            }else {
                context.hasRecipes = false;
            }
            context
            .loadPartials({
                header: "../views/header.hbs",
            })
            .then(function () {
                this.partial("./views/home.hbs", function (details) {
                console.log("went home!");
                if(context.loggedIn == true){
                    let welcome = document.getElementsByTagName('a')[1];
                    welcome.innerHTML+=user+"!";
                }
            });
        });
    });   
}

async function details(context) {
        let recipeID = this.params.id;
        context.id = recipeID;
        // console.log(recipeID);
        let recipeObj = await fetch(`https://recipes-1a392-default-rtdb.firebaseio.com/recipes/${recipeID}.json`)
        .then(function (response) {
            return JSON.stringify(response);
        })
        context.description = recipeObj.description;
        context.foodImageURL = recipeObj.foodImageURL;
        context.meal = recipeObj.meal;
        context.ingredients = recipeObj.ingredients;
        context.prepMethod = recipeObj.prepMethod;
        context.category = recipeObj.category;
        context.categoryImageURL = recipeObj.categoryImageURL;
        context.userID = user;
        context.creator = recipeObj.creator;
        context.likesCounter = recipeObj.likesCounter;
        if(context.creator == user){
            context.sameUser = true;
        }else {
            context.sameUser = false;
        }
        if(user.length != 0){
            context.loggedIn = true;
        }else{
            context.loggedIn = false;
        }
        
    context
    .loadPartials({
        header: "../views/header.hbs",
    })
    .then(function () {
        this.partial("./views/details.hbs", function (details) {
            console.log("went to details!");
        });
    });

    
}

function footer(context) {
    context
    .loadPartials({
        header: "../views/header.hbs",
    })
    .then(function () {
        this.partial("./views/footer.hbs", function (details) {
            console.log("went to profile!");
        });
    });
    // let furniture = [
    // 	{
    // 		id: "-MjuM5NtwLEGafDenhIP",
    // 		imageUrl: "image",
    // 		description: "words",
    // 		year: 10,
    // 	},
    // ];
    // fetch("https://routing-lab-6734f-default-rtdb.firebaseio.com/furniture.json")
    // .then(function (response) {
    //     console.log(response);
    //     return response.json();
    // })
    // .then(function (data) {
    //     // get the template as a handlebars string
    //     console.log(data);
        
    //     //take data and turn it into an array of objects
    //     let furnitureArray = Object.entries(data);
        
    //     console.log(furnitureArray);
    //     //[ [furnitureID,object],[furnitureID,object],[furnitureID,object]]
    //     //[object,object,object]
    //     furnitureArray = furnitureArray
    //         .map(function(innerArray){
    //             let [furnitureID,furnitureObject] =innerArray;
    //             furnitureObject.id = furnitureID;
    //             return furnitureObject;
    //         })
    //         .filter(function(object){
    //             return user== object.userID;
    //         });
       
    //     console.log(furnitureArray);
    //     context.furniture = furnitureArray;
    //     if(user.length != 0){
    //         context.loggiedIn =true;
    //     }else{
    //         context.loggiedIn =false;
    //     }
    //     context
    //     .loadPartials({
    //         header: "../views/header.hbs",
    //     })
    //     .then(function () {
    //         this.partial("./views/profile.hbs", function (details) {
    //             console.log("went profile!");
    //         });
    //     });
    // })
    // .catch((err) => {
    //     console.log(err);
    //     //change html to show an error has occured
    // });    
}


function deleteItem(context) {
    // let furnitureID = this.params.id;
    // let url = `https://routing-lab-6734f-default-rtdb.firebaseio.com/furniture/${furnitureID}.json`;
    //     let headers = {
    //         method: "DELETE", // *GET, POST, PUT, DELETE, etc.
    //     };
    //     console.log(url);
    //     fetch(url, headers)
    //         .then(function (response) {
    //             console.log(response.status);
    //             if(response.status == 200){
    //                 context.redirect('#/profile');
    //             }
    //             //check the response for 200
    //             //show that it worked in the notifications,
    //             //probably need to reload the template
    //         })
    //         .catch(function (error) {
    //             console.log("error");
    //             //notifications show error
    //         });
}

function getShareRecipePage(context) {
    context
    .loadPartials({
        header: "../views/header.hbs",
    })
    .then(function () {
        this.partial("./views/share.hbs", function (details) {
            console.log("went to share recipe page!");
        });
    });
}

function shareRecipe(context) {
    //auth token - "32ce8cc1-4c19-438a-b47c-7870e19325fb.zFfuO8jpL2t9CTv87ZiL4OeG7I6H/2RJ7sUeGzXO9t0="
    let categoryImageObj = {
        "Vegetables and legumes/beans": "https://cdn.pixabay.com/photo/2017/10/09/19/29/eat-2834549__340.jpg",
        "Fruits": "https://cdn.pixabay.com/photo/2017/06/02/18/24/fruit-2367029__340.jpg",
        "Grain Food": "https://cdn.pixabay.com/photo/2014/12/11/02/55/corn-syrup-563796__340.jpg",
        "Milk, cheese, eggs and alternatives": "https://image.shutterstock.com/image-photo/assorted-dairy-products-milk-yogurt-260nw-530162824.jpg",
        "Lean meats and poultry, fish and alternatives": "https://t3.ftcdn.net/jpg/01/18/84/52/240_F_118845283_n9uWnb81tg8cG7Rf9y3McWT1DT1ZKTDx.jpg"
    }
    let meal = this.params.meal;
    let ingredients = this.params.ingredients;
    ingredients = ingredients.split(", ");
    context.ingredients = JSON.stringify(ingredients);
    let prepMethod = this.params.prepMethod;
    let description = this.params.description;
    let foodImageURL = this.params.foodImageURL;
    let category = this.params.category;
    let categoryImageURL = categoryImageObj[category];
    fetch("https://recipes-1a392-default-rtdb.firebaseio.com/recipes", {
        mode: "no-cors",
        method: "POST",
        body: JSON.stringify({
            meal,
            ingredients,
            prepMethod,
            description,
            foodImageURL,
            category,
            categoryImageURL,
            likesCounter: 0
        })
    })
    .then(()=>{
        setTimeout(()=>{
            context.redirect("#/home");
        }, 2000)
    })
}