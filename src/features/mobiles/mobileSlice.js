import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    loading: false,
    hasErrors: false,
    mobiles: []
};

const mobileSlice = createSlice({
    name: "mobiles",
    initialState,
    reducers: {
        getMobiles: (state) => {
            state.loading = true;
        },
        getMobilesSuccess: (state, action) => {
            state.mobiles = action.payload;
            state.hasErrors = false;
            state.loading = false;
        },
        getMobilesFailure: (state, action) => {
            state.loading = false;
            state.hasErrors = action.payload;

        }
    }
})

export const { getMobiles, getMobilesSuccess, getMobilesFailure } = mobileSlice.actions;
export const mobileSelector = state => state.mobiles;
export default mobileSlice.reducer;


export function fetchMobiles() {
    return async (dispatch) => {
        dispatch(getMobiles());

        try {
            const response = await fetch(`http://localhost:5000/api/v1/data/phones`);
            const data = await response.json();
            setTimeout(() => {
                dispatch(getMobilesSuccess(data.data))
            }, 500)
        } catch (err) {
            dispatch(getMobilesFailure(err))
        }
    }
}