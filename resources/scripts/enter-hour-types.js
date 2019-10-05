if (document.cookie === '') {document.location.href =  'login'}

let hourController = (function() {

})();

let hourTypeUIController = (function() {

    return {
        getHourTypeInputs: function() {
            return {
                hour_type_name: document.querySelector('.inpt-hour-types').value
            }
        },
        insertNewRowsHourTypeTable: function(hourTypeData) {
            let currentHourTypeTable = document.getElementById('hour-type-table');
            let row = currentHourTypeTable.insertRow(1);
            let id = row.insertCell(0);
            let type = row.insertCell(1);
            id.innerHTML = hourTypeData['_id'];
            type.innerHTML = hourTypeData['hour_type_name'];
            id.classList.add('col-ID');
        }
    }
})();

let controller = (function(hourCtrl, UICtrl) {

    let ctrlAddHourTypes = function() {
        let input = UICtrl.getHourTypeInputs();
        let url = 'https://hour-logging-api.herokuapp.com/hour_types';
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
    };


    document.querySelector('.type-submit').addEventListener('click', function(event) {
        if (UICtrl.getHourTypeInputs()['hour_type_name'] !== '') {//Prevents user from submitting nothing
            UICtrl.insertNewRowsHourTypeTable(UICtrl.getHourTypeInputs()['hour_type_name']);
            ctrlAddHourTypes();
            document.querySelector('.inpt-hour-types').value = ''; //Clears out previous value
        }
    });

    document.addEventListener('keypress', function(event) {
        if (event.key === "Enter" || event.which === 13) {
            if (UICtrl.getHourTypeInputs()['hour_type_name'] !== '') { //Prevents user from submitting nothing
                UICtrl.insertNewRowsHourTypeTable(UICtrl.getHourTypeInputs());
                ctrlAddHourTypes();
                document.querySelector('.inpt-hour-types').value = ''; //Clears out previous value
            }
        }
    });

    let initHourTypeTable = function() {
        let fetch_hour_types = async () => {
            let url = 'https://hour-logging-api.herokuapp.com/hour_types';
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
                console.log(data);
                for (let rows_built = 0; rows_built < data.length; rows_built++) {
                    UICtrl.insertNewRowsHourTypeTable(data[rows_built])
                }
            })
        };
        return fetch_hour_types()
    };


    
    let init = function () {
        initHourTypeTable()
    }();

})(hourController, hourTypeUIController);




