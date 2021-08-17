import React, { useState } from 'react';

import DeleteIcon from '../assets/icons/delete.svg';
import EditIcon from '../assets/icons/edit.svg';
import OptionsIcon from '../assets/icons/options.svg';

// Redux
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';

import axios from 'axios';

import PostForm from './PostForm';
import Modal from './Modal';
import styled from 'styled-components';

let Dropdown = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  width: max-content;
  overflow: hidden;

  background: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;

  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 100%);

  z-index: 50;
`;

let DropdownButton = styled.button`
  background: none;
  border: none;

  padding: 5px 10px;
  width: 100%;

  display: flex;
  align-items: center;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
`;

let RelativeContainer = styled.div`
  position: relative;
  width: fit-content;
`;

let PostContainer = styled.div`
  width: 100%;
  max-width: 500px;

  margin: 0 auto;
`;

let Icon = styled.img`
  width: 1.8rem;
  height: 1.8rem;
`;

let OptionsButton = styled.button`
  background: none;
  border: none;

  border-radius: 100%;

  width: 1.8rem;
  height: 1.8rem;

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

function Post({ data, onDelete }) {
  let auth = useSelector(selectCurrentUser);
  let [editMode, setEditMode] = useState(false);
  let [text, setText] = useState(data.text);
  let [displayDeleteModal, setDisplayDeleteModal] = useState(false);
  let [displayDropdown, setDisplayDropdown] = useState(false);

  function DropdownMenu() {
    return (
      <RelativeContainer>
        <OptionsButton
          onClick={() => {
            setDisplayDropdown((oldState) => !oldState);
          }}
        >
          <Icon src={OptionsIcon} alt="Options Button" />
        </OptionsButton>

        {displayDropdown && (
          <Dropdown>
            <DropdownButton
              onClick={() => {
                setDisplayDeleteModal(true);
              }}
            >
              <img src={DeleteIcon} alt="Delete Button" />
              Remove
            </DropdownButton>
            <DropdownButton
              onClick={() => {
                setEditMode(true);
              }}
            >
              <img src={EditIcon} alt="Edit Button" />
              Edit
            </DropdownButton>
          </Dropdown>
        )}
      </RelativeContainer>
    );
  }

  return (
    <PostContainer>
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
    </PostContainer>
  );
}

export default Post;
