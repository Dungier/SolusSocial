import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from "../../../utils/axios"

const initialState = {
    user: null,
    token: null,
    isLoading: false,
    status: null
};

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ username, password }) => {
        try {
            const { data } = await axios.post('/auth/register', {
                username,
                password,
            });
            if (data.token) {
                window.localStorage.setItem('token', data.token);
            }
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ username, password }) => {
        try {
            const { data } = await axios.post('/auth/login', {
                username,
                password,
            });
            if (data.token) {
                window.localStorage.setItem('token', data.token);
            }
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
);

export const getMe = createAsyncThunk('auth/getMe', async () => {
        try {
            const { data } = await axios.post('/auth/me');
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.token = null
            state.isLoading = false
            state.status = null
        },
    },
    extraReducers: (builder) => {
        builder
            //register
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.status = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.status = action.payload.message;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.status = action.error.message;
            })
            //login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.status = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.status = action.payload.message;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.status = action.error.message;
            })
            //Поверка авторизации
            .addCase(getMe.pending, (state) => {
            state.isLoading = true;
            state.status = null;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.isLoading = false;
                state.status = null;
                state.user = action.payload?.user;
                state.token = action.payload?.token;
            })
            .addCase(getMe.rejected, (state, action) => {
                state.isLoading = false;
                state.status = action.error.message;
            });
    }
})
export const checkIsAuth = state => Boolean(state.auth.token)

export const { logout } = authSlice.actions;
export default authSlice.reducer


/* const initialState = {
    user: null,
    token: null,
    isLoading: false,
    status: null,
}

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({username, password}) => {
    try{
        const {data} = await axios.post('/auth/register', {
            username,
            password,
        })
        if(data.token) {
            window.localStorage.setItem('token', data.token)
        }
        return data
    }catch (error){
        console.log(error)
    }
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: {
        [registerUser.pending]: (state) => {
            state.isLoading = true
            state.status = null
        },
        [registerUser.fulfilled]: (state, action) => {
            state.isLoading = false
            state.status = action.payload.message
            state.user = action.payload.user
            state.token = action.payload.token

        },
        [registerUser.rejected]: (state, action) => {
            state.status = action.payload.message
            state.isLoading = false
        },
    }
})
export default authSlice.reducer
*/