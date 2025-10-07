import {render, screen} from '@testing-library/react';
import App from './App';

test('renders client management application', () => {
    render(<App/>);
    const headerElement = screen.getByRole('heading', {name: /Client Management System/i});
    expect(headerElement).toBeInTheDocument();
});
