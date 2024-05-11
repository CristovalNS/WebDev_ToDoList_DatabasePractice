import styles from '../user_profile/userprofile.module.css';

function UserProfile({ user, onClose }) {
  if (!user) return null;

  const formattedDate = new Date(user.creationTime).toLocaleDateString("en-US", {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h1>User Profile</h1>
        <p>Email: </p>
        <p> {user.email} </p>
        <p>UID: </p> 
        <p> {user.uid} </p>
        <p>Date Created: </p>
        <p> {formattedDate} </p>
      </div>
    </div>
  );
}

export default UserProfile;
