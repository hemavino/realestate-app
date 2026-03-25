import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import PropertyTable from '../../components/PropertyTable';
import PropertyFormModal from '../../components/PropertyFormModal';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import { propertiesAPI } from '../../services/api';
import type { Property, PropertyFormValues } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';

const Dashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const pageSize = 5;

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch properties
  const { data, isLoading, error } = useQuery({
    queryKey: ['properties', currentPage, pageSize, debouncedSearchTerm],
    queryFn: () =>
      propertiesAPI.getAll({
        pageNumber: currentPage,
        pageSize: pageSize,
        searchTerm: debouncedSearchTerm,
      }),
  });

  // Create property mutation
  const createMutation = useMutation({
    mutationFn: (values: PropertyFormValues) => propertiesAPI.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property added successfully!');
      setIsFormModalOpen(false);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to add property';
      toast.error(message);
    },
  });

  // Update property mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: PropertyFormValues }) =>
      propertiesAPI.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property updated successfully!');
      setIsFormModalOpen(false);
      setSelectedProperty(null);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update property';
      toast.error(message);
    },
  });

  // Delete property mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => propertiesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedProperty(null);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete property';
      toast.error(message);
    },
  });

  // Handlers
  const handleAddProperty = () => {
    setIsEditing(false);
    setSelectedProperty(null);
    setIsFormModalOpen(true);
  };

  const handleEditProperty = (property: Property) => {
    setIsEditing(true);
    setSelectedProperty(property);
    setIsFormModalOpen(true);
  };

  const handleDeleteProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (values: PropertyFormValues) => {
    if (isEditing && selectedProperty) {
      await updateMutation.mutateAsync({ id: selectedProperty.id, values });
    } else {
      await createMutation.mutateAsync(values);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedProperty) {
      deleteMutation.mutate(selectedProperty.id);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (data && currentPage < data.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div className="page-title-row">
            <h1 className="page-title">Property Listings</h1>
            <button onClick={handleAddProperty} className="btn btn-primary">
              <svg
                className="btn-icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Property
            </button>
          </div>

          {/* Error State */}
          {error && <div className="alert alert-error">Failed to load properties. Please try again.</div>}

          {/* Search */}
          <div className="search-wrapper">
            <input
              type="text"
              name="search"
              placeholder="Search by title, or location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
          </div>

          {/* Property Table */}
          <PropertyTable
            properties={data?.data || []}
            isLoading={isLoading}
            onEdit={handleEditProperty}
            onDelete={handleDeleteProperty}
          />

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination-mobile">
                <button onClick={handlePreviousPage} disabled={currentPage === 1} className="pagination-button">
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === data.totalPages}
                  className="pagination-button"
                >
                  Next
                </button>
              </div>
              <div className="pagination-desktop">
                <div>
                  <p className="pagination-info">
                    Showing page <span style={{ fontWeight: '500' }}>{currentPage}</span> of{' '}
                    <span style={{ fontWeight: '500' }}>{data.totalPages}</span> ({data.totalRecords} total properties)
                  </p>
                </div>
                <div>
                  <nav className="pagination-buttons">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1} className="pagination-button">
                      <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-5px' }}>
                        Prev
                      </span>
                      <svg style={{ height: '1.25rem', width: '1.25rem' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <span className="pagination-current">Page {currentPage}</span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === data.totalPages}
                      className="pagination-button"
                    >
                      <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-5px' }}>
                        Next
                      </span>
                      <svg style={{ height: '1.25rem', width: '1.25rem' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <PropertyFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedProperty(null);
        }}
        onSubmit={handleFormSubmit}
        property={selectedProperty}
        isEditing={isEditing}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProperty(null);
        }}
        onConfirm={handleConfirmDelete}
        property={selectedProperty}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default Dashboard;
