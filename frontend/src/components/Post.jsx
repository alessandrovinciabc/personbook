import React from 'react';

import DeleteIcon from '../assets/icons/delete.svg';

// Redux
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';

import axios from 'axios';

function Post({ data, onDelete }) {
  let auth = useSelector(selectCurrentUser);

  function DropdownMenu() {
    return (
      <div>
        <button
          onClick={() => {
            axios.delete(`/api/post/${data._id.toString()}`).then(() => {
              onDelete(data._id.toString());
            });
          }}
        >
          <img src={DeleteIcon} alt="Delete Button" />
        </button>
      </div>
    );
  }

  return (
    <div>
      {auth?._id.toString() === data.author.toString() && <DropdownMenu />}
      {data.createdAt}
      <br />
      {data.text} <br />
      <br />
    </div>
  );
}

export default Post;
