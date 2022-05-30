import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./rootReducer";

const middleWare = compose(applyMiddleware(thunk));
const store = createStore(rootReducer, middleWare);

export default store;
