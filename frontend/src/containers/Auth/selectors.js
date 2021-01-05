export const selectUser = state => state.auth.get('user')
export const selectLoading = state => state.auth.get('loading')
export const selectloginErrorMsg = state => state.auth.get('loginErrorMsg')
