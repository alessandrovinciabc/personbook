import React, { useState } from 'react';

import DeleteIcon from '../assets/icons/delete.svg';
import EditIcon from '../assets/icons/edit.svg';

// Redux
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';

import axios from 'axios';

import PostForm from './PostForm';
import Modal from './Modal';

function Post({ data, onDelete }) {
  let auth = useSelector(selectCurrentUser);
  let [editMode, setEditMode] = useState(false);
  let [text, setText] = useState(data.text);
  let [displayDeleteModal, setDisplayDeleteModal] = useState(false);

  function DropdownMenu() {
    return (
      <div>
        <button
          onClick={() => {
            setDisplayDeleteModal(true);
          }}
        >
          <img src={DeleteIcon} alt="Delete Button" />
          Remove
        </button>
        <button
          onClick={() => {
            setEditMode(true);
          }}
        >
          <img src={EditIcon} alt="Edit Button" />
          Edit
        </button>
      </div>
    );
  }

  return (
    <div>
      <Modal
        onConfirm={() => {
          axios.delete(`/api/post/${data._id.toString()}`).then(() => {
            onDelete(data._id.toString());
          });
          setDisplayDeleteModal(false);
        }}
        onCancel={() => {
          setDisplayDeleteModal(false);
        }}
        display={displayDeleteModal}
      >
        Are you sure you want to delete this post?
      </Modal>

      {auth?._id.toString() === data.author.toString() && <DropdownMenu />}

      {editMode ? (
        <PostForm
          post={data}
          onCancel={() => {
            setEditMode(false);
          }}
          onConfirm={(newText) => {
            setText(newText);
            setEditMode(false);
          }}
        />
      ) : (
        <>
          {data.createdAt}
          <br />
          {text} <br />
          <br />
        </>
      )}
    </div>
  );
}

export default Post;
