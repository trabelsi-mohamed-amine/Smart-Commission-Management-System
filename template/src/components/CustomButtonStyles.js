// Custom button styles for the dashboard 
export const reverseButtonStyle = {
  primary: {
    backgroundColor: 'white',
    color: '#0d6efd',
    borderColor: '#0d6efd',
    transition: 'all 0.3s'
  },
  warning: {
    backgroundColor: 'white',
    color: '#ffc107',
    borderColor: '#ffc107',
    transition: 'all 0.3s'
  },
  danger: {
    backgroundColor: 'white',
    color: '#dc3545',
    borderColor: '#dc3545', 
    transition: 'all 0.3s'
  },
  success: {
    backgroundColor: 'white',
    color: '#198754',
    borderColor: '#198754',
    transition: 'all 0.3s'
  }
};

export const buttonHoverHandlers = {
  primary: {
    onMouseOver: (e) => {
      e.currentTarget.style.backgroundColor = '#0d6efd';
      e.currentTarget.style.color = 'white';
    },
    onMouseOut: (e) => {
      e.currentTarget.style.backgroundColor = 'white';
      e.currentTarget.style.color = '#0d6efd';
    }
  },
  warning: {
    onMouseOver: (e) => {
      e.currentTarget.style.backgroundColor = '#ffc107';
      e.currentTarget.style.color = 'white';
    },
    onMouseOut: (e) => {
      e.currentTarget.style.backgroundColor = 'white';
      e.currentTarget.style.color = '#ffc107';
    }
  },
  danger: {
    onMouseOver: (e) => {
      e.currentTarget.style.backgroundColor = '#dc3545';
      e.currentTarget.style.color = 'white';
    },
    onMouseOut: (e) => {
      e.currentTarget.style.backgroundColor = 'white';
      e.currentTarget.style.color = '#dc3545';
    }
  },
  success: {
    onMouseOver: (e) => {
      e.currentTarget.style.backgroundColor = '#198754';
      e.currentTarget.style.color = 'white';
    },
    onMouseOut: (e) => {
      e.currentTarget.style.backgroundColor = 'white';
      e.currentTarget.style.color = '#198754';
    }
  }
};
