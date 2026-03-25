import React from 'react';
import type { Property } from '../../types';

interface PropertyTableProps {
  properties: Property[];
  isLoading: boolean;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
}

const PropertyTable: React.FC<PropertyTableProps> = ({
  properties,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="skeleton">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="skeleton-row"></div>
          ))}
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="card card-empty">
        <p>No properties found. Add your first property to get started!</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Location</th>
            <th>Price</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id}>
              <td>
                <div className="table-title">{property.title}</div>
              </td>
              <td>
                <div className="table-subtitle">{property.location}</div>
              </td>
              <td>
                <div className="table-price">{formatPrice(property.price)}</div>
              </td>
              <td>
                <span className="table-badge">{property.propertyType}</span>
              </td>
              <td>
                <button onClick={() => onEdit(property)} className="table-action" title="Edit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button onClick={() => onDelete(property)} className="table-action-danger" title="Delete">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyTable;
