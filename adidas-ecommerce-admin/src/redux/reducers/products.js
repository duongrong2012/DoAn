import * as ActionTypes from '../actionTypes';

const defaultState = {
  productDetail: null,
  productDetailLoading: false,
  allProductsLoading: false,
  allProducts: [],
  addLoading: false,
  searchSuggests: [],
  deleteLoading: false,
  selectedProduct: null,
  isSearched: false,
  searchResults: [],
  searchText: '',
};

export default function productReducer(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.SELECT_PRODUCT:
      return {
        ...state,
        selectedProduct: action.payload,
      }
    case ActionTypes.GET_PRODUCTS:
      return {
        ...state,
        [`${action.payload.stateName}Loading`]: true,
      }
    case ActionTypes.GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        [`${action.payload.stateName}Loading`]: false,
        [action.payload.stateName]: action.payload.data,
      }
    case ActionTypes.GET_PRODUCTS_FAILED:
      return {
        ...state,
        [`${action.payload.stateName}Loading`]: false,
      }
    case ActionTypes.GET_PRODUCT_DETAIL:
      return {
        ...state,
        productDetailLoading: true,
      }
    case ActionTypes.GET_PRODUCT_DETAIL_SUCCESS:
      return {
        ...state,
        productDetail: action.payload,
        productDetailLoading: false,
      }
    case ActionTypes.GET_PRODUCT_DETAIL_FAILED:
      return {
        ...state,
        productDetailLoading: false,
      }
    case ActionTypes.DELETE_PRODUCT:
      return {
        ...state,
        deleteLoading: true,
      }
    case ActionTypes.DELETE_PRODUCT_SUCCESS: {
      const productList = JSON.parse(JSON.stringify(state.allProducts));

      const productIndex = productList.findIndex((x) => x.id === action.payload.id);

      if (productIndex > -1) {
        productList.splice(productIndex, 1);
      }

      return {
        ...state,
        productList,
        deleteLoading: false,
      }
    }
    case ActionTypes.DELETE_PRODUCT_FAILED:
      return {
        ...state,
        deleteLoading: false,
      }
    case ActionTypes.ADD_PRODUCT:
      return {
        ...state,
        addLoading: true,
      }
    case ActionTypes.ADD_PRODUCT_SUCCESS:
    case ActionTypes.ADD_PRODUCT_FAILED:
      return {
        ...state,
        addLoading: false,
      }
    case ActionTypes.SUGGEST_SEARCH_PRODUCT: {
      const updateStates = {};

      if (!action.payload) {
        updateStates.isSearched = false;
        updateStates.searchResults = [];
        updateStates.searchSuggests = [];
      }

      return {
        ...state,
        ...updateStates,
      }
    }
    case ActionTypes.SUGGEST_SEARCH_PRODUCT_SUCCESS: {
      return {
        ...state,
        searchSuggests: action.payload,
      }
    }
    case ActionTypes.SUGGEST_SEARCH_PRODUCT_FAILED:
      return {
        ...state,
        searchSuggests: [],
      }
    case ActionTypes.SUBMIT_PRODUCT_SUGGEST: {
      const updateStates = {
        isSearched: true,
        searchText: action.payload,
        searchResults: state.allProducts.filter((x) => x.name.includes(action.payload)),
      };

      return {
        ...state,
        ...updateStates,
      }
    }
    case ActionTypes.LOGOUT_DONE:
      return defaultState;
    default: return state;
  }
}