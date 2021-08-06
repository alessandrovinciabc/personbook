// Redux
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';

import UserBlock from '../components/UserBlock';

import axios from 'axios';

function UsersList({ users }) {
  let auth = useSelector(selectCurrentUser);

  if (!(users.length > 0)) return null;

  function onFriendAdd(idOfRequestedFriend) {
    return axios.post(`/api/user/${auth._id}/friends`, {
      newFriend: idOfRequestedFriend,
    });
  }

  function onFriendDelete(idOfFriendToRemove) {
    return axios.delete(`/api/user/${auth._id}/friends/${idOfFriendToRemove}`);
  }

  return users.map((user) => (
    <UserBlock
      key={user._id}
      user={user}
      friendOps={{ onFriendAdd, onFriendDelete }}
    />
  ));
}

export default UsersList;
