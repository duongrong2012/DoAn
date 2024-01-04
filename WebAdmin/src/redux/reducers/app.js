import * as ActionTypes from '../actionTypes';

// const collapsed = localStorage.getItem(localStorageKey.SIDEBAR_COLLAPSED);

const defaultState = {
  admin: null,
  loading: true,
  loginLoading: false,
  collapsed: true,
  isRefreshCaptcha: false,
};

export default function appReducer(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.SET_APP_STATE:
      return {
        ...state,
        ...action.payload
      }
    case ActionTypes.GET_ADMIN_INFOR:
      return {
        ...state,
        loginLoading: true,
      }
    case ActionTypes.GET_ADMIN_INFOR_SUCCESS:
      return {
        ...state,
        loginLoading: false,
        loading: false,
        admin: action.payload,
      }
    case ActionTypes.GET_ADMIN_INFOR_FAILED:
      return {
        ...state,
        loginLoading: false,
        loading: false,
      }
    case ActionTypes.CHECK_LOGIN_DONE:
      return {
        ...state,
        loading: false,
        loginLoading: false,
        admin: action.payload,
      }
    case ActionTypes.LOGIN_FAILED:
      return {
        ...state,
        loading: false,
        loginLoading: false,
      }
    case ActionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        collapsed: !state.collapsed,
      }
    case ActionTypes.LOGOUT_DONE:
      return {
        ...defaultState,
        loading: false,
      };
    default:
      return state;
  }
}