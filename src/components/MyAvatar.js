// hooks
import useAuth from '../hooks/useAuth';
// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { userData } = useAuth();

  return (
    <Avatar
      src={userData?.avatar}
      alt={userData?.displayName}
      color={userData?.avatar ? 'default' : createAvatar(userData?.displayName).color}
      {...other}
    >
      {createAvatar(userData?.displayName).name}
    </Avatar>
  );
}
