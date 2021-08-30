(function($) {

    "use strict";

    var fullHeight = function() {

        $('.js-fullheight').css('height', $(window).height());
        $(window).resize(function(){
            $('.js-fullheight').css('height', $(window).height());
        });

    };
    fullHeight();

    $(".toggle-password").click(function() {

        $(this).toggleClass("fa-eye fa-eye-slash");
        var input = $($(this).attr("toggle"));
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });

})(jQuery);

var firebaseConfig = {
    apiKey: "AIzaSyCcFouJJEZu5zXBFRENlaHX3Sy70dtYbfU",
    authDomain: "stepapp-270e8.firebaseapp.com",
    projectId: "stepapp-270e8",
    storageBucket: "stepapp-270e8.appspot.com",
    messagingSenderId: "735809420642",
    appId: "1:735809420642:web:6ca5eab3097eaa2eb2403b",
    measurementId: "G-8ZPR5280QR"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

let db = firebase.firestore();

$('#loginBtn').on('click', function (e) {
    let email = $('#email').val();
    let password = $('#password-field').val();

    if (email && password) {
        console.log(email, password);

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                var user = userCredential.user;
                // ...
                console.log('userC ', userCredential);
                $('.userFeedback').css('display', 'none');
                $('#successtxt').css('display', 'block');
                document.getElementById('successtxt').innerText = 'Sign in successful.';
                setTimeout(function () {
                    window.location.href = 'map.html';
                }, 1000);
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                $('.userFeedback').css('display', 'none');
                $('#errortxt').css('display', 'block');
                document.getElementById('errortxt').innerText = errorMessage;
                console.error(errorMessage);
            });
    }
})

$('#signUpRBtn').on('click', function (e) {
    $('#loginForm').css('display', 'none');
    $('#signupForm').css('display', 'block');
    $('.userFeedback').css('display', 'none');
})

$('#loginRBtn').on('click', function (e) {
    $('#loginForm').css('display', 'block');
    $('#signupForm').css('display', 'none');
    $('.userFeedback').css('display', 'none');
})

$('#signUpBtn').on('click', function (e) {
    let S_username = $('#S_username').val();
    let S_password = $('#S_password-field').val();

    if (S_username && S_password) {
        console.log(S_username, S_password);
        firebase.auth().createUserWithEmailAndPassword(S_username, S_password)
            .then((userCredential) => {
                // Signed in
                var user = userCredential.user;

                console.log('signing in');

                db.collection("Users").doc(user.uid).set({
                    creationTime: user.metadata.creationTime,
                    email: user.email,
                    lastSignInTime: user.metadata.lastSignInTime,
                    password: '289ca48885442b5480dd76df484e1f90867a2961493b7c60e542e84addce5d1e'
                })
                    .then((docRef) => {
                        console.log("Document written with ID: ", docRef);
                        console.log('user ', user);
                        $('.userFeedback').css('display', 'none');
                        $('#successtxt1').css('display', 'block');
                        document.getElementById('successtxt1').innerText = 'Sign in successful.';

                        setTimeout(function () {
                            window.location.href = 'map.html';
                        }, 1000);
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                $('.userFeedback').css('display', 'none');
                $('#errortxt1').css('display', 'block');
                document.getElementById('errortxt1').innerText = errorMessage;
                console.error('sign up error.', errorMessage);
            });
    }
})

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        // ...
        console.log('user', user);
        //window.location.href = 'map.html';
    } else {
        // User is signed out
        // ...
        /*setTimeout(function () {
            window.location.href = 'index.html';
        }, 1000);*/
    }
});
