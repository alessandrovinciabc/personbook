import React, { useEffect, useState } from 'react';

import DeleteIcon from '../assets/icons/delete.svg';

// Redux
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';

import axios from 'axios';

import UserBlock from './UserBlock';
import styled from 'styled-components';

function Comment({ data }) {
  let auth = useSelector(selectCurrentUser);
  return (
    <div>
      <UserBlock user={data.userId} />
      {data.text}
      <img src={DeleteIcon} alt="Delete Button" />
    </div>
  );
}

export default Comment;
