import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/fakeApi" }),
  tagTypes: ["Posts"],
  endpoints: (builder) => ({
    addReaction: builder.mutation({
      query: ({ postId, reaction }) => ({
        url: `/posts/${postId}/reactions`,
        method: "POST",
        body: { reaction },
      }),
      async onQueryStarted({ postId, reaction }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getPosts", undefined, (draft) => {
            const post = draft.find((post) => post.id === postId);
            if (post) {
              post.reactions[reaction]++;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    getPosts: builder.query({
      query: () => "/posts",
      providesTags: (result = [], error, arg) => [
        "Posts",
        ...result.map(({ id }) => ({ type: "Posts", id })),
      ],
    }),
    getPost: builder.query({
      query: (postId) => `/posts/${postId}`,
      providesTags: (result, error, arg) => [{ type: "Posts", id: arg }],
    }),
    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: "/posts",
        method: "POST",
        body: initialPost,
      }),
      invalidatesTags: ["Post"],
    }),
    editPost: builder.mutation({
      query: (post) => ({
        url: `posts/${post.id}`,
        method: "PATCH",
        body: post,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Posts", id: arg.id }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useAddNewPostMutation,
  useEditPostMutation,
  useAddReactionMutation,
} = apiSlice;
