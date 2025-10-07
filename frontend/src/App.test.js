import {render, screen} from '@testing-library/react';
import App from './App';

test('renders client management header', () => {
    render(<App/>);
    const headerElement = screen.getByText(/Client Management System/i);
    expect(headerElement).toBeInTheDocument();
});
