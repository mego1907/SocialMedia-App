import types from "../types";

const initState = {
  // login: !!getFromStorage("Authorization"),
  login: false,
  infoUser: {},
  loading: false,
  message: "",
};

const loginReducer =  (state = initState, action) => {
  switch (action.type) {
    case types.SIGN_IN:
      return {
        ...state,
        login: action.payload,
      };

    case types.SIGN_UP:
      return {
        ...state,
      }

    case types.GET_USER_INFO:
      return {
        ...state,
        infoUser: action.payload,
      };

    case types.LOGOUT:
      return {
        ...state,
        user: {},
      };

    default:
      return state;
  }
};

export default loginReducer;