import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUserStart, deleteUserSucess, deleteUserFailure } from '../../Redux/User/UserSlice';
import { Modal, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { loading, error } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleClick = (e) => {
    e.preventDefault();
    navigate('/editProfile');
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/deleteUser/${user._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        dispatch(deleteUserFailure(errorData.error));
        return;
      }

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.error));
        return;
      }

      dispatch(deleteUserSucess());
      navigate('/');

    } catch (error) {
      dispatch(deleteUserFailure(error));
    } finally {
      setDeleting(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
          <div className="border-b px-4 pb-6">
            <div className="text-center my-4">
              <img 
                className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4"
                src={user ? user.avatar : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} 
                alt="Profile Picture" 
              />
              <div className="py-2">
                <h3 className="font-bold text-2xl text-black mb-1">{user ? user.username : "Loading...."}</h3>
              </div>
            </div>
            <div className="flex gap-2 px-2">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center gap-2 flex-1 rounded-lg border-2 bg-red-600 text-white px-4 py-2"
                disabled={loading}
              >
                <FaTrash className="text-xl" /> 
                {loading ? 'Deleting.....' : 'Delete Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Are you sure you want to delete your profile? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Profile;
