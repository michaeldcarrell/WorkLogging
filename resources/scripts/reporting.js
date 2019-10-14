if (document.cookie === '') {
    document.location.href = 'login'
}

let reportTypeUIController = (function() {

})();

let controller = (function(UICtrl) {
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
            console.log(data);
            let reportedHourTypes = {};
            for (let typesAdded = 0; typesAdded < data.length; typesAdded++) {
                console.log(data[typesAdded]);
                console.log(data[typesAdded]['hour_type_name']);
                reportedHourTypes.hourType = data[typesAdded]['hour_type_name'];
            }
            console.log(reportedHourTypes);
        }).catch(function(e){
            console.log(e)
        })
    };


    let initReportingTable = function() {
        initHourTable();
    }()
})(reportTypeUIController);
