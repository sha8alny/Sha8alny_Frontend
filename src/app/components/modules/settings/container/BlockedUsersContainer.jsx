import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BlockedUsersPresentation from '../presentation/BlockedUsersPresentation';
import { useRouter } from 'next/navigation';
const fetchBlockedUsers = async (query = '') => {
  const response = await fetch(`http://localhost:5000/blocked?name=${query}`);
  if (!response.ok) {
    throw new Error('Failed to fetch blocked users');
  }
  return response.json();
};

const unblockUser = async (userId) => {
  const response = await fetch(`http://localhost:5000/blocked/${userId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to unblock user');
  }
  return userId;
};

const BlockedUsersContainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToUnblock, setUserToUnblock] = useState(null);
  const queryClient = useQueryClient();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['blockedUsers', searchTerm],
    queryFn: () => fetchBlockedUsers(searchTerm),
    staleTime: 1000 * 60 * 5, 
  });

  const router = useRouter();
  const unblockMutation = useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] });
      setIsModalOpen(false);
      setUserToUnblock(null);
    },
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUnblockClick = (userId, userName) => {
    setUserToUnblock({ id: userId, name: userName });
    setIsModalOpen(true);
  };

  const handleConfirmUnblock = () => {
    if (userToUnblock) {
      unblockMutation.mutate(userToUnblock.id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToUnblock(null);
  };

  const handleBackClick = () => {
    return
};

const navigateToProfile = (username) => {
    router.push(`/u/${username}`);
  };
  const blockedUsers = data?.blockedUsers || [];

  return (
    <BlockedUsersPresentation
      blockedUsers={blockedUsers}
      isLoading={isLoading}
      isError={isError}
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      onUnblockClick={handleUnblockClick}
      onBackClick={handleBackClick}
      isModalOpen={isModalOpen}
      userToUnblock={userToUnblock}
      closeModal={handleCloseModal}
      confirmUnblock={handleConfirmUnblock}
      navigateToProfile={navigateToProfile}
    />
  );
};

export default BlockedUsersContainer;