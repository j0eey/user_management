import { useNavigate } from 'react-router-dom';
import { MinimalNavbar } from '../components/MinimalNavbar';
import { NewUserForm } from '../components/auth/NewUserForm';
import useCreateUser from '../hooks/useCreateUser'; // Default import
import { useState } from 'react';
import { Modal } from '../components/ui/Modal';

export default function NewUserPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateUser();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = (data: Parameters<typeof mutate>[0]) => {
    mutate(data, {
      onSuccess: () => {
        setModalMessage('User created successfully!');
        setIsError(false);
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          navigate('/dashboard');
        }, 2000);
      },
      onError: () => {
        setModalMessage('Error creating user!');
        setIsError(true);
        setModalVisible(true);
      }
    });
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div>
      <MinimalNavbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] p-4">
        <NewUserForm 
          onSubmit={handleSubmit} 
          isSubmitting={isPending} 
        />
      </div>

      {/* Modal to show success or error */}
      {modalVisible && (
        <Modal 
          message={modalMessage} 
          isError={isError} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
}
