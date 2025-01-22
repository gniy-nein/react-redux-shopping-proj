import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import cartItems from "../../cartItems";
import axios from "axios";
// import { openModal } from "../modal/modalSlice";

const url = "https://www.course-api.com/react-useReducer-cart-project";

const initialState = {
  cartItems: [],
  amount: 0,
  total: 0,
  isLoading: false,
};

export const getCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (name, thunkAPI) => {
    // console.log(name);
    // console.log(thunkAPI.getState());
    try {
      // thunkAPI.dispatch(openModal());
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Something went wrong!!");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },

    removeItems: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
    },

    increase: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount + 1;
    },

    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      // if (cartItem.amount == 1) return;
      cartItem.amount = cartItem.amount - 1;
    },

    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;

      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });

      state.amount = amount;
      state.total = total;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(getCartItems.rejected, (state, action) => {
        console.log(action);
        state.isLoading = false;
      });

    // deprecated 
    // [getCartItems.pending]: (state) => {
    //   state.isLoading = true;
    // },
    // [getCartItems.fulfilled]: (state, action) => {
    //   state.isLoading = false;
    //   state.cartItems = action.payload;
    // },
    // [getCartItems.rejected]: (state, action) => {
    //   console.log(action);
    //   state.isLoading = false;
    // },
  },
});

console.log(cartSlice);
export const { clearCart, removeItems, increase, decrease, calculateTotals } =
  cartSlice.actions;
export default cartSlice.reducer;
