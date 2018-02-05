// See https://firebase.google.com/docs/web/setup#project_setup for how to
// auto-generate this config
var config = {
    apiKey: "apiKey",
    authDomain: "projectId.firebaseapp.com",
    databaseURL: "https://databaseName.firebaseio.com"
};

firebase.initializeApp(config);

var database = firebase.database();