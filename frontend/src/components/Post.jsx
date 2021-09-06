import React, { useEffect, useState } from 'react';

import DeleteIcon from '../assets/icons/delete.svg';
import EditIcon from '../assets/icons/edit.svg';
import OptionsIcon from '../assets/icons/options.svg';
import LikeIcon from '../assets/icons/like.svg';
import CommentIcon from '../assets/icons/comment.svg';

// Redux
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';

import axios from 'axios';

import UserBlock from './UserBlock';
import PostForm from './PostForm';
import Modal from './Modal';
import styled from 'styled-components';
import Comment from './Comment';

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
  max-width: 400px;

  margin: 1rem auto;

  padding: 0.5rem 1rem;

  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  background-color: white;
`;

let Icon = styled.img`
  width: 1.8rem;
  height: 1.8rem;

  cursor: pointer;
`;

let BlueIcon = styled.img`
  width: 1.8rem;
  height: 1.8rem;

  filter: invert(42%) sepia(84%) saturate(3740%) hue-rotate(183deg)
    brightness(97%) contrast(87%);

  cursor: pointer;
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

let CardTop = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
`;

let CardTopLeft = styled.div`
  margin-right: auto;
  display: flex;
  align-items: center;
`;

let CardDown = styled.div`
  display: flex;
  flex-direction: column;
`;

let PostTime = styled.div`
  color: grey;
  font-size: 0.8rem;

  margin-bottom: 0.5rem;
  margin-top: 10px;
`;

let PostText = styled.div`
  word-wrap: break-word;
  margin: 1rem 0;
`;

let PostControl = styled.div`
  display: flex;
  align-items: center;

  margin-right: 10px;
`;

let PostControlsContainer = styled.div`
  display: flex;
`;

let CommentSectionContainer = styled.div`
  padding: 1rem;
`;

function Post({ data, onDelete }) {
  let auth = useSelector(selectCurrentUser);
  let [author, setAuthor] = useState(null);

  let [likes, setLikes] = useState([]);
  let [comments, setComments] = useState([]);
  let [showComments, setShowComments] = useState(false);

  let [editMode, setEditMode] = useState(false);
  let [text, setText] = useState(data.text);
  let [displayDeleteModal, setDisplayDeleteModal] = useState(false);
  let [displayDropdown, setDisplayDropdown] = useState(false);

  const timeOfPost = new Date(data.createdAt).toDateString();
  const hourOfPost = new Date(data.createdAt).toLocaleTimeString();
  const youLikedThisPost = !!likes.find(
    (el) => el.userId.toString() === auth._id.toString()
  );

  useEffect(() => {
    axios.get(`/api/user/${data.author.toString()}`).then((response) => {
      setAuthor(response.data);
    });

    axios.get(`/api/post/${data._id.toString()}/like`).then((response) => {
      setLikes(response.data);
    });

    axios.get(`/api/post/${data._id.toString()}/comment`).then((response) => {
      setComments(response.data);
    });
  }, [data]);

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
                setDisplayDropdown((oldState) => !oldState);
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

  async function onLike() {
    axios.post(`/api/post/${data._id.toString()}/like`).then(() => {
      setLikes((oldState) => {
        let copy = JSON.parse(JSON.stringify(oldState));
        copy.push({ userId: auth._id, postId: data._id });

        return copy;
      });
    });
  }

  async function onDislike() {
    axios.delete(`/api/post/${data._id.toString()}/like`).then(() => {
      setLikes((oldState) => {
        let copy = JSON.parse(JSON.stringify(oldState));
        let indexOfLikeToRemove = copy.findIndex(
          (el) => el.userId.toString() === auth._id.toString()
        );

        copy.splice(indexOfLikeToRemove, 1);

        return copy;
      });
    });
  }

  async function onComment(_, text) {
    return await axios.post(`/api/post/${data._id.toString()}/comment`, {
      text,
    });
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

      <CardTop>
        <CardTopLeft>{author && <UserBlock user={author} />}</CardTopLeft>
        {auth?._id.toString() === data.author.toString() && <DropdownMenu />}
      </CardTop>

      {editMode ? (
        <PostForm
          post={data}
          handlePost={async (postId, text) => {
            return await axios.put(`/api/post/${postId}`, { text });
          }}
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
          <PostTime>
            {timeOfPost} at {hourOfPost}
          </PostTime>
          <PostText>{text}</PostText>
          <CardDown>
            <PostControlsContainer>
              <PostControl>
                {youLikedThisPost ? (
                  <BlueIcon onClick={onDislike} src={LikeIcon} />
                ) : (
                  <Icon onClick={onLike} src={LikeIcon} />
                )}
                {likes.length}
              </PostControl>
              <PostControl>
                <Icon
                  onClick={() => {
                    setShowComments(!showComments);
                  }}
                  src={CommentIcon}
                />
                {comments.length}
              </PostControl>
            </PostControlsContainer>
            {showComments && (
              <CommentSectionContainer>
                <PostForm
                  placeholder="Write a comment..."
                  handlePost={onComment}
                  onConfirm={(newComment) => {
                    setComments((oldComments) => {
                      let copy = JSON.parse(JSON.stringify(oldComments));

                      newComment.userId = auth;

                      copy.push(newComment);

                      return copy;
                    });
                  }}
                />
                <div>
                  {comments.map((comment) => {
                    return (
                      <Comment
                        key={comment._id.toString()}
                        data={comment}
                        onDelete={() => {
                          setComments((oldState) => {
                            let copy = JSON.parse(JSON.stringify(oldState));

                            copy.splice(
                              copy.findIndex(
                                (el) =>
                                  el._id.toString() === comment._id.toString()
                              ),
                              1
                            );

                            return copy;
                          });
                        }}
                      />
                    );
                  })}
                </div>
              </CommentSectionContainer>
            )}
          </CardDown>
        </>
      )}
    </PostContainer>
  );
}

export default Post;
