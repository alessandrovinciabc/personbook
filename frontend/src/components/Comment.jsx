import React, { useEffect, useState } from 'react';

import DeleteIcon from '../assets/icons/delete.svg';

// Redux
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';

import axios from 'axios';

import UserBlock from './UserBlock';
import styled from 'styled-components';

let PostTime = styled.div`
  color: grey;
  font-size: 0.8rem;

  margin-bottom: 0.5rem;
  margin-top: 10px;
`;

function Comment({ data }) {
  let auth = useSelector(selectCurrentUser);

  const timeOfPost = new Date(data.createdAt).toDateString();
  const hourOfPost = new Date(data.createdAt).toLocaleTimeString();
  return (
    <div>
      <UserBlock user={data.userId} />
      <PostTime>
        {timeOfPost} at {hourOfPost}
      </PostTime>
      {data.text}
      <img src={DeleteIcon} alt="Delete Button" />
    </div>
  );
}

export default Comment;
