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
	this.get("#/share", shareRecipe);
	//this.post("#/create", createPost);

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
        //document.getElementById('notifications').style.display = "none";
		//pulls in the login post information
		//then validates if the user can log in or not
		//if successful redirect to the profile page
        let username = this.params.username;
        let password = this.params.password;
        document.getElementById('loadingBox').style.display = "block";
        fetch("https://baas.kinvey.com/user/kid_HyVrMGSZt", {
            method: "GET",
            headers: {
                "Authorization": "Basic ZWRwNDQ1OmN1cGNha2U="
            }
        })
        .then(response=>{
            return response.json()
        })
        .then(users=>{
                // let userArray = Object.entries(users);
                let hasUser = users.find(user=>{
                    return user.username == username;
                });

                if(hasUser != undefined){
                    //check the password
                    if(hasUser.pass == password){
                    //logged In!!!!
                        user = hasUser.username;
                        document.getElementById('successBox').style.display = "block";
                        setTimeout(()=>{
                            context.redirect('#/home');
                        }, 3000);
                    }else{
                        //send error to the front end
                        document.getElementById('errorBox').style.display = "block";
                    }
                }

            })
            .catch(err=>{
                console.log(err);
            })
	});
	// //register
	this.get("#/register", function (context) {
		//get the login page
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
	// this.post("#/register", function (context) {
	// 	//pulls in the register post information
	// 	//then validates if the user can create an account or not
	// 	//if successful redirect to the home page || loginpage
    //     let username = this.params.username;
    //     let password = this.params.password;

    //     fetch("https://routing-lab-6734f-default-rtdb.firebaseio.com/users.json")
    //         .then(response=>{
    //             return response.json()
    //         })
    //         .then(users=>{
    //             let userArray = Object.entries(users);
    //             console.log(users);
    //             let hasUser = userArray.find(user=>{
    //                 let [userID,userObj] = user;
    //                 return userObj.username == username;
    //             });

    //             if(hasUser== undefined){

    //                 //add the new user
    //                 let url = "https://routing-lab-6734f-default-rtdb.firebaseio.com/users.json";
    //                 let headers = {
    //                     method: "POST", // *GET, POST, PUT, DELETE, etc.
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                     },
    //                     body: JSON.stringify({
    //                         username,
    //                         password
    //                     }),
    //                 };
    //                 fetch(url,headers)
    //                     .then(response=>{
    //                         if( response.status== 200){
    //                             context.redirect('#/login');
    //                         }
    //                     });
                   

    //             }else{
    //                 //send error to the front end
    //                 document.getElementById("username").classList.add("is-invalid");
    //             }

    //         })
    //         .catch(err=>{
    //             console.log(err);
    //         })
	// });
	// //logout
	// this.get("#/logout", function (context) {

    //     user="";
    //     context.redirect('#/home');

    // });
});

(() => {
	app.run("#/home");
})()
   