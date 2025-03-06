import { store, persistor } from "./Store";
import { updateState, removeState} from "./DynamicSlice";
export default StoreHelper={
    save:  function save(key, value){
        store.dispatch(updateState({ key, value }));
    }, 
    get:  function get(key){
        return store.getState().dynamicState[key];
    }, 
    clear:  function clear(){
        persistor.purge();
    }, 
    deleteKey: function deleteKey(key) {
        store.dispatch(removeState({ key })); // Dispatch the action to delete the key
      },
      getAllKeys: function getAllKeys(){
        return store.getState().dynamicState
      }
}