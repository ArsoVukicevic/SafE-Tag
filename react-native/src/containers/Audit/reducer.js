import { fromJS } from 'immutable';
import { createAction } from 'redux-actions';

export const GET_AUDIT = 'AUDIT@@GET_AUDIT';
export const GET_AUDIT_SUCCESS = 'AUDIT@@GET_AUDIT_SUCCESS';
export const GET_AUDIT_ERROR = 'AUDIT@@GET_AUDIT_ERROR';

export const SET_AUDIT_STATUS = 'AUDIT@@SET_AUDIT_STATUS';
export const SET_AUDIT_STATUS_SUCCESS = 'AUDIT@@SET_AUDIT_STATUS_SUCCESS';
export const SET_AUDIT_STATUS_ERROR = 'AUDIT@@SET_AUDIT_STATUS_ERROR';

const initialState = fromJS({
  audit: null,
  auditId: null,
  auditError: null,
  auditSuccess: false,
  auditCount: 0,
  serverError: null,
});

export default function auditReducer(state = initialState, action) {
  switch (action.type) {
    case GET_AUDIT:
      return state
        .set('serverError', null);
    case GET_AUDIT_SUCCESS:
      return state
        .set('audit', action.payload.audit)
        .set('auditId', action.payload.auditId)
        .set('auditCount', action.payload.auditCount);
    case GET_AUDIT_ERROR:
      return state
        .set('serverError', action.payload);

    case SET_AUDIT_STATUS_ERROR:
      return state.set('auditError', action.payload);
    case SET_AUDIT_STATUS_SUCCESS:
      return state
        .set('auditSuccess', true)
        .set('audit', [])
        .set('auditCount', 0);
    case SET_AUDIT_STATUS:
      return state
        .set('auditError', null)
        .set('auditSuccess', false);
    default:
      return state;
  }
}

export const getAudit = createAction(GET_AUDIT);
export const setAuditStatus = createAction(SET_AUDIT_STATUS);
