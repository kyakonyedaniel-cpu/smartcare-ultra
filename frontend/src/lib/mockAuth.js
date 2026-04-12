// Mock authentication service for demo purposes
// This simulates a backend without requiring a real server

const DEMO_CREDENTIALS = {
  'admin@demo.clinic': { password: 'demo1234', role: 'OWNER', tenant: 'Demo Clinic' },
  'admin@smartcare.ug': { password: 'superadmin123', role: 'OWNER', tenant: 'SmartCare Ultra' },
};

export const mockLogin = async (email, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const credentials = DEMO_CREDENTIALS[email];
  
  if (!credentials) {
    throw new Error('Invalid credentials');
  }

  if (credentials.password !== password) {
    throw new Error('Invalid credentials');
  }

  // Simulate successful login response
  return {
    token: `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    user: {
      id: `user_${email.split('@')[0]}`,
      email,
      firstName: 'Admin',
      lastName: 'User',
      role: credentials.role,
      tenant: { 
        id: `tenant_${email.split('@')[1]}`, 
        name: credentials.tenant, 
        status: 'ACTIVE' 
      },
      branch: { 
        id: 'branch_main', 
        name: 'Main Branch' 
      }
    }
  };
};

export const mockRegister = async (clinicName, email, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!clinicName || !email || !password) {
    throw new Error('All fields are required');
  }

  if (DEMO_CREDENTIALS[email]) {
    throw new Error('Email already registered');
  }

  // Add to demo credentials
  DEMO_CREDENTIALS[email] = { password, role: 'OWNER', tenant: clinicName };

  return {
    token: `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    user: {
      id: `user_${email.split('@')[0]}`,
      email,
      firstName: 'Admin',
      lastName: 'User',
      role: 'OWNER',
      tenant: { 
        id: `tenant_${Date.now()}`, 
        name: clinicName, 
        status: 'ACTIVE' 
      },
      branch: { 
        id: 'branch_main', 
        name: 'Main Branch' 
      }
    }
  };
};
