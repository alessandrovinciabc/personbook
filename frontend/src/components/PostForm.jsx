import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import { fetchAccount } from '../features/auth/authSlice';

import axios from 'axios';

function PostForm({ onConfirm, onCancel, post }) {
  let [text, setText] = useState(post?.text || '');

  const dispatch = useDispatch();

  let postId = post?._id.toString();

  async function handlePost() {
    if (postId) {
      await axios.put(`/api/post/${postId}`, { text });
    } else {
      await axios.post('/api/post', { text });
    }

    setText('');

    onConfirm?.(text); //Callback provided as prop

    dispatch(fetchAccount()); //Trigger update to show new post
  }

  return (
    <div>
      <textarea
        type="text"
        value={text}
        maxLength="1024"
        onChange={(e) => {
          setText(e.target.value);
        }}
      ></textarea>
      <br />
      <button disabled={text.trim() === ''} onClick={handlePost}>
        {postId ? 'Confirm' : 'Post'}
      </button>
      {postId && <button onClick={onCancel}>Cancel</button>}
    </div>
  );
}

export default PostForm;
