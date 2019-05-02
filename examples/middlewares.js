
/**
 * applyMiddleware加载middlewares源码
 */
import compose from './compose';
/**
 * 
 * @param {*} middlewares 
 */
export default function applyMiddleware(...middlewares) {
    /**
     * @param {} next
     */
    return (next) => (reducer, initialState) => {
        let store = next(reducer, initialState); 
        let dispatch = store.dispatch;
        let chain = [];
        var middlewareAPI = {
            getState: store.getState,
            dispatch: (action) => dispatch(action),
        };
        chain = middlewares.map(middleware => middleware(middlewareAPI)); 
        dispatch = compose(...chain)(store.dispatch);
        return {
            ...store, dispatch,
        };
    }
}

/**
 * createStore 源码
 */

 

