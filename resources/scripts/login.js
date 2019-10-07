let script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].append(script);

let loginController = (function() {

})();

let loginUIController = (function() {
    return {
        getLoginInputs: function() {
            return {
                username: document.querySelector('.username').value,
                password: document.querySelector('.password').value,
            }
        }
    }
})();

let controller = (function(loginCtrl, UICtrl) {

    let ctrlLogin = function() {
        let input = UICtrl.getLoginInputs();
        let url = 'https://hour-logging-api.herokuapp.com/users/login';
        fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(input)
        }).then(
            (res) => res.json()
        ).then(function (data){
            document.cookie = data['token'];
            console.log(document.cookie);

            document.location.href = 'enter-hours'
        }).catch(function(e) {
            console.log('Login Failed');
            // document.getElementById('loginFailedModal').style.display = 'block';
            // document.getElementById('loginFailedModal').classList.add('show');
            // document.body.classList.add('modal-open')
            $('#loginFailedModal').modal('toggle');
        });
    };

    document.querySelector('.btn-login').addEventListener('click', function(event) {
        // event.preventDefault(); //Prevents the page from refreshing on submit
        ctrlLogin();
    });

    document.addEventListener('keypress', function(event) {
        // event.preventDefault(); //Prevents the page from refreshing on submit
        if (event.key === "Enter" || event.which === 13) {
            ctrlLogin();
        }
    });

})(loginController, loginUIController);
