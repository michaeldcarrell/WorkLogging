if (document.cookie === '') {
    document.location.href = 'login'
}

let reportTypeUIController = (function() {

})();

let controller = (function(UICtrl) {
    let initTypeAggTable = async (res, req) => {
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
            let reportedHourTypes = {};
            let reportedHourContact = {};
            for (let hoursAgged = 0; hoursAgged < data.length; hoursAgged++) {
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
            console.log(reportedHourTypes);
            console.log(reportedHourContact);
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
        })
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
        $('.selectpicker').selectpicker('refresh');
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
        })
    };


    let initReportingTable = function() {
        initAccountDetails();
        initContactTypesDD();
        initTypeAggTable();
        initHourTypesDD();
    }();
})(reportTypeUIController);
