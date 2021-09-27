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

  // Create
  this.get("#/edit/:id", getEditPage);
  // this.post("#/edit/:id", edit);
  //login
  this.get("#/login", getLoginPage);
  this.post("#/login", login);

  // //register
  this.get("#/register", getRegisterPage);
  this.post("#/register", register);
  // //logout
  this.get("#/logout", function (context) {
      user="";
      context.redirect('#/home');
  });
});

(() => {
  app.run("#/home");
})();
