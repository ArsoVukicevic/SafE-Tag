export const selectInsertUserErrorMsg = state => state.admin.get('insertUserErrorMsg')
export const selectTableOfUsers = state => state.admin.get('tableOfUsers')
export const selectInsertUserSuccess = state => state.admin.get('insertUserSuccess')
export const selectTableOfFactories = state => state.admin.get('tableOfFactories')
export const selectClassificationAndItemTree = state => state.admin.get('classificationAndItemTree')
export const selectClassificationAndItem = state => state.admin.get('classificationAndItem')

// used inside profile component
export const selectFactoryInfo = state => state.admin.get('factoryInfo')

// Error handling
export const selectErrorMsg = state => state.admin.get('errorMsg')
export const selectRequestSuccess = state => state.admin.get('requestSuccess')

export const selectSearchQuery = state => state.admin.get('searchQuery')
export const selectEmployeesForView = state => state.admin.get('employeesForView')
export const selectEmployeesForInsert = state => state.admin.get('employeesForInsert')
export const selectAudit = state => state.admin.get('audit')
