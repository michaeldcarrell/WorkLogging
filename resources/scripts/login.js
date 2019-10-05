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

        });
        console.log(input);
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