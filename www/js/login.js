document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {

    const btnFacebookLogIn = document.getElementById('btnFacebookLogIn');
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const btnLogin = document.getElementById('btnLogin');
    const btnGoogleLogIn = document.getElementById('btnGoogleLogIn');
    const info = document.getElementById('info');

    // Add a real-time listener
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log(firebaseUser);
        } else {
            console.log('not logged in');
        }
    });


    //Add login with Facebook
    btnFacebookLogIn.addEventListener('click', e => {
        const provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().useDeviceLanguage();
        firebase.auth().signInWithRedirect(provider).then(function () {
            return firebase.auth().getRedirectResult();
        }).then(result => {
            var token = result.credential.accessToken;
            var user = result.user;
            console.log(user);
        }).catch(e => info.innerHTML = e.code);
    });

    //Add login with email and password
    btnLogin.addEventListener('click', e => {
        //Get email and password from input
        const email = txtEmail.value;
        const password = txtPassword.value;
        const auth = firebase.auth();

        // Login
        const promise = auth.signInWithEmailAndPassword(email, password);
        promise.catch(e => info.innerHTML = e.message);
    });

    // Add login with Google
    btnGoogleLogIn.addEventListener('click', e => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().useDeviceLanguage();

        firebase.auth().getRedirectResult().then(result => {
            if (result.credential) {
                const token = result.credential.accessToken;
            }
            const user = result.user;
        });
        provider.addScope('profile');
        provider.addScope('email');
        firebase.auth().signInWithRedirect(provider).catch(e => info.innerHTML = e.code);
    });
}
