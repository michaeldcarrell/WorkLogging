if (document.cookie === '') {
    document.location.href = 'login'
} else {
    log_switch = document.querySelector('.log-toggle');
    log_switch.innerHTML = 'Logout';
    log_switch.classList.add('logout');
}

let hourUIController = (function() {
    return {
        getHourInputs: function() {
            let contactTypeDDOptions = document.getElementById('contact_type_drop_down');
            return {
                hour_type_name: document.getElementById('hour_type_drop_down').value,
                contact_type_id: document.getElementById('contact_type_drop_down').value,
                contact_type_name: contactTypeDDOptions[contactTypeDDOptions.selectedIndex].text,
                hours_completed_on: document.getElementById('inpt-date').value,
                hours: document.getElementById('inpt-hours').value,
                notes: document.getElementById('inpt-notes').value,
                acceptableInput: function() {
                    return !(this.hour_type_name === '' ||
                        this.contact_type_id === '' ||
                        this.hours_completed_on === '' ||
                        this.hours === '');
                }
            }
        },
        getModalInputs: function() {
            let contactTypeDDOptions = document.getElementById('contact_type_drop_down-modal');

            return {
                hour_type_name: document.getElementById('hour_type_drop_down-modal').value,
                contact_type_id: document.getElementById('contact_type_drop_down-modal').value,
                contact_type_name: contactTypeDDOptions[contactTypeDDOptions.selectedIndex].text,
                hours_completed_on: document.getElementById('inpt-date-modal').value,
                hours: document.getElementById('inpt-hours-modal').value,
                notes: document.getElementById('inpt-notes-modal').value,
                acceptableInput: function() {
                    return !(this.hour_type_name === '' ||
                        this.contact_type_id === '' ||
                        this.hours_completed_on === '' ||
                        this.hours === '');
                }
            }
        },
        insertNewRowsHours: function(hourInputs) {
            let currentHourTable = document.getElementById("hour-table");
            let row = currentHourTable.insertRow(1);
            let id = row.insertCell(0);
            let date = row.insertCell(1);
            let type = row.insertCell(2);
            let contact = row.insertCell(3);
            let hours = row.insertCell(4);
            let notes = row.insertCell(5);
            let del = row.insertCell(6);
            id.innerHTML = hourInputs['_id'];
            id.classList.add('col-ID');
            row.id = 'row-' + hourInputs['_id'];
            date.innerHTML = hourInputs['hours_completed_on'].slice(0, 10);
            type.innerHTML = hourInputs['hour_type_name'];
            hours.innerHTML = hourInputs['hours'];
            console.log(hourInputs);
            console.log(hourInputs['contact_type_name']);
            console.log(hourInputs['contact_type_name'] === null);
            if (typeof hourInputs['contact_type_name'] != 'undefined') {
                if (typeof hourInputs['contact_type_name']['contact_type_name'] != 'undefined') {
                    contact.innerHTML = hourInputs['contact_type_name']['contact_type_name'];
                } else {
                    contact.innerHTML = ''
                }
            } else {
                contact.innerHTML = ''
            }
            notes.innerHTML = hourInputs['notes'];
            del.innerHTML = '<button type="button" class="btn btn-danger btn-sm row-btn" id="del-' + hourInputs['_id'] + '">' +
                '    <span class="row-del-spn"><b>X</b></span>' +
                '</button>' +
                '<button type="button" class="btn btn-secondary btn-sm row-btn" id="edit-' + hourInputs['_id'] + '">' +
                '    <span class="row-edit-spn"><b>...</b></span>' +
                '</button>';
            del.id = 'btns-' + hourInputs['_id'];

            //deleting hours
            document.getElementById('del-' + hourInputs['_id']).addEventListener('click', function (event) {
                let url = 'https://hour-logging-api.herokuapp.com/hours/' + hourInputs['_id'];
                let reqBody = {
                    deleted: true
                };

                fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + document.cookie,
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                        'Access-Control-Allow-Credentials': 'true',
                        'Access-Control-Allow-Methods': 'PATCH'
                    },
                    body: JSON.stringify(reqBody)
                }).then(function(res) {
                    console.log(res.json())
                }).catch(function(e) {
                    console.log(e)
                });

                document.getElementById('row-' + hourInputs['_id']).style.display = 'none'
            });

            //populates the update modal table
            document.getElementById('edit-' + hourInputs['_id']).addEventListener('click', function (event) {
                let url = 'https://hour-logging-api.herokuapp.com/hours/' + hourInputs['_id'];

                fetch(url, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + document.cookie,
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                        'Access-Control-Allow-Credentials': 'true',
                        'Access-Control-Allow-Methods': 'get'
                    }
                }).then(
                    (res) => res.json()
                ).then(function(data) {
                    document.getElementById('hour_type_drop_down-modal').value = data['hour_type_name'];
                    document.getElementById('inpt-date-modal').value = data['hours_completed_on'].slice(0, 10);
                    document.getElementById('inpt-hours-modal').value = data['hours'];
                    document.getElementById('inpt-notes-modal').value = data['notes'];
                    document.getElementById('modal-table-id-col').innerHTML = data['_id'];
                    document.getElementById('modal-table-date').innerHTML = data['hours_completed_on'].slice(0, 10);
                    document.getElementById('modal-table-hour-type').innerHTML = data['hour_type_name'];
                    if (typeof data['contact_type_name'] != 'undefined') {
                        if (typeof data['contact_type_name']['contact_type_name'] != 'undefined') {
                            document.getElementById('modal-table-contact-type').innerHTML = data['contact_type_name']['contact_type_name'];
                        } else {
                            document.getElementById('modal-table-contact-type').innerHTML = ''
                        }
                    } else {
                        document.getElementById('modal-table-contact-type').innerHTML = ''
                    }
                    document.getElementById('modal-table-hours').innerHTML = data['hours'];
                    document.getElementById('modal-table-notes').innerHTML = data['notes'];

                }).catch(function(e) {
                    console.log(e)
                });
                $('#hourSubmissionModal').modal('toggle');
            });
        }
    }
})();

let hourController = (function(UICtrl) {

    let ctrlAddHour = function() {
        let input = UICtrl.getHourInputs();
        let url = 'https://hour-logging-api.herokuapp.com/hours';
        fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + document.cookie,
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(input)
        }).then(
            (res) => res.json()
        ).then(function(data) {
            console.log(data);
            UICtrl.insertNewRowsHours(data);
        }).catch(function(e) {
            console.log(e)
        });
    };


    let ctrlEditHours = function(hourID) {
        let input = UICtrl.getModalInputs();
        delete input['contact_type_name'];
        let url = 'https://hour-logging-api.herokuapp.com/hours/' + hourID;
        fetch(url, {
            method:'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + document.cookie,
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true'
            },
            body: JSON.stringify(input)
        }).then(
            (res) => res.json()
        ).then(function(data){
            let updateRow = document.getElementById('row-' + data['_id']).children;
            updateRow[1].innerHTML = data['hours_completed_on'].slice(0, 10);
            updateRow[2].innerHTML = data['hour_type_name'];
            if (typeof data['contact_type_name'] != 'undefined') {
                if (typeof data['contact_type_name']['contact_type_name'] != 'undefined') {
                    updateRow[3].innerHTML = data['contact_type_name']['contact_type_name']
                } else {
                    updateRow[3].innerHTML = '';
                }
            } else {
                updateRow[3].innerHTML = '';
            }
            updateRow[3].innerHTML = data['contact_type_name']['contact_type_name'];
            updateRow[4].innerHTML = data['hours'];
            updateRow[5].innerHTML = data['notes'];
        })
    };

    let logOutUser = function() {
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

    document.querySelector('.submit-input').addEventListener('click', function(event) {
        if (UICtrl.getHourInputs().acceptableInput()) {
            ctrlAddHour();
        }
    });

    document.querySelector('.logout').addEventListener('click', function(event) {
        logOutUser();
        document.cookie = '';
    });


    document.addEventListener('keypress', function(event) {
        // add logic here for if the modal is open
        if (event.key === "Enter" || event.which === 13) {
            if (UICtrl.getHourInputs().acceptableInput()) {
                ctrlAddHour();
            }
        }
    });

    document.getElementById('submit-edit-modal').addEventListener('click', function(event) {
        let hour_id = document.getElementById('modal-table-id-col').innerHTML;
        if (UICtrl.getModalInputs().acceptableInput()) {
            ctrlEditHours(hour_id);
        }
        $('#hourSubmissionModal').modal('toggle');
    });

    let initHourTable = async (res, req) => {
        let url = 'https://hour-logging-api.herokuapp.com/hours/active';
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

    let initHourTypesDD = async () => {
        let dropDown = document.getElementById('hour_type_drop_down');
        let dropDownModal = document.getElementById('hour_type_drop_down-modal');
        let url = 'https://hour-logging-api.herokuapp.com/hour_types/active';
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
                let optionModal = document.createElement('option');
                option.textContent = newOption;
                option.value = newOption;
                optionModal.value = newOption;
                optionModal.textContent = newOption;
                dropDown.appendChild(option);
                dropDownModal.appendChild(optionModal);
            }
        })
    };

    let initContactTypesDD = async () => {
        let dropDown = document.getElementById('contact_type_drop_down');
        let dropDownModal = document.getElementById('contact_type_drop_down-modal');
        let url = 'https://hour-logging-api.herokuapp.com/contact_types';
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
                let newOption = data[rows_built];
                let option = document.createElement("option");
                let optionModal = document.createElement('option');
                option.textContent = newOption['contact_type_name'];
                option.value = newOption['_id'];
                optionModal.value = newOption['_id'];
                optionModal.textContent = newOption['contact_type_name'];
                dropDown.appendChild(option);
                dropDownModal.appendChild(optionModal);
            }
        })
    };

    let init = function() {
        initHourTable();
        initHourTypesDD();
        initContactTypesDD();
    }();

})(hourUIController);