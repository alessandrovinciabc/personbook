import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import { fetchAccount } from '../features/auth/authSlice';

import axios from 'axios';

import styled from 'styled-components';

let PostTextArea = styled.textarea`
  resize: none;
  width: 100%;
  max-width: 400px;
  height: 100px;

  font-family: inherit;
`;

let PostButton = styled.button`
  width: 100%;
  max-width: 400px;

  height: 2rem;

  margin-top: 10px;

  background-color: #1089da;
  color: white;
  border: none;
  border-radius: 5px;

  cursor: pointer;

  &:hover {
    filter: opacity(0.8);
  }

  &:disabled {
    background-color: rgba(0, 0, 0, 0.2);
    filter: opacity(1);

    cursor: inherit;
  }
`;

let Container = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

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
    <Container>
      <PostTextArea
        type="text"
        value={text}
        maxLength="1024"
        onChange={(e) => {
          setText(e.target.value);
        }}
      ></PostTextArea>
      <br />
      <PostButton disabled={text.trim() === ''} onClick={handlePost}>
        {postId ? 'Confirm' : 'Post'}
      </PostButton>
      {postId && <button onClick={onCancel}>Cancel</button>}
    </Container>
  );
}

export default PostForm;
