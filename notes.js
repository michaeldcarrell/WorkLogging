let to_do = {
    modal: 'When logging in modal appears as if login failed',
    logout: {
        idea: 'system logs user ip out after x amount of time',
        implementation: 'Node takes care of logging the user out but nothing informs the user if they were to leave the page open' +
            'if user tries to perform an action when logged out it should open a modal informing them of the logout/timeout and' +
            'on focus shift or closing the modal it should redirect to the login screen',
        long_term: 'when user performs functions within the app (inputting hours, updating hours, inputting hour types, shifting pages)' +
            'their token should be refreshed'
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
    edit_previously_entered_rows: {
        idea: 'When updating previous rows data is not being push to the ui',
        reason: 'UI is not waiting for the API response to finish before submitting to the UI',
        fix: '?'
    },
    sorting_pages: {
        idea: 'Let users sort pages by entries in columns'
    },
    user_entered_decimal_hours: 'when user enters decimals for hours should show up as 0.15 instead of .15',
    pagination: {
        idea: 'user should be able to sort hours by pages which limit the ui to a static (non-scrolling) page',
        implementation: 'user will have the option of jumping pages < 1 2 3 ... [x] > in order to do this they just also have ' +
            'the functionality to search by type, keyword note, date ranges number of hours and contact type so they could edit hours' +
            'in the distant past more easily'
    }
};