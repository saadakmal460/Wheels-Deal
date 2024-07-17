import React , {useState,useEffect} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Profile = () => {

  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  
  useEffect(() => {
    const resolveUser = async () => {
      if (currentUser && currentUser instanceof Promise) {
        const result = await currentUser;

        setUser(result);
        
      } else {
        setUser(currentUser);
      }
    };
    resolveUser();
  }, [currentUser]);

  
  const handleClick = (e)=>{
    e.preventDefault();

    navigate('/editProfile')

  }


  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
          <div className="border-b px-4 pb-6">
            <div className="text-center my-4">
              <img className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4"
                src={user ? user.avatar : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} alt="Profile Picture" />
              <div className="py-2">
                <h3 className="font-bold text-2xl text-black mb-1">{user ? user.username : "Loading...."}</h3>
              </div>
            </div>
            <div className="flex gap-2 px-2">
              <button
                onClick={handleClick}
                className="flex-1 rounded-lg bg-blue-600 dark:bg-blue-800 text-white dark:text-white antialiased font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2">
                Edit Profile
              </button>
              <button
                className="flex-1 rounded-lg border-2 bg-red-600 text-white px-4 py-2">
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
