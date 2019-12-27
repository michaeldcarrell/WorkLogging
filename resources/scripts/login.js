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

    console.log('2019.12.27.3');

    let spinInit = function() {
        let spinner = new Spinner(opts).spin(target);
        let body = document.getElementById('body-container');
        body.style.display = 'block';
        return spinner
    };

    let spinStop = function(spinner) {
        let body = document.getElementById('body-container');
        body.style.display = 'none';
        spinner.stop();
    };

    let ctrlLogin = function() {
        let activeSpinner = spinInit();
        let input = UICtrl.getLoginInputs();
        let url = 'https://hour-logging-api.herokuapp.com/users/login';
        fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(input)
        }).then(async (res) => {
                return {
                    status: res.status,
                    body: await res.json()
                }
        }).then(async (data) => {
            if (data.status === 200) {
                document.cookie = data.body['token'];
                spinStop(activeSpinner);
                document.location.href = 'enter-hours'
            } else {
                console.log('Login Failed');
                spinStop(activeSpinner);
                $('#loginFailedModal').modal('toggle');
            }
        }).catch(function(e) {
            console.log('Login Failed');
            spinStop(activeSpinner);
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
