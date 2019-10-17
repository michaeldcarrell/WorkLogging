if (document.cookie === '') {
    document.location.href = 'login'
}

let reportTypeUIController = (function() {
    return {
        today: function() {
            let current = new Date();
            let dd = String(current.getDate()).padStart(2, '0');
            let mm = String(current.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = current.getFullYear();

            return yyyy + '-' + mm + '-' + dd;
        },
        formatDate: function(ISODate) {
            let dd = String(ISODate.getDate()).padStart(2, '0');
            let mm = String(ISODate.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = ISODate.getFullYear();

            return yyyy + '-' + mm + '-' + dd;
        },
        getReportingInputs: {
            types: document.getElementById('selected-types').innerHTML.split(', '),
            contacts: document.getElementById('selected-contacts').innerHTML.split(', '),
            afterDate: document.getElementById('inpt-from-date').value,
            beforeDate: document.getElementById('inpt-to-date').value
        }
    }
})();

let controller = (function(UICtrl) {

    let aggHours = function(data) {

        let reportedHourTypes = {};
        let reportedHourContact = {};
        let minDate = new Date();
        for (let hoursAgged = 0; hoursAgged < data.length; hoursAgged++) {
            if (data[hoursAgged]['hours_completed_on'] < minDate) {
                minDate = data[hoursAgged]['hours_completed_on']
            }
            if (reportedHourTypes.hasOwnProperty(data[hoursAgged]['hour_type_name'])) {
                reportedHourTypes[data[hoursAgged]['hour_type_name']] += data[hoursAgged]['hours'];
            } else {
                reportedHourTypes[data[hoursAgged]['hour_type_name']] = data[hoursAgged]['hours'];
            }
            if (data[hoursAgged].hasOwnProperty('contact_type_name')) {
                if (data[hoursAgged]['contact_type_name'] !== null) {
                    if (data[hoursAgged]['contact_type_name'].hasOwnProperty('contact_type_name')) {
                        if (reportedHourContact.hasOwnProperty(data[hoursAgged]['contact_type_name']['contact_type_name'])){
                            reportedHourContact[data[hoursAgged]['contact_type_name']['contact_type_name']] += data[hoursAgged]['hours'];
                        } else {
                            reportedHourContact[data[hoursAgged]['contact_type_name']['contact_type_name']] = data[hoursAgged]['hours'];
                        }
                    }
                }
            }
        }
        return {
            reportedHourTypes: reportedHourTypes,
            reportedHourContact: reportedHourContact,
            minDate: minDate
        }
    };

    let addRowsToAggTypes = function(data) {
        let currentTypeAggTable = document.getElementById('table-type-agg');
        for (let typesCompleted = 0; typesCompleted < Object.keys(data).length; typesCompleted++) {
            let row = currentTypeAggTable.insertRow(1);
            let type = row.insertCell(0);
            let hours = row.insertCell(1);
            type.innerHTML = Object.keys(data)[typesCompleted];
            hours.innerHTML = data[Object.keys(data)[typesCompleted]];
        }
    };

    let addRowsToAggContacts = function(data) {
        let currentContactAggTable = document.getElementById('table-contact-agg');
        for (let contactsCompleted = 0; contactsCompleted < Object.keys(data).length; contactsCompleted++) {
            let row = currentContactAggTable.insertRow(1);
            let type = row.insertCell(0);
            let hours = row.insertCell(1);
            type.innerHTML = Object.keys(data)[contactsCompleted];
            hours.innerHTML = data[Object.keys(data)[contactsCompleted]];
        }
    };


    let initAggTables = async (res, req) => {
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
            console.log(data);
            let aggedHours = aggHours(data);
            addRowsToAggTypes(aggedHours.reportedHourTypes);
            addRowsToAggContacts(aggedHours.reportedHourContact);
            document.getElementById('inpt-from-date').value = UICtrl.formatDate(aggedHours.minDate);
            console.log(aggedHours);
        }).catch(function(e){
            console.log(e)
        })
    };

    let initContactTypesDD = async () => {
        let dropDown = document.getElementById('contact_type_drop_down');
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
                option.textContent = newOption['contact_type_name'];
                option.value = newOption['_id'];
                dropDown.appendChild(option);
            }
        });
        $('.selectpicker').selectpicker('render'); //render first so the getElement has something to get
        let ddButton = document.getElementById('dd-contact-container').getElementsByTagName('button')[0];
        ddButton.getElementsByClassName('filter-option-inner-inner')[0].id = 'selected-contacts';
        ddButton.addEventListener('click', function(event) {
            let spClass = $('.selectpicker');
            spClass.selectpicker('refresh');
        });
    };

    let initHourTypesDD = async () => {
        let dropDown = document.getElementById('hour_type_drop_down');
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
                option.textContent = newOption;
                option.value = newOption;
                dropDown.appendChild(option);
            }
        });
        $('.selectpicker').selectpicker('render'); //render first so the getElement has something to get
        let ddButton = document.getElementById('dd-type-container').getElementsByTagName('button')[0];
        ddButton.getElementsByClassName('filter-option-inner-inner')[0].id = 'selected-types';
        ddButton.addEventListener('click', function(event) {
            let spClass = $('.selectpicker');
            spClass.selectpicker('refresh');
        });
    };

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
        });
    };

    document.getElementById('filter-submit').addEventListener('click', function (event) {
        let contactTable = document.getElementById('table-contact-agg');
        let typeTable = document.getElementById('table-type-agg');
        let url = 'https://hour-logging-api.herokuapp.com/report';
        fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + document.cookie,
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true'
            }
        }).then(
            (res) => res.json()
        ).then(function(data) {
        }).catch(function(e) {
        });

        //delete all current rows from tables
        for (let typeRowsRemoved = 1; typeRowsRemoved < typeTable.rows.length; typeRowsRemoved++) {
            //start at 1 so headers don't get removed
            typeTable.deleteRow(typeRowsRemoved);
        }
        for (let contactRowsRemoved = 1; contactRowsRemoved < contactTable.rows.length; contactRowsRemoved++) {
            contactTable.deleteRow(contactRowsRemoved);
        }

    });

    let setInptDate = function() {
        document.getElementById('inpt-to-date').value = UICtrl.today();
    };

    let initReportingTable = function() {
        initAccountDetails();
        initContactTypesDD();
        initAggTables();
        initHourTypesDD();
        setInptDate();
    }();
})(reportTypeUIController);
