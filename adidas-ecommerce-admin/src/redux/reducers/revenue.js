import * as ActionTypes from "../actionTypes";

const defaultState = {
  revenue: [],
  loading: true,
  yearBudgetList: [],
  blockLoading: false,
  bestSellerProducts: [],
  bestSellerProductsLoading: true,
};

export default function budgetReducer(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.GET_REVENUE:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.GET_REVENUE_SUCCESS:
      return {
        ...state,
        loading: false,
        revenue: action.payload,
      };
    case ActionTypes.GET_REVENUE_FAILED:
      return {
        ...state,
        loading: false,
      };

    case ActionTypes.GET_BEST_SELLER_PRODUCTS:
      return {
        ...state,
        bestSellerProductsLoading: true,
      };
    case ActionTypes.GET_BEST_SELLER_PRODUCTS_SUCCESS:
      return {
        ...state,
        bestSellerProductsLoading: false,
        bestSellerProducts: action.payload.data,
      };
    case ActionTypes.GET_BEST_SELLER_PRODUCTS_FAILED:
      return {
        ...state,
        bestSellerProductsLoading: false,
      };
    case ActionTypes.GET_YEARBUDGET:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.GET_YEARBUDGET_SUCCESS:
      return {
        ...state,
        loading: false,
        yearBudgetList: action.payload,
      };
    case ActionTypes.GET_YEARBUDGET_FAILED:
      return {
        ...state,
        loading: false,
      };
    case ActionTypes.LOGOUT_DONE:
      return defaultState;
    default:
      return state;
  }
}
