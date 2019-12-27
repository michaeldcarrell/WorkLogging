let denyLogin = function() {
    document.cookie = '';
    // document.location.href = 'login'; instead this should pop up modal informing user something went wrong and to re-log
};
if (document.cookie === '') {
    denyLogin()
}

let accountUIController = (function() {
    return {}
})();

let hourController = (function(UICtrl) {

    console.log('2019.12.27.2');

    let logOutUser = () => {
        let url = 'https://hour-logging-api.herokuapp.com/users/logout';
        fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + document.cookie,
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true'
            }
        }).then(function(res) {
            console.log(res.json())
        }).catch(function(e) {
            console.log(e)
        });
    };

    document.getElementById('account-action-logout').addEventListener('click', function(event) {
        logOutUser();
        document.cookie = '';
        document.location.href = 'login';
    });


    let initAccountDetails = async () => {
        let userDropDown = document.getElementById('account-option-dropdown');
        let url = 'https://hour-logging-api.herokuapp.com/users/me';
        fetch(url, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + document.cookie,
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true'
            }
        }).then(
            (res) => res.json()
        ).then(function(data) {
            userDropDown.innerHTML = data['username'];
        }).catch(function(e) {
            console.log(e);
            userDropDown.innerHTML = '';
        })
    };

    let init = function() {
        initAccountDetails();
    }();

})(accountUIController);