import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ConnectionsCard } from "@/app/components/modules/profile/presentation/ConnectionsPresentation";

// Mock components used in ConnectionsCard
jest.mock("../../app/components/ui/Avatar", () => ({
  Avatar: ({ children, className, onClick, "data-testid": dataTestId }) => (
    <div className={className} onClick={onClick} data-testid={dataTestId}>
      {children}
    </div>
  ),
  AvatarImage: ({ src, alt }) => (
    <img src={src} alt={alt} data-testid="avatar-image" />
  ),
  AvatarFallback: ({ children }) => (
    <div data-testid="avatar-fallback">{children}</div>
  ),
}));

jest.mock("@mui/icons-material", () => ({
  BlockOutlined: () => <div data-testid="block-icon">BlockOutlined</div>,
  ChatBubbleOutline: () => <div data-testid="chat-icon">ChatBubbleOutline</div>,
  MoreHoriz: ({ className, sx }) => (
    <div className={className} data-testid="more-icon">
      MoreHoriz
    </div>
  ),
  PersonAddAlt1: () => <div data-testid="person-add-icon">PersonAddAlt1</div>,
  PersonRemove: () => <div data-testid="person-remove-icon">PersonRemove</div>,
}));

jest.mock("../../app/components/ui/DropDownMenu", () => ({
  DropdownMenu: ({ children }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ asChild, children }) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenuContent: ({
    align,
    className,
    children,
    "data-testid": dataTestId,
  }) => (
    <div className={className} data-testid={dataTestId || "dropdown-content"}>
      {children}
    </div>
  ),
  DropdownMenuItem: ({
    className,
    onClick,
    children,
    "data-testid": dataTestId,
  }) => (
    <div className={className} onClick={onClick} data-testid={dataTestId}>
      {children}
    </div>
  ),
}));

jest.mock("../../app/components/ui/DialogMod", () => ({
  __esModule: true,
  default: ({ open, onOpenChange, AlertContent }) =>
    open ? <div data-testid="dialog-modal">{AlertContent}</div> : null,
}));

jest.mock("../../app/components/layout/GeneralDelete", () => ({
  __esModule: true,
  default: ({ onConfirmDelete, isLoading, isError, onOpenChange }) => (
    <div data-testid="general-delete">
      <button data-testid="confirm-delete-button" onClick={onConfirmDelete}>
        Confirm Delete
      </button>
      <button
        data-testid="cancel-delete-button"
        onClick={() => onOpenChange(false)}
      >
        Cancel
      </button>
      {isLoading && <div data-testid="loading-indicator">Loading...</div>}
      {isError && <div data-testid="error-message">Error</div>}
    </div>
  ),
}));

describe("ConnectionsCard Component", () => {
  const mockConnection = {
    _id: "conn123",
    name: "John Doe",
    username: "johndoe",
    headline: "Software Engineer",
    profilePicture: "/path/to/image.jpg",
    relation: "Coworker",
    connectedAt: "2 months ago",
  };

  const mockNavigateTo = jest.fn();
  const mockSetBlockModalOpen = jest.fn();
  const mockSetRemoveConnectionModalOpen = jest.fn();
  const mockOnRemove = jest.fn();
  const mockOnBlock = jest.fn();

  const renderCardWithProps = (customProps = {}) => {
    const defaultProps = {
      connection: mockConnection,
      navigateTo: mockNavigateTo,
      isMyProfile: true,
      blockModalOpen: false,
      setBlockModalOpen: mockSetBlockModalOpen,
      removeConnectionModalOpen: false,
      setRemoveConnectionModalOpen: mockSetRemoveConnectionModalOpen,
      onRemove: mockOnRemove,
      onBlock: mockOnBlock,
      isBlocking: false,
      isBlockingError: false,
      isRemoving: false,
      isRemovingError: false,
    };

    return render(<ConnectionsCard {...defaultProps} {...customProps} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders connection card with basic information", () => {
    renderCardWithProps();

    expect(
      screen.getByTestId(`connection-card-${mockConnection._id}`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`connection-name-${mockConnection._id}`)
    ).toHaveTextContent(mockConnection.name);
    expect(
      screen.getByTestId(`connection-headline-${mockConnection._id}`)
    ).toHaveTextContent(mockConnection.headline);
    expect(
      screen.getByTestId(`connection-connectedAt-${mockConnection._id}`)
    ).toHaveTextContent(mockConnection.connectedAt);
  });

  it("navigates to user profile when avatar is clicked", () => {
    renderCardWithProps();

    fireEvent.click(
      screen.getByTestId(`connection-avatar-${mockConnection._id}`)
    );
    expect(mockNavigateTo).toHaveBeenCalledWith(
      `/u/${mockConnection.username}`
    );
  });

  it("navigates to user profile when name is clicked", () => {
    renderCardWithProps();

    fireEvent.click(
      screen.getByTestId(`connection-name-${mockConnection._id}`)
    );
    expect(mockNavigateTo).toHaveBeenCalledWith(
      `/u/${mockConnection.username}`
    );
  });

  it("displays dropdown menu when isMyProfile is true", () => {
    renderCardWithProps();

    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-trigger")).toBeInTheDocument();
  });

  it("opens remove connection modal when remove option is clicked", () => {
    renderCardWithProps();

    const removeOption = screen.getByTestId(
      `connection-remove-option-${mockConnection._id}`
    );
    fireEvent.click(removeOption);

    expect(mockSetRemoveConnectionModalOpen).toHaveBeenCalledWith(true);
  });

  it("opens block modal when block option is clicked", () => {
    renderCardWithProps();

    const blockOption = screen.getByTestId(
      `connection-block-option-${mockConnection._id}`
    );
    fireEvent.click(blockOption);

    expect(mockSetBlockModalOpen).toHaveBeenCalledWith(true);
  });

  it("navigates to messages when message option is clicked in dropdown", () => {
    renderCardWithProps();

    const messageOption = screen.getByTestId(
      `connection-message-option-${mockConnection._id}`
    );
    fireEvent.click(messageOption);

    expect(mockNavigateTo).toHaveBeenCalledWith(
      `/messages?username=${mockConnection.username}`
    );
  });

  it("displays relation text when isMyProfile is false", () => {
    renderCardWithProps({ isMyProfile: false });

    expect(
      screen.getByTestId(`connection-relation-${mockConnection._id}`)
    ).toHaveTextContent(mockConnection.relation);
    expect(
      screen.queryByTestId(`connection-connectedAt-${mockConnection._id}`)
    ).not.toBeInTheDocument();
  });

  it("shows message button instead of dropdown menu when isMyProfile is false", () => {
    renderCardWithProps({ isMyProfile: false });

    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
    expect(
      screen.getByTestId(`connection-message-button-${mockConnection._id}`)
    ).toBeInTheDocument();
  });

  it("navigates to messages when message button is clicked (non-my-profile view)", () => {
    renderCardWithProps({ isMyProfile: false });

    const messageButton = screen.getByTestId(
      `connection-message-button-${mockConnection._id}`
    );
    fireEvent.click(messageButton);

    expect(mockNavigateTo).toHaveBeenCalledWith(
      `/messages?username=${mockConnection.username}`
    );
  });

  it("renders remove connection modal when removeConnectionModalOpen is true", () => {
    renderCardWithProps({ removeConnectionModalOpen: true });

    expect(screen.getByTestId("dialog-modal")).toBeInTheDocument();
    expect(screen.getByTestId("general-delete")).toBeInTheDocument();
  });

  it("renders block modal when blockModalOpen is true", () => {
    renderCardWithProps({ blockModalOpen: true });

    expect(screen.getByTestId("dialog-modal")).toBeInTheDocument();
    expect(screen.getByTestId("general-delete")).toBeInTheDocument();
  });

  it("calls onRemove when confirm delete is clicked in remove connection modal", () => {
    renderCardWithProps({ removeConnectionModalOpen: true });

    const confirmButton = screen.getByTestId("confirm-delete-button");
    fireEvent.click(confirmButton);

    expect(mockOnRemove).toHaveBeenCalled();
  });

  it("calls onBlock when confirm delete is clicked in block modal", () => {
    renderCardWithProps({ blockModalOpen: true });

    const confirmButton = screen.getByTestId("confirm-delete-button");
    fireEvent.click(confirmButton);

    expect(mockOnBlock).toHaveBeenCalled();
  });

  it("shows loading indicator when removing a connection", () => {
    renderCardWithProps({ removeConnectionModalOpen: true, isRemoving: true });

    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
  });

  it("shows error message when connection removal fails", () => {
    renderCardWithProps({
      removeConnectionModalOpen: true,
      isRemovingError: true,
    });

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
  });

  it("shows loading indicator when blocking a user", () => {
    renderCardWithProps({ blockModalOpen: true, isBlocking: true });

    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
  });

  it("shows error message when blocking fails", () => {
    renderCardWithProps({ blockModalOpen: true, isBlockingError: true });

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
  });
});
