import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import { fetchAccount } from '../features/auth/authSlice';

import axios from 'axios';

function PostForm({ onConfirm }) {
  let [text, setText] = useState('');

  const dispatch = useDispatch();

  async function handlePost() {
    await axios.post('/api/post', { text });
    setText('');

    onConfirm(); //Callback provided as prop

    dispatch(fetchAccount()); //Trigger update to show new post
  }

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <br />
      <button disabled={text.trim() === ''} onClick={handlePost}>
        Post
      </button>
    </div>
  );
}

export default PostForm;
