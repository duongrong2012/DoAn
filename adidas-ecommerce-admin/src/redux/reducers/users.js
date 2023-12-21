import * as ActionTypes from '../actionTypes';

const defaultState = {
  userList: [],
  loading: true,
  blockLoading: false,
  totalUser: 0,
};

export default function usersReducer(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.GET_USERS:
      return {
        ...state,
        loading: true,
      }
    case ActionTypes.GET_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        userList: action.payload.data,
        totalUser: action.payload.total
      }
    case ActionTypes.GET_USERS_FAILED:
      return {
        ...state,
        loading: false,
      }
    case ActionTypes.BLOCK_USER:
      return {
        ...state,
        blockLoading: true,
      }
    case ActionTypes.BLOCK_USER_SUCCESS: {
      const userList = JSON.parse(JSON.stringify(state.userList));

      const userIndex = userList.findIndex((x) => x._id === action.payload.id);

      if (userIndex !== -1) {
        userList[userIndex].status = action.payload.status
      }

      return {
        ...state,
        userList,
        blockLoading: false,
      }
    }
    case ActionTypes.BLOCK_USER_FAILED:
      return {
        ...state,
        blockLoading: false,
      }
    case ActionTypes.LOGOUT_DONE:
      return defaultState;
    default: return state;
  }
}