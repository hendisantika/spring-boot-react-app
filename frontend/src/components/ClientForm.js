import React, {useEffect, useState} from 'react';
import ClientService from '../services/ClientService';

/**
 * ClientForm Component
 * Form for creating and updating clients
 */
const ClientForm = ({client, onSave, onCancel}) => {
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (client) {
            setFormData({
                name: client.name || '',
                email: client.email || ''
            });
        } else {
            setFormData({name: '', email: ''});
        }
    }, [client]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setSubmitting(true);

        const savePromise = client
            ? ClientService.updateClient(client.id, formData)
            : ClientService.createClient(formData);

        savePromise
            .then(() => {
                setFormData({name: '', email: ''});
                setErrors({});
                onSave();
            })
            .catch(error => {
                console.error('Error saving client:', error);
                setErrors({submit: 'Failed to save client. Please try again.'});
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const handleCancel = () => {
        setFormData({name: '', email: ''});
        setErrors({});
        onCancel();
    };

    return (
        <div className="client-form">
            <h2>{client ? 'Edit Client' : 'Add New Client'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? 'error' : ''}
                        placeholder="Enter client name"
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                        placeholder="Enter client email"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                {errors.submit && (
                    <div className="error-message submit-error">{errors.submit}</div>
                )}

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={submitting}
                    >
                        {submitting ? 'Saving...' : (client ? 'Update Client' : 'Add Client')}
                    </button>
                    {client && (
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={handleCancel}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ClientForm;
