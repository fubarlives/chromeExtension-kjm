console.log('Background Script called...');

firebase.initializeApp(firebaseConfig);

function initApp() {
    // Listen for auth state changes.
    firebase.auth().onAuthStateChanged(function (user) {
        console.log('User state change detected from the Background script of the Chrome Extension:', user);
    });
}

window.onload = function () {
    initApp();
};


// USER AUTH METHODS
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received in background.js!", request);

    switch (request.command) {
        case 'checkAuth':
            var user = firebase.auth().currentUser;
            if (user) {
                // User is signed in.
                //response({ type: "auth", status: "success", message: user });
                sendResponse({
                    status: 'success',
                    loggedIn: true,
                    user: user,
                });

            } else {
                // No user is signed in.
                //response({ type: "auth", status: "no-auth", message: false });
                sendResponse({
                    status: 'failed',
                    loggedIn: false,
                });
            }
            break;

        case 'Login':

            email = request.data.e;
            password = request.data.p;
            console.log('[Email from Form]', request.data.e);
            console.log('[Password from Form]', request.data.p);
            //google auth process here
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((result) => {
                    let user = result.user;
                    chrome.storage.local.set({ user: user }, function () {
                        console.log("User data has been stored in storage");
                    });
                    sendResponse({
                        status: 'success',
                        loggedIn: true,
                        user: user,
                    });
                }).catch((error) => {
                    // Handle Errors here.
                    var errorMessage = error.message;
                    console.log('[Backend Erro rmessage form login:]', errorMessage)
                    //response({ type: "auth", status: "error", message: errorMessage });
                    sendResponse({
                        status: 'failed',
                        error: errorMessage,
                    });
                });
            break;

        case 'Logout':
            firebase.auth().signOut().then(function () {
                // Sign-out successful.
                //response({ type: "un-auth", status: "success", message: true });
                chrome.storage.local.remove("user");
                sendResponse({
                    status: 'success',
                    loggedIn: false,

                });

            }, function (error) {
                // An error happened.
                //response({ type: "un-auth", status: "false", message: error });
                sendResponse({
                    status: 'failed',
                    error: error,
                });
            });
            break;
        default:
            user_signed_in = false;
            sendResponse({
                status: 'success',
                loggedIn: user_signed_in,
            });
            break;

    }


    return true;
}
);



    ////////////////////

    // if (msg.command == 'logoutAuth') {
    //       firebase.auth().signOut().then(function () {
    //           // Sign-out successful.
    //           response({ type: "un-auth", status: "success", message: true });
    //       }, function (error) {
    //           // An error happened.
    //           response({ type: "un-auth", status: "false", message: error });
    //       });
    //   }
    //   if (msg.command == 'checkAuth') {
    //       var user = firebase.auth().currentUser;
    //       if (user) {
    //           // User is signed in.
    //           response({ type: "auth", status: "success", message: user });
    //       } else {
    //           // No user is signed in.
    //           response({ type: "auth", status: "no-auth", message: false });
    //       }
    //   }
    //   if (msg.command == 'loginUser') {
    //       firebase.auth()
    //           .signInWithPopup(provider)
    //           .then((result) => {
    //               var user = result.user;
    //               response({ type: "auth", status: "success", message: user });
    //           }).catch((error) => {
    //               // Handle Errors here.
    //               var errorMessage = error.message;
    //               response({ type: "auth", status: "error", message: errorMessage });
    //           });

    //}
