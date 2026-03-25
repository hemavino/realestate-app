import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { Property, PropertyFormValues } from '../../types';
import { PropertyType } from '../../types';

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: PropertyFormValues) => Promise<void>;
  property?: Property | null;
  isEditing: boolean;
}

const PropertyFormSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .matches(
      /^[a-zA-Z][a-zA-Z0-9\s\-./,\/]+$/,
      'Should start with a letter and contain only letters, numbers, spaces, hyphens (-), slashes (/), commas (,), and periods (.)'
    ),
  location: Yup.string()
    .required('Location is required')
    .min(3, 'Location must be at least 3 characters')
    .max(200, 'Location cannot exceed 200 characters')
    .matches(
      /^[a-zA-Z][a-zA-Z0-9\s\-./,]*$/,
      'Must start with a letter and contain only letters, numbers, spaces, commas, hyphens (-), slashes (/), and periods (.)'
    ),
  price: Yup.number()
    .required('Price is required')
    .positive('Price must be greater than 0')
    .typeError('Price must be a number'),
  propertyType: Yup.string()
    .required('Property Type is required')
    .oneOf(Object.values(PropertyType), 'Invalid property type'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters'),
});

const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  property,
  isEditing,
}) => {
  if (!isOpen) return null;

  const initialValues: PropertyFormValues = property
    ? {
        title: property.title,
        location: property.location,
        price: property.price,
        propertyType: property.propertyType,
        description: property.description,
      }
    : {
        title: '',
        location: '',
        price: 0,
        propertyType: null,
        description: '',
      };

  const handleSubmit = async (values: PropertyFormValues, { setSubmitting }: any) => {
    try {
      await onSubmit(values);
      onClose();
    } catch (error) {
      // Error is handled in parent component
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-wrapper">
        <div className="modal-backdrop" onClick={onClose}></div>

        <div className="modal-panel">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {isEditing ? 'Edit Property' : 'Add New Property'}
              </h3>

              <Formik
                initialValues={initialValues}
                validationSchema={PropertyFormSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting }) => (
                  <Form style={{ marginTop: '1rem' }}>                    
                    <div className="form-group">
                      <label htmlFor="title" className="form-label">
                        Title
                      </label>
                      <Field
                        id="title"
                        name="title"
                        type="text"
                        className="form-input"
                        placeholder="e.g., Beautiful Family Home"
                      />
                      <ErrorMessage name="title" component="div" className="form-error" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="location" className="form-label">
                        Location
                      </label>
                      <Field
                        id="location"
                        name="location"
                        type="text"
                        className="form-input"
                        placeholder="e.g., Dubai, UAE"
                      />
                      <ErrorMessage name="location" component="div" className="form-error" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="price" className="form-label">
                        Price
                      </label>
                      <Field
                        id="price"
                        name="price"
                        type="number"
                        className="form-input"
                        placeholder="e.g., 500000"
                      />
                      <ErrorMessage name="price" component="div" className="form-error" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="propertyType" className="form-label">
                        Property Type
                      </label>
                      <Field as="select" id="propertyType" name="propertyType" className="form-select">
                        <option value="">Select a type</option>
                        {Object.values(PropertyType).map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="propertyType" component="div" className="form-error" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="description" className="form-label">
                        Description
                      </label>
                      <Field
                        as="textarea"
                        id="description"
                        name="description"
                        rows={4}
                        className="form-textarea"
                        placeholder="Describe the property..."
                      />
                      <ErrorMessage name="description" component="div" className="form-error" />
                    </div>

                    <div className="modal-footer">
                      <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                        {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Add Property'}
                      </button>
                      <button type="button" onClick={onClose} disabled={isSubmitting} className="btn btn-secondary">
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFormModal;
