let current_url = document.URL.split('/');
let current_page = current_url[current_url.length - 1];

if (current_page === 'login.html'){
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

    let loginController = (function(UICtrl) {

        let ctrlLogin = function() {
            let input = UICtrl.getLoginInputs();
            let url = 'https://hour-logging-api.herokuapp.com/users/login';
            // fetch(url, {
            //     method: 'post',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(input)
            // }).then(function(res) {
            //     console.log(res.json())
            // }).catch(function(e) {
            //     console.log(e)
            // });
            fetch(url, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(input)
            }).then(
                (res) => res.json()
            ).then(function (data) {
                document.cookie = data['token']
            }).catch(function(e) {
                console.log(e)
            });
            console.log(input);
        };

        document.querySelector('.btn_login').addEventListener('click', function(event) {
            // event.preventDefault(); //Prevents the page from refreshing on submit
            ctrlLogin();
        });

        document.addEventListener('keypress', function(event) {
            // event.preventDefault(); //Prevents the page from refreshing on submit
            if (event.key === "Enter" || event.which === 13) {
                ctrlLogin();
            }
        });

    })(loginUIController);
}


if (current_page === 'enter-hours.html') {
    let hourUIController = (function() {
        return {
            getHourInputs: function() {
                return {
                    hour_type_name: document.querySelector('.hour_type_input').value,
                    hours_completed_on: document.querySelector('.hour_date_input').value,
                    hours: document.querySelector('.hours_gained_input').value,
                    notes: document.querySelector('.notes_input').value,
                    acceptableInput: function() {
                        return !(this.hour_type_name === '' ||
                            this.hours_completed_on === '' ||
                            this.hours === '');
                    }
                }
            },
            insertNewRowsHours: function(hourInputs) {
                let currentHourTable = document.getElementById("hour-table");
                let row = currentHourTable.insertRow(1);
                let date = row.insertCell(0);
                let type = row.insertCell(1);
                let hours = row.insertCell(2);
                let notes = row.insertCell(3);
                date.innerHTML = hourInputs['hours_completed_on'].slice(0, 10);
                type.innerHTML = hourInputs['hour_type_name'];
                hours.innerHTML = hourInputs['hours'];
                notes.innerHTML = hourInputs['notes'];
            }
        }
    })();

    let hourController = (function(hourCtrl, UICtrl) {

        let initHourTable = async (res, req) => {
            let url = 'https://hour-logging-api.herokuapp.com/hours';
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
            ).then(function (data) {
                for (let rows_built = 0; rows_built < data.length; rows_built++) {
                    UICtrl.insertNewRowsHours(data[rows_built])
                }
            }).catch(function(e){
                console.log(e)
            })
        };

        let init = function() {
            initHourTable();
        }();

    })(hourUIController);
}
console.log('Bearer ' + document.cookie);

