"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { searchUser } from "@/app/services/search";
import { makeAdmin } from "@/app/services/admin";
import { useToast } from "@/app/context/ToastContext";
import AdminModalPresentation from "../presentation/AdminModalPresentation";

/**
 * @namespace admin
 * @module admin
 */

/**
 * AdminModal container component that handles the logic for adding a new administrator.
 * This component manages state, API calls, and data mutations before passing data to the presentation component.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Controls whether the modal is open or closed
 * @param {Function} props.onOpenChange - Function to handle modal open state changes
 * @returns {JSX.Element} The rendered AdminModalPresentation component with required props
 */
 function AdminModalContainer({ open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const showToast = useToast();
  
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", searchTerm],
    queryFn: () => searchUser(searchTerm, "", "", "", "", 1, 3),
    enabled: open && searchTerm.length > 1,
    staleTime: 60000, 
  });

  const makeAdminMutation = useMutation({
    mutationFn: (username) => makeAdmin(username),
    onSuccess: (data) => {
      setSelectedUser(null);
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      showToast("User added as admin successfully", true);
    },
    onError: (error) => {
      showToast(`Error adding admin: ${error.message}`, false);
    },
  });

  const handleAddAdmin = () => {
    if (!selectedUser) return;
    makeAdminMutation.mutate(selectedUser.username);
  };

  const handleOpenChange = (newOpenState) => {
    if (!newOpenState) {
      setSelectedUser(null);
      setSearchTerm("");
    }
    onOpenChange(newOpenState);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleRemoveUser = () => {
    setSelectedUser(null);
  };

  return (
    <AdminModalPresentation
      open={open}
      onOpenChange={handleOpenChange}
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      users={users}
      isLoading={isLoading}
      selectedUser={selectedUser}
      onUserSelect={handleUserSelect}
      onRemoveUser={handleRemoveUser}
      onAddAdmin={handleAddAdmin}
      isPending={makeAdminMutation.isPending}
    />
  );
}

export default AdminModalContainer;