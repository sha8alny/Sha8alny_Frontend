import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MembershipCardContainer from '../../app/components/modules/membership/container/MembershipCardContainer';
import MembershipCardPresentation from '../../app/components/modules/membership/presentation/MembershipCardPresentation';
import DoneIcon from '@mui/icons-material/Done';

jest.mock('@mui/icons-material/Done', () => () => <span>✓</span>);

describe('Basic Card', () => {
  const mockItems = ['Feature 1', 'Feature 2', 'Feature 3'];
  const mockHandleUpgrade = jest.fn();
  const mockHandleCancel = jest.fn();

  const baseProps = {
    plan: 'Basic',
    price: "Free",
    items: mockItems,
    currentPlan: 'free',
    renewalDate: null,
    isMissed: false,
    handleUpgrade: mockHandleUpgrade,
    handleCancel: mockHandleCancel,
    isCancelling: false,
  };

  test('renders correctly with basic plan', () => {
    render(<MembershipCardContainer {...baseProps} />);
    
    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Current Plan')).toBeInTheDocument();
  });

  test('marks as current plan when currentPlan matches', () => {
    render(<MembershipCardContainer {...baseProps} currentPlan="free" />);
    expect(screen.getByText('Current Plan')).toBeInTheDocument();
  });



  test('shows downgrade button for premium users viewing basic plan', () => {
    render(<MembershipCardContainer {...baseProps} currentPlan="premium" />);
    expect(screen.getByText('Downgrade Plan')).toBeInTheDocument();
  });


  test('calls handleCancel when downgrade button is clicked', () => {
    render(<MembershipCardContainer {...baseProps} currentPlan="premium" />);
    fireEvent.click(screen.getByText('Downgrade Plan'));
    expect(mockHandleCancel).toHaveBeenCalled();
  });


});

describe('Premium Card', () => {
  const mockItems = ['Feature 1', 'Feature 2', 'Feature 3'];
  const mockHandler = jest.fn();

  const baseProps = {
    plan: 'Premium',
    price: '$9.99/month',
    items: mockItems,
    isCurrentPlan: false,
    isDowngrade: false,
    isPremium: false,
    hasPremiumExpired: false,
    handler: mockHandler,
    isCancelling: false,
  };

  test('renders correctly with basic props', () => {
    render(<MembershipCardPresentation {...baseProps} />);
    
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('$9.99/month')).toBeInTheDocument();
    expect(screen.getByText('Upgrade Plan')).toBeInTheDocument();
    expect(screen.getAllByText('✓')).toHaveLength(3);
  });


  test('shows current plan button when isCurrentPlan is true', () => {
    render(<MembershipCardPresentation {...baseProps} isCurrentPlan={true} />);
    const button = screen.getByText('Current Plan');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('disabled');
  });

 

  test('shows pending button when isCancelling is true', () => {
    render(<MembershipCardPresentation {...baseProps} isCancelling={true} />);
    const button = screen.getByText('Pending...');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('disabled');
  });

  test('calls handler when button is clicked', () => {
    render(<MembershipCardPresentation {...baseProps} />);
    fireEvent.click(screen.getByText('Upgrade Plan'));
    expect(mockHandler).toHaveBeenCalled();
  });

  test('shows renew button of renewal date is missed', () => {
    render(<MembershipCardPresentation {...baseProps} hasPremiumExpired={true} />);
    expect(screen.getByText('Renew Plan')).toBeInTheDocument();
  });

});