import React from 'react';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, fetchAccount } from '../features/auth/authSlice';
import { selectRelationships } from '../features/friendsSlice';

import styled from 'styled-components';

let UserIconPlaceholder = styled.div`
  height: 40px;
  width: 40px;

  margin-right: 5px;

  border-radius: 100%;

  border: 1px solid rgba(0, 0, 0, 0.2);

  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '${props => props.name[0]}';

    font-size: 1.5rem;
  }
`;

let UserIcon = styled.img`
  height: 40px;
  width: 40px;

  margin-right: 5px;

  border-radius: 100%;

  border: 1px solid rgba(0, 0, 0, 0.2);
`;

let CenterContainer = styled.div`
  display: flex;
  align-items: center;

  margin-right: 5px;
`;

let Link = styled.a`
  color: black !important;

  &:hover .username {
    text-decoration: underline;
  }
`;

function UserBlock({ user, friendOps }) {
  let showFriendRequestButton = friendOps != null;

  const auth = useSelector(selectCurrentUser);
  const relationships = useSelector(selectRelationships);
  const dispatch = useDispatch();

  if (user._id.toString() === auth._id.toString())
    return (
      <CenterContainer key={user._id}>
        {user.profilePicture ? (
          <UserIcon src={user.profilePicture} />
        ) : (
          <UserIconPlaceholder name={user.name} />
        )}

        {user.name}
      </CenterContainer>
    );

  let userStringId = user._id.toString();

  let areFriends, heRequested, youRequested;
  areFriends = relationships.friends.includes(userStringId);
  heRequested = relationships.theyRequested.includes(userStringId);
  youRequested = relationships.youRequested.includes(userStringId);

  let FriendRequestButton = () => {
    let buttonText;

    if (areFriends) {
      buttonText = 'Remove Friend';
    } else if (heRequested) {
      buttonText = 'Accept';
    } else if (youRequested) {
      buttonText = 'Cancel';
    } else {
      //nobody requested to be friends
      buttonText = 'Add';
    }

    return (
      <button
        onClick={() => {
          let promise;
          if (areFriends || youRequested) {
            promise = friendOps?.onFriendDelete(user._id);
          } else {
            promise = friendOps?.onFriendAdd(user._id);
          }

          //Update when user adds/removes a friend
          promise.then(() => {
            dispatch(fetchAccount());
          });
        }}
      >
        {buttonText}
      </button>
    );
  };

  return (
    <div>
      <CenterContainer>
        <Link href={`/profile/${user._id}`}>
          <CenterContainer>
            {user.profilePicture ? (
              <UserIcon src={user.profilePicture} />
            ) : (
              <UserIconPlaceholder name={user.name} />
            )}
            <span className="username">{user.name}</span>
          </CenterContainer>
        </Link>
        {showFriendRequestButton && <FriendRequestButton />}
      </CenterContainer>
    </div>
  );
}

export default UserBlock;
