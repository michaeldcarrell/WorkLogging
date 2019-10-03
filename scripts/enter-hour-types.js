let hourController = (function() {

})();

let hourTypeUIController = (function() {

    return {
        getHourTypeInputs: function() {
            return {
                hour_type_name: document.querySelector('.inpt_hour_types').value
            }
        },
        insertNewRowsHourTypeTable: function(cellValue) {
            let currentHourTypeTable = document.getElementById('hour-type-table');
            let row = currentHourTypeTable.insertRow(1);
            let cell = row.insertCell(0);
            cell.innerHTML = cellValue;
        }
    }
})();

let controller = (function(hourCtrl, UICtrl) {

    let ctrlAddHourTypes = function() {
        let input = UICtrl.getHourTypeInputs();
        let url = 'http://hour-logging-api.herokuapp.com/hour_types';
        fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(input)
        }).then(function(res) {
            console.log(res.json())
        }).catch(function(e) {
            console.log(e)
        });
    };


    document.querySelector('.type_submit').addEventListener('click', function(event) {
        if (UICtrl.getHourTypeInputs()['hour_type_name'] !== '') {//Prevents user from submitting nothing
            UICtrl.insertNewRowsHourTypeTable(UICtrl.getHourTypeInputs()['hour_type_name']);
            ctrlAddHourTypes();
            document.querySelector('.inpt_hour_types').value = ''; //Clears out previous value
        }
    });

    document.addEventListener('keypress', function(event) {
        if (event.key === "Enter" || event.which === 13) {
            if (UICtrl.getHourTypeInputs()['hour_type_name'] !== '') { //Prevents user from submitting nothing
                UICtrl.insertNewRowsHourTypeTable(UICtrl.getHourTypeInputs()['hour_type_name']);
                ctrlAddHourTypes();
                document.querySelector('.inpt_hour_types').value = ''; //Clears out previous value
            }
        }
    });

    let initHourTypeTable = function() {
        let fetch_hour_types = async () => {
            let url = 'http://hour-logging-api.herokuapp.com/hour_types';
            fetch(url).then(
                (res) => res.json()
            ).then(function(data) {
                for (let rows_built = 0; rows_built < data.length; rows_built++) {
                    UICtrl.insertNewRowsHourTypeTable(data[rows_built]['hour_type_name'])
                }
            })
        };
        return fetch_hour_types()
    };


    
    let init = function () {
        initHourTypeTable()
    }();

})(hourController, hourTypeUIController);




