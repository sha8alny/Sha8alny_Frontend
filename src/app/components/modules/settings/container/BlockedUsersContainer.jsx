import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BlockedUsersPresentation from '../presentation/BlockedUsersPresentation';
import { useRouter } from 'next/navigation';
import { unblockUser, fetchBlockedUsers } from '@/app/services/privacy';
import { useToast } from '@/app/context/ToastContext';

const BlockedUsersContainer = ({ toggleForm }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToUnblock, setUserToUnblock] = useState(null);
  const queryClient = useQueryClient();
  const pageSize = 10;
  const showToast = useToast();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['blockedUsers', searchTerm, currentPage],
    queryFn: () => fetchBlockedUsers(searchTerm, currentPage, pageSize),
  });

  const router = useRouter();
  const unblockMutation = useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] });
      setIsModalOpen(false);
      setUserToUnblock(null);
      showToast(`${userToUnblock.name} unblocked`);

    },
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleUnblockClick = (user) => {
    setUserToUnblock({ username: user.username, name: user.name });
    setIsModalOpen(true);
  };

  const handleConfirmUnblock = () => {
    if (userToUnblock) {
      console.log("confirmed to block",userToUnblock.username )
      unblockMutation.mutate(userToUnblock.username);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToUnblock(null);
  };

  const handleBackClick = () => {
    toggleForm();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const navigateToProfile = (username) => {
    router.push(`/u/${username}`);
  };

  const blockedUsers = data?.blockedUsers || [];
  // const totalCount = data?.numBlocks || 0;
  const isEmpty = !isLoading && !isError && blockedUsers.length === 0;

  return (
    <BlockedUsersPresentation
      blockedUsers={blockedUsers}
      isLoading={isLoading}
      isError={isError}
      isEmpty={isEmpty}
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      onUnblockClick={handleUnblockClick}
      onBackClick={handleBackClick}
      isModalOpen={isModalOpen}
      userToUnblock={userToUnblock}
      closeModal={handleCloseModal}
      confirmUnblock={handleConfirmUnblock}
      navigateToProfile={navigateToProfile}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      pageSize={pageSize}
    />
  );
};

export default BlockedUsersContainer;