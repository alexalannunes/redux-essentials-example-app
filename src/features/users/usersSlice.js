import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import { client } from "../../api/client";
import { apiSlice } from "../api/apiSlice";

const usersAdapter = createEntityAdapter();
const initialState = usersAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      transformResponse: (responseData) => {
        console.log(responseData);
        return usersAdapter.setAll(initialState, responseData);
      },
    }),
  }),
});

export const { useGetUsersQuery } = extendedApiSlice;

export const selectUsersResult = apiSlice.endpoints.getUsers.select();

const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data
);

// const emptyUsers = [];

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await client.get("/fakeApi/users");
  return response.data;
});

const usersSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {},
  // extraReducers(builder) {
  //   builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll);
  // },
});

export default usersSlice.reducer;

// export const selectAllUsers = createSelector(
//   selectUsersResult,
//   (usersResult) => usersResult?.data ?? emptyUsers
// );

// export const selectUserById = createSelector(
//   selectAllUsers,
//   (state, userId) => userId,
//   (users, userId) => users.find((user) => user.id === userId)
// );

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors((state) => selectUsersData(state) ?? initialState);
