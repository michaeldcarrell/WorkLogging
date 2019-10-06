let to_do = {
    modal: 'When logging in modal appears as if login failed',
    logout: {
        idea: 'system logs user ip out after x amount of time'
    },
    sign_up: {
        idea: 'Option below login for and in modal which links to a sign-up page which will add a user',
        grand: {
            email: 'email sends when sign up to verify user this creates a temp bearer token which is active until the' +
                'the user logs in for the first time via link provided'
        }
    },
    reporting: {
        idea: 'allow user to print, email and/or analyze data from their account'
    },
    delete_rows: {
        idea: 'Let user delete rows from front end, persist on back end',
        implementation: {
            UI: 'when user hits x button on a row it will mark it as "deleted" in mongo and remove it from the front end',
            set_up: 'When user adds a new record the back end needs to retrieve the id from mongo and insert it into the UI'
        }
    }
};