// let hourController = (function() {
//
// })();
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

let hourController = (function(UICtrl) {

    let ctrlAddHour = function() {
        let input = UICtrl.getHourInputs();
        let url = 'http://hour-logging-api.herokuapp.com/hours';
        fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + document.cookie,
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(input)
        }).then(function(res) {
            console.log(res.json())
        }).catch(function(e) {
            console.log(e)
        });
        console.log(input);
    };

    document.querySelector('.submit_input').addEventListener('click', function(event) {
        if (UICtrl.getHourInputs().acceptableInput()) {
            UICtrl.insertNewRowsHours(UICtrl.getHourInputs());
            ctrlAddHour();
        }
    });

    document.addEventListener('keypress', function(event) {
        if (event.key === "Enter" || event.which === 13) {
            if (UICtrl.getHourInputs().acceptableInput()) {
                UICtrl.insertNewRowsHours(UICtrl.getHourInputs());
                ctrlAddHour();
            }
        }
    });

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
            console.log(data);
            for (let rows_built = 0; rows_built < data.length; rows_built++) {
                UICtrl.insertNewRowsHours(data[rows_built])
            }
        }).catch(function(e){
            console.log(e)
        })
    };

    let initHourTypesDD = async () => {
        let dropDown = document.getElementById('hour_type_drop_down');
        let url = 'http://hour-logging-api.herokuapp.com/hour_types';
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
            for (let rows_built = 0; rows_built < data.length; rows_built++) {
                let newOption = data[rows_built]['hour_type_name'];
                let option = document.createElement("option");
                option.textContent = newOption;
                option.value = newOption;
                dropDown.appendChild(option);
            }
        })
    };

    let init = function() {
        initHourTable();
        initHourTypesDD();
    }();

})(hourUIController);