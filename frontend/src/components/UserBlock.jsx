import React from 'react';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, fetchAccount } from '../features/auth/authSlice';
import { selectRelationships } from '../features/friendsSlice';

function UserBlock({ user, friendOps }) {
  let { onFriendAdd, onFriendDelete } = friendOps;

  const auth = useSelector(selectCurrentUser);
  const relationships = useSelector(selectRelationships);
  const dispatch = useDispatch();

  if (user._id.toString() === auth._id.toString())
    return <div key={user._id}>{user.name}</div>;

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
            promise = onFriendDelete(user._id);
          } else {
            promise = onFriendAdd(user._id);
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
      {user.name}
      <FriendRequestButton />
    </div>
  );
}

export default UserBlock;
