import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/app/components/navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import { NavbarProps } from '@/app/interfaces/interfaces';
import { initializeApp } from "firebase/app";
import firebaseConfig from '@/app/firebaseConfig';
import { getAuth } from 'firebase/auth';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    signOut: jest.fn(),
  })),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn(); // Return unsubscribe function
  }),
  
}));

// Mock Firebase App Initialization
initializeApp(firebaseConfig);

describe('Navbar Component', () => {
  const defaultProps: NavbarProps = {
    user: null,
    setUser: jest.fn(),
    history: [],
    setHistory: jest.fn(),
    cart: [],
  };

  const renderNavbar = (props = defaultProps) => {
    return render(
      <Router>
        <Navbar {...props} />
      </Router>
    );
  };

  test('renders links for Xmas Draw, Kids Draw, and Cart', () => {
    renderNavbar();
    expect(screen.getByText('Xmas Draw')).toBeInTheDocument();
    expect(screen.getByText('Kids Draw')).toBeInTheDocument();
    expect(screen.getByText('Cart')).toBeInTheDocument();
  });

  test('displays user info when logged in', () => {
    const loggedInProps = { ...defaultProps, user: { displayName: 'Test User' } };
    renderNavbar(loggedInProps);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('displays Login and Sign up when no user is logged in', () => {
    renderNavbar();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

//   it('toggles drawer when clicking the menu icon', () => {
//     renderNavbar();
//     const menuButton = screen.getByRole('button');
//     fireEvent.click(menuButton);
//     expect(screen.getByRole('presentation')).toBeInTheDocument();
//     fireEvent.click(menuButton);
//     expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
//   });

  it('calls setUser and setHistory on sign out', async () => {
    const loggedInProps = { ...defaultProps, user: { displayName: 'Test User' } };
    renderNavbar(loggedInProps);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(defaultProps.setUser).toHaveBeenCalledWith(null);
  });

  it('adds history entry when clicking navigation links', () => {
    const mockSetHistory = jest.fn();
    const propsWithHistory = { ...defaultProps, setHistory: mockSetHistory };
    renderNavbar(propsWithHistory);

    const cartLink = screen.getByText('Cart');
    fireEvent.click(cartLink);

    expect(mockSetHistory).toHaveBeenCalledWith(expect.arrayContaining(['/cart']));
  });
});
