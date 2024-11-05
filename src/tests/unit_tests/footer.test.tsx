// Footer.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '@/app/components/footer';
import '@testing-library/jest-dom';


describe('Footer Component', () => {
  it('renders correctly', () => {
    render(<Footer />);

    // Check if the footer div is rendered
    const footerElement = screen.getByText(/footer here/i);
    expect(footerElement).toBeInTheDocument();

    // Check if the footer has the correct classes
    expect(footerElement).toHaveClass('h-12 w-full shadow-sm bg-slate-800 fixed bottom-0');
  });
});
