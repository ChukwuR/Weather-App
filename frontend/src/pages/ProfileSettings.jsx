import DeleteAccountButton from '../components/DeleteAccountButton';
import LogoutButton from '../components/LogoutButton'
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import '../style/profileSettings.css'
import editProf from '../images/editProf.png'
import chanagePassword from '../images/changePassword.png'

function ProfileSettings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="profile-settings" style={{padding:'20px'}}>
      <h2>Settings</h2>

      <div className='settingsWrap row'>
        <div className='settingsCard editProfileCard col-12 col-sm-12 col-md-5 col-lg-4'>
          <div className='settingsImgWrap'>
            <Link to='/profileForm'>
              <img src={editProf} alt="edit-profile" />
            </Link>
          </div>
        </div>

        <div className='settingsCard changePasswordCard col-12 col-sm-12 col-md-5 col-lg-5'>
          <div className='settingsImgWrap'>
            <Link to='/changePasswordForm'>
              <img src={chanagePassword} alt="change-password" />
            </Link>
          </div>
        </div>
      </div>
      <div className='functionBtnWrap'>
        <div>
          <DeleteAccountButton />
        </div>
        <div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;