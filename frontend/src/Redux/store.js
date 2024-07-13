import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from '../Redux/User/UserSlice'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import persistStore from 'redux-persist/es/persistStore'

const rootReducer = combineReducers({user: userReducer})

const persisitConfig = {
  key:'root',
  storage,
  version:1
}

const persistedReducer = persistReducer(persisitConfig , rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),


})

export const persistor= persistStore(store);
