import React, { useState } from 'react';

import OptionsIcon from '../assets/icons/options.svg';
import DeleteIcon from '../assets/icons/delete.svg';

// Redux
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';

import axios from 'axios';

import UserBlock from './UserBlock';
import styled from 'styled-components';
import Modal from './Modal';

let PostTime = styled.div`
  color: grey;
  font-size: 0.8rem;

  margin-bottom: 0.5rem;
  margin-top: 10px;
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

let Icon = styled.img`
  width: 1.8rem;
  height: 1.8rem;

  cursor: pointer;
`;

let CardTop = styled.div`
  display: flex;
  align-items: space-between;
`;

let CommentContainer = styled.div`
  word-wrap: break-word;
`;

function Comment({ data, onDelete }) {
  let auth = useSelector(selectCurrentUser);

  let [displayDeleteModal, setDisplayDeleteModal] = useState(false);
  let [displayDropdown, setDisplayDropdown] = useState(false);

  const timeOfPost = new Date(data.createdAt).toDateString();
  const hourOfPost = new Date(data.createdAt).toLocaleTimeString();

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
          </Dropdown>
        )}
      </RelativeContainer>
    );
  }

  return (
    <>
      <Modal
        onConfirm={() => {
          axios
            .delete(
              `/api/post/${data.postId.toString()}/comment/${data._id.toString()}`
            )
            .then(() => {
              onDelete();
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
      <CommentContainer>
        <CardTop>
          <UserBlock user={data.userId} />
          {auth?._id.toString() === data.userId._id.toString() && (
            <DropdownMenu />
          )}
        </CardTop>
        <PostTime>
          {timeOfPost} at {hourOfPost}
        </PostTime>
        {data.text}
      </CommentContainer>
    </>
  );
}

export default Comment;
