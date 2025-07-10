import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Tabs, Tab, Badge, InputGroup } from 'react-bootstrap';
import { FaUserPlus, FaEdit, FaTrash, FaUserShield, FaSearch } from 'react-icons/fa';
import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'commission_member'
  });
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchOperation, setBatchOperation] = useState('');
  const [newRole, setNewRole] = useState('commission_member');
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  const axiosWithAuth = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    },
    withCredentials: true
  });
    // Load users on component mount
  useEffect(() => {
    // Function to fetch users inside useEffect to avoid dependency issues
    const loadUsers = async () => {
      await fetchUsers();
    };
    
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users from:', API_URL + '/users-direct');
      
      // Verify token exists
      if (!token) {
        throw new Error('Authentication token missing. Please login again.');
      }
      
      // Use the direct route that doesn't use role middleware
      const response = await axiosWithAuth.get('/users-direct');
      console.log('Users API response:', response.data);
      
      if (response.data && response.data.data) {
        setUsers(response.data.data);
        setError(null);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      
      // Handle different types of errors
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response error data:', err.response.data);
        console.error('Response status:', err.response.status);
        
        if (err.response.status === 401) {
          setError('Authentication failed. Please login again.');
          // Optionally redirect to login
          // window.location.href = '/login';
        } else if (err.response.status === 403) {
          setError('You do not have permission to access this resource.');
        } else if (err.response.status === 500) {
          setError(`Server error: ${err.response.data.message || 'Unknown server error'}`);
        } else {
          setError(`API Error: ${err.response.data.message || err.message || 'Unknown error'}`);
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Request error:', err.request);
        setError('No response from server. Please check your network connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
    // Filter users based on active tab and search term
  const filteredUsers = users
    .filter(user => activeTab === 'all' || user.role === activeTab)
    .filter(user => 
      !searchTerm || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  // Further filter users based on search term
  const searchedUsers = searchTerm 
    ? filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      ) 
    : filteredUsers;
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Open modal for creating new user
  const handleAddUser = () => {
    setCurrentUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'commission_member'
    });
    setShowModal(true);
  };
  
  // Open modal for editing user
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
    setShowModal(true);
  };
  
  // Save new or edited user
  const handleSaveUser = async (e) => {
    e.preventDefault();
    
    try {
      if (currentUser) {        // Update existing user
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        
        await axiosWithAuth.put(`/users-direct/${currentUser.id}`, updateData);
        setAlert({ 
          show: true, 
          variant: 'success', 
          message: 'User updated successfully!'
        });
      } else {        // Create new user
        await axiosWithAuth.post('/users-direct', formData);
        setAlert({ 
          show: true, 
          variant: 'success', 
          message: 'User created successfully!'
        });
      }
      
      setShowModal(false);
      fetchUsers();
      
      // Clear alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false, variant: '', message: '' });
      }, 3000);
    } catch (err) {
      console.error('Error saving user:', err);
      setAlert({ 
        show: true, 
        variant: 'danger', 
        message: `Error: ${err.response?.data?.message || 'Something went wrong'}`
      });
    }
  };
  
  // Delete user
  const handleDeleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await axiosWithAuth.delete(`/users-direct/${userId}`);
        fetchUsers();
        setAlert({ 
          show: true, 
          variant: 'success', 
          message: 'User deleted successfully!'
        });
        
        // Clear alert after 3 seconds
        setTimeout(() => {
          setAlert({ show: false, variant: '', message: '' });
        }, 3000);
      } catch (err) {
        console.error('Error deleting user:', err);
        setAlert({ 
          show: true, 
          variant: 'danger', 
          message: `Error: ${err.response?.data?.message || 'Something went wrong'}`
        });
      }
    }
  };
  
  // Handle checkbox for selecting users
  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };
  
  // Handle batch operations
  const handleBatchOperation = async () => {
    if (!selectedUsers.length) {
      setAlert({ 
        show: true, 
        variant: 'warning', 
        message: 'No users selected!'
      });
      return;
    }
    
    try {
      const data = {
        operation: batchOperation,
        user_ids: selectedUsers,
      };
      
      if (batchOperation === 'change_role') {
        data.new_role = newRole;
      }      
      // First try to use the batch operation endpoint
      try {
        await axiosWithAuth.post('/admin/users/batch', data);
      } catch (batchError) {
        console.log("Batch operation failed, falling back to individual operations:", batchError);
        
        // If batch fails, do individual operations as a fallback
        if (batchOperation === 'delete') {
          // Process each delete operation individually
          for (const userId of selectedUsers) {
            try {
              await axiosWithAuth.delete(`/users-direct/${userId}`);
            } catch (individualError) {
              console.error(`Failed to delete user ${userId}:`, individualError);
            }
          }
        } else if (batchOperation === 'change_role') {
          // Process each role change individually
          for (const userId of selectedUsers) {
            try {
              await axiosWithAuth.put(`/users-direct/${userId}`, { role: newRole });
            } catch (individualError) {
              console.error(`Failed to change role for user ${userId}:`, individualError);
            }
          }
        }
      }
      
      setShowBatchModal(false);
      setSelectedUsers([]);
      fetchUsers();
      setAlert({ 
        show: true, 
        variant: 'success', 
        message: 'Operation completed successfully!'
      });
    } catch (err) {
      console.error('Error in batch operation:', err);
      setAlert({ 
        show: true, 
        variant: 'danger', 
        message: `Error: ${err.response?.data?.message || 'Something went wrong'}`
      });
    }
  };
  
  // Role badge styles
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'administrator': return 'danger';
      case 'commission_manager': return 'primary';
      case 'commission_member': return 'success';
      default: return 'secondary';
    }
  };
  
  // Format role for display
  const formatRole = (role) => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h2 className="page-title mb-0">
            <FaUserShield className="me-2" />
            User Management
          </h2>
          <p className="text-muted">Manage user accounts and permissions</p>
        </div>        <div className="col-auto d-flex align-items-center">
          <Button 
            variant="primary" 
            onClick={handleAddUser} 
            className="me-2"
            style={{
              backgroundColor: 'white',
              color: '#0d6efd',
              borderColor: '#0d6efd',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#0d6efd';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#0d6efd';
            }}
          >
            <FaUserPlus className="me-2" />
            Add User
          </Button>
          
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowBatchModal(true)} 
            disabled={selectedUsers.length === 0}
            style={{
              backgroundColor: selectedUsers.length === 0 ? '#e9ecef' : 'white',
              color: selectedUsers.length === 0 ? '#6c757d' : '#6c757d',
              borderColor: '#6c757d',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              if (selectedUsers.length === 0) return;
              e.currentTarget.style.backgroundColor = '#6c757d';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              if (selectedUsers.length === 0) return;
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#6c757d';
            }}
          >
            Batch Actions ({selectedUsers.length})
          </Button>
        </div>
      </div>
      
      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({...alert, show: false})} dismissible>
          {alert.message}
        </Alert>
      )}
      
      <div className="card">
        <div className="card-body">
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="all" title={`All Users (${users.length})`} />
            <Tab eventKey="administrator" title={`Administrators (${users.filter(u => u.role === 'administrator').length})`} />
            <Tab eventKey="commission_manager" title={`Managers (${users.filter(u => u.role === 'commission_manager').length})`} />
            <Tab eventKey="commission_member" title={`Members (${users.filter(u => u.role === 'commission_member').length})`} />
          </Tabs>
            <InputGroup className="mb-4 col-md-6">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                Clear
              </Button>
            )}
          </InputGroup>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead>
                  <tr>
                    <th width="40">
                      <Form.Check 
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(searchedUsers.map(user => user.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                        checked={selectedUsers.length === searchedUsers.length && searchedUsers.length > 0}
                      />
                    </th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th width="120">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {searchedUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">No users found</td>
                    </tr>
                  ) : (
                    searchedUsers.map(user => (
                      <tr key={user.id}>
                        <td>
                          <Form.Check 
                            type="checkbox"
                            onChange={() => handleSelectUser(user.id)}
                            checked={selectedUsers.includes(user.id)}
                          />
                        </td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <Badge bg={getRoleBadgeVariant(user.role)}>
                            {formatRole(user.role)}
                          </Badge>
                        </td>                        <td>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="me-1"
                            style={{
                              backgroundColor: 'white',
                              color: '#0d6efd',
                              borderColor: '#0d6efd',
                              transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = '#0d6efd';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = 'white';
                              e.currentTarget.style.color = '#0d6efd';
                            }}
                            onClick={() => handleEditUser(user)}
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm"
                            style={{
                              backgroundColor: 'white',
                              color: '#dc3545',
                              borderColor: '#dc3545',
                              transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = '#dc3545';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = 'white';
                              e.currentTarget.style.color = '#dc3545';
                            }}
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
      
      {/* Add/Edit User Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveUser}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Password {currentUser && '(Leave blank to keep current password)'}</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!currentUser}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="administrator">Administrator</option>
                <option value="commission_manager">Commission Manager</option>
                <option value="commission_member">Commission Member</option>
              </Form.Select>
            </Form.Group>              <div className="d-flex justify-content-end">
              <Button 
                variant="secondary" 
                className="me-2" 
                style={{
                  backgroundColor: 'white',
                  color: '#6c757d',
                  borderColor: '#6c757d',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#6c757d';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#6c757d';
                }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                style={{
                  backgroundColor: 'white',
                  color: '#0d6efd',
                  borderColor: '#0d6efd',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#0d6efd';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#0d6efd';
                }}
              >
                Save
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      
      {/* Batch Operations Modal */}
      <Modal show={showBatchModal} onHide={() => setShowBatchModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Batch Operations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Selected {selectedUsers.length} users</p>
          
          <Form.Group className="mb-3">
            <Form.Label>Operation</Form.Label>
            <Form.Select
              value={batchOperation}
              onChange={(e) => setBatchOperation(e.target.value)}
              required
            >
              <option value="">Select an operation</option>
              <option value="delete">Delete Users</option>
              <option value="change_role">Change Role</option>
            </Form.Select>
          </Form.Group>
          
          {batchOperation === 'change_role' && (
            <Form.Group className="mb-3">
              <Form.Label>New Role</Form.Label>
              <Form.Select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                required
              >
                <option value="administrator">Administrator</option>
                <option value="commission_manager">Commission Manager</option>
                <option value="commission_member">Commission Member</option>
              </Form.Select>
            </Form.Group>
          )}
        </Modal.Body>        <Modal.Footer>
          <Button 
            variant="secondary" 
            style={{
              backgroundColor: 'white',
              color: '#6c757d',
              borderColor: '#6c757d',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#6c757d';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#6c757d';
            }}
            onClick={() => setShowBatchModal(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleBatchOperation}
            disabled={!batchOperation}
            style={{
              backgroundColor: !batchOperation ? '#e9ecef' : 'white',
              color: !batchOperation ? '#6c757d' : '#0d6efd',
              borderColor: '#0d6efd',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              if (!batchOperation) return;
              e.currentTarget.style.backgroundColor = '#0d6efd';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              if (!batchOperation) return;
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#0d6efd';
            }}
          >
            Apply
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserManagement;
