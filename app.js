const app = Sammy("#rooter", function () {
  this.use("Handlebars", "hbs");

  // Home
  this.get("#/home", home);
  // Details
  this.get("#/details/:id", details);
  // Profile
  this.get("#/footer", footer);
  //this.get("#/delete/:id", deleteItem);

  // Create
  this.get("#/share", getShareRecipePage);
  this.post("#/share", shareRecipe);

  //login
  this.get("#/login", function (context) {
    //get the login page
    context
      .loadPartials({
        header: "../views/header.hbs",
      })
      .then(function () {
        this.partial("./views/login.hbs", function (details) {
          console.log("went to login!");
        });
      });
  });
  this.post("#/login", function (context) {
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
  });

  // //register
  this.get("#/register", function (context) {
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
  });
  this.post("#/register", function (context) {
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
  });
  // //logout
  // this.get("#/logout", function (context) {

  //     user="";
  //     context.redirect('#/home');

  // });
});

(() => {
  app.run("#/home");
})();
