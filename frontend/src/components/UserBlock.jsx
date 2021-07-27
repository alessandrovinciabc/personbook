import React from 'react';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, fetchAccount } from '../features/auth/authSlice';

function UserBlock({ user, friendOps }) {
  let { onFriendAdd, onFriendDelete } = friendOps;

  const auth = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  if (user._id.toString() === auth._id.toString())
    return <div key={user._id}>{user.name}</div>;

  let currentUserRequestedFriendship = auth.friends.includes(
    user._id.toString()
  );

  let userToDisplayRequestedFriendship = user.friends.includes(
    auth._id.toString()
  );

  let areFriends =
    currentUserRequestedFriendship && userToDisplayRequestedFriendship;

  let heRequested =
    !currentUserRequestedFriendship && userToDisplayRequestedFriendship;

  let youRequested =
    currentUserRequestedFriendship && !userToDisplayRequestedFriendship;

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
            promise = onFriendDelete(user._id);
          } else {
            promise = onFriendAdd(user._id);
          }

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
      {user.name}
      <FriendRequestButton />
    </div>
  );
}

export default UserBlock;
