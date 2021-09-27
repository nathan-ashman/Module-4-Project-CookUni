//user id for profile page and login check
let user = "";

//Handlers || Contollers
function home(context) {
        fetch("https://recipes-1a392-default-rtdb.firebaseio.com/recipes.json")
        .then((response) => {return response.json()})
        .then(function (data) {
            let recipeIDs = Object.entries(data).map(arr=>arr[0]);
            data = Object.entries(data).map(arr=>arr[1])
            let i = 0;
            data.forEach(obj=>{
                obj.id = recipeIDs[i];
                i++;
            })
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

function getLoginPage(context) {
    context
      .loadPartials({
        header: "../views/header.hbs",
      })
      .then(function () {
        this.partial("./views/login.hbs", function (details) {
          console.log("went to login!");
        });
      });
}

function login(context) {
    //pulls in the login post information
    //then validates if the user can log in or not
    //if successful redirect to the profile page
    let username = this.params.username;
    let password = this.params.password;
    
    document.getElementById("successBox").style.display = "none";
    document.getElementById("errorBox").style.display = "none";
    document.getElementById("successBox").style.innerHTML = "";
    document.getElementById("errorBox").style.innerHTML = "";
    document.getElementById("loadingBox").style.display = "block";
    fetch("https://recipes-1a392-default-rtdb.firebaseio.com/users.json").then((response) => {
          return response.json();
        }).then((usersObj) => {
          let ids = Object.keys(usersObj);
          let usernames = Object.values(usersObj).map(obj=>obj.username);
          let passwords = Object.values(usersObj).map(obj=>obj.password);
          let foundUsername = usernames.find((user) => {
            return user == username;
          });
          let foundPassword = passwords.find((pass) => {
            return pass == password;
        })
        let usernameIndex = usernames.indexOf(foundUsername);
        let userid = ids[usernameIndex];
        if(foundUsername && foundPassword){
          fetch(
            "https://recipes-1a392-default-rtdb.firebaseio.com/loggedin.json",
            {
              method: "POST",
              body: JSON.stringify({
                username,
                password
              }),
            }
          ).then((response) => {
              document.getElementById("loadingBox").style.display = "block";
              document.getElementById("successBox").style.display = "block";
              //user = userid;
              user=username;
              setTimeout(()=>{
                context.redirect("#/home");
              }, 3000);
            })
            .catch((err) => {
              document.getElementById("successBox").style.innerHTML =
                err.description;
              document.getElementById("successBox").style.display = "block";
            });
        }
      });
  }

  function getRegisterPage(context) {
    //document.getElementById('notifications').style.display = "none";
    //pulls in the login post information
    //then validates if the user can log in or not
    //if successful redirect to the profile page
    context
      .loadPartials({
        header: "../views/header.hbs",
      })
      .then(function () {
        this.partial("./views/register.hbs", function (details) {
          console.log("went to register!");
        });
      });
  }
  function register(context) {
    //pulls in the register post information
    //then validates if the user can create an account or not
    //if successful redirect to the home page || loginpage
    let username = this.params.username;
    let password = this.params.password;
    let firstName = this.params.firstName;
    let lastName = this.params.lastName;
    document.getElementById("successBox").style.display = "none";
    document.getElementById("errorBox").style.display = "none";
    document.getElementById("successBox").style.innerHTML = "";
    document.getElementById("errorBox").style.innerHTML = "";
    //document.getElementById('loadingBox').style.display = "block";
    fetch("https://recipes-1a392-default-rtdb.firebaseio.com/users.json", {
      mode: "no-cors",
    })
      .then((response) => {
        return response;
      })
      .then(async (usersObj) => {
        let usernames = Object.keys(usersObj);
        let foundUsername = usernames.find((user) => {
          return user == username;
        });
        if (!foundUsername) {
          await fetch(
            "https://recipes-1a392-default-rtdb.firebaseio.com/users.json",
            {
              mode: "no-cors",
              method: "POST", // *GET, POST, PUT, DELETE, etc.
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
              }),
            }
          )
            .then((response) => {
              document.getElementById("loadingBox").style.display = "block";
              document.getElementById("successBox").style.innerHTML =
                "User registration successful.";
              document.getElementById("successBox").style.display = "block";
              context.redirect("#/login");
            })
            .catch((err) => {
              document.getElementById("successBox").style.innerHTML =
                err.description;
              document.getElementById("successBox").style.display = "block";
            });
        }
      });
  }
async function details(context) {
        let recipeID = this.params.id;
        context.id = recipeID.substr(1);
        let recipeObj = await fetch(`https://recipes-1a392-default-rtdb.firebaseio.com/recipes/${context.id}.json`)
        .then((response)=>{
            return response.json()
        })
        context.description = recipeObj.description;
        context.foodImageURL = recipeObj.foodImageURL;
        context.meal = recipeObj.meal;
        context.ingredients = recipeObj.ingredients;
        context.prepMethod = recipeObj.prepMethod;
        context.category = recipeObj.category;
        context.categoryImageURL = recipeObj.categoryImageURL;
        context.userID = user;
        context.originalPoster = recipeObj.originalPoster;
        context.likesCounter = recipeObj.likesCounter;
        if(context.originalPoster == user){
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
            if(context.loggedIn == true){
                let welcome = document.getElementsByTagName('a')[1];
                welcome.innerHTML+=user+"!";
            }
            
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
        this.partial("./views/share.hbs", function (details) {
            console.log("went to share recipe page!");       
            if(context.loggedIn == true){
                let welcome = document.getElementsByTagName('a')[1];
                welcome.innerHTML+=user+"!";
            }
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
    fetch("https://recipes-1a392-default-rtdb.firebaseio.com/recipes.json", {
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
            likesCounter: 0,
            originalPoster: user
        })
    })
    .then(()=>{
        setTimeout(()=>{
            context.redirect("#/home");
        }, 2000)
    })
}

function getEditPage(context) {
    // if(user.length != 0){
    //     context.loggedIn = true;
    // }else{
    //     context.loggedIn = false;
    // }
    context
    .loadPartials({
        header: "../views/header.hbs",
    })
    .then(function () {
        this.partial("./views/edit.hbs",()=>{
            console.log("went to edit page!");
            if(context.loggedIn == true){
                let welcome = document.getElementsByTagName("a")[1];
                welcome.innerHTML+=user+"!";
            }
            let recipeID = context.params.id;
            context.id = recipeID.substr(1);
            fetch(`https://recipes-1a392-default-rtdb.firebaseio.com/recipes/${context.id}.json`).then((response)=>{
                return response.json();
            }).then((recipeObj)=>{
              let originalProperties = Object.keys(recipeObj);
              let textFields = document.querySelectorAll('.edit');
              let categories = document.querySelector('select');
              console.log(textFields);
              textFields.forEach(tf=>{
                  let match = originalProperties.find(prop=>prop==tf.name);
                  tf.value = recipeObj[match];
              })
              categories.firstElementChild.innerHTML = recipeObj["category"];
            })  
        })
    })
}

async function edit(context) {
    // let recipeID = context.params.id;

    // context.id = recipeID.substr(1);
    // console.log(context);
    // let description = document.getElementById('defaultRecepieEditDescription').value;
    // let foodImageURL = document.getElementById('defaultRecepieEditFoodImageURL').value;

    // let meal = document.getElementById('defaultRecepieEditMeal').value;

    // let ingredients = document.getElementById('defaultRecepieEditIngredients').value;

    // let prepMethod = document.getElementById('defaultRecepieEditMethodOfPreparation').value;

    // let category = document.querySelector('select').value;

    // let categoryImageURL = context.params.categoryImageURL;
    // let originalPoster = context.params.originalPoster;
    // let likesCounter = context.params.likesCounter;

    // fetch(`https://recipes-1a392-default-rtdb.firebaseio.com/${recipeID.substr(1)}.json`, {
    //   method: "POST",
    //     body: JSON.stringify({
    //       description,
    //       foodImageURL,
    //       meal,
    //       ingredients,
    //       prepMethod,
    //       category,
    //       categoryImageURL,
    //       originalPoster,
    //       likesCounter
    //     }),
    // })
}