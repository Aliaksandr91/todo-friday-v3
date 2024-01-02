import {createSlice} from "@reduxjs/toolkit";
import {appActions} from "app/app.reducer";
import {authAPI, LoginParamsType} from "features/auth/auth.api";
import {clearTasksAndTodolists} from "common/actions";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";

const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
    }
});


// thunks
const login = createAppAsyncThunk<{
    isLoggedIn: boolean
}, LoginParamsType>(`${slice.name}/login`, async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue, getState} = thunkAPI;
    try {
        dispatch(appActions.setAppStatus({status: "loading"}));
        const res = await authAPI
            .login(arg)

        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatus({status: "succeeded"}));
            return {isLoggedIn: true}
        } else {
            // ❗ Если у нас fieldsErrors есть значит мы будем отображать эти ошибки
            // в конкретном поле в компоненте (пункт 7)
            // ❗ Если у нас fieldsErrors нету значит отобразим ошибку глобально
            const isShowAppError = !res.data.fieldsErrors.length
            handleServerAppError(res.data, dispatch, isShowAppError);
            return rejectWithValue(res.data);
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null);
    }
})


const logout = createAppAsyncThunk<{
    isLoggedIn: boolean
}, undefined>(`${slice.name}/logout`, async (_, thunkAPI) => {
    const {dispatch, rejectWithValue, getState} = thunkAPI;
    try {
        dispatch(appActions.setAppStatus({status: "loading"}));
        const res = await authAPI
            .logout()

        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatus({status: "succeeded"}));
            dispatch(clearTasksAndTodolists());
            return {isLoggedIn: false}
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null);
    }
})

const initializeApp = createAppAsyncThunk<{
    isLoggedIn: boolean
}, undefined>(`${slice.name}/initializeApp`, async (_, thunkAPI) => {
    const {dispatch, rejectWithValue, getState} = thunkAPI;
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            return {isLoggedIn: true}
        } else {
            //TODO
            //handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null);
    } finally {
        dispatch(appActions.setAppInitialized({isInitialized: true}));
    }
})

export const authThunks = {login, logout, initializeApp}
export const authReducer = slice.reducer;