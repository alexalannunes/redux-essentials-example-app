import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Spinner } from "../../components/Spinner";
import { useEditPostMutation, useGetPostQuery } from "../api/apiSlice";

export const EditPostForm = ({ match }) => {
  const { postId } = match.params;

  const { data: post, isFetching } = useGetPostQuery(postId);

  const [updatePost] = useEditPostMutation();

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const history = useHistory();

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);

  const onSavePostClicked = async () => {
    if (title && content) {
      await updatePost({ id: postId, title, content });
      history.push(`/posts/${postId}`);
    }
  };

  let contentRender;

  if (isFetching) {
    contentRender = <Spinner text="loading post" />;
  } else {
    contentRender = (
      <div>
        <h2>Edit Post</h2>
        <form>
          <label htmlFor="postTitle">Post Title:</label>
          <input
            type="text"
            id="postTitle"
            name="postTitle"
            placeholder="What's on your mind?"
            value={title}
            onChange={onTitleChanged}
          />
          <label htmlFor="postContent">Content:</label>
          <textarea
            id="postContent"
            name="postContent"
            value={content}
            onChange={onContentChanged}
          />
        </form>
        <button type="button" onClick={onSavePostClicked}>
          Save Post
        </button>
      </div>
    );
  }

  return <section>{contentRender}</section>;
};
