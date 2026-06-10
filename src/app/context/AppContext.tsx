import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_URL = (typeof window !== 'undefined' && localStorage.getItem('brickbrain_api_url')) || import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && (window as any).Capacitor ? 'http://10.221.102.185:3001' : '');

// Interfaces
export interface UserProfile {
  name: string;
  email: string;
  role: string;
  phone: string;
}

export interface ProjectEstimate {
  projectName: string;
  plotSize: number;
  floors: number;
  location: string;
  constructionType: string;
  materialQuality: 'Basic' | 'Standard' | 'Premium';
  budgetRange: string;
  totalCost: number;
  rooms: number;
  bedrooms: number;
  kitchens: number;
  breakdown: {
    materials: number;
    labor: number;
    interior: number;
    tax: number;
  };
  status?: 'Completed' | 'In Progress';
  date?: string;
  baseMaterialsCost?: number;
}

export interface RequiredMaterial {
  name: string;
  pricePerUnit: number;
  quantity: number;
}

export interface Expense {
  id: string;
  vendor: string;
  material: string;
  quantity: string;
  amount: number;
  date: string;
}

export interface Milestone {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  progress: number;
  date: string;
}

export interface Worker {
  id: string;
  name: string;
  role: string;
  status: 'Present' | 'Absent';
  wage: number;
}

export interface Defect {
  id: string;
  type: string;
  location: string;
  severity: 'High' | 'Medium' | 'Low';
  confidence: string;
  status: 'Critical' | 'Review' | 'Minor' | 'Resolved';
  image?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'contractor';
  text: string;
  time: string;
}

export interface Invoice {
  id: string;
  vendor: string;
  amount: number;
  status: 'Paid' | 'Pending';
  date: string;
}

export interface AppSettings {
  darkMode: boolean;
  currency: 'INR' | 'USD' | 'EUR';
  language: string;
  notificationsEnabled: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'warning' | 'success';
  message: string;
  time: string;
  read: boolean;
}

interface AppContextType {
  user: UserProfile;
  project: ProjectEstimate;
  expenses: Expense[];
  milestones: Milestone[];
  workers: Worker[];
  detections: Defect[];
  chatMessages: ChatMessage[];
  invoices: Invoice[];
  settings: AppSettings;
  notifications: NotificationItem[];
  requiredList: RequiredMaterial[];
  projects: ProjectEstimate[];
  isAuthenticated: boolean;
  isLoading: boolean;
  
  updateUser: (data: Partial<UserProfile>) => void;
  calculateEstimate: (inputs: Omit<ProjectEstimate, 'totalCost' | 'breakdown'>) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  toggleMilestone: (id: string) => void;
  setAttendance: (id: string, status: 'Present' | 'Absent') => void;
  addWorker: (worker: Omit<Worker, 'id'>) => void;
  uploadSitePhoto: (imageSrc: string) => Promise<void>;
  resolveDefect: (id: string) => void;
  sendChatMessage: (text: string) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'date'>) => void;
  payInvoice: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  clearNotifications: () => void;
  markNotificationRead: (id: string) => void;
  updateProject: (data: Partial<ProjectEstimate>) => void;
  saveProject: (proj: ProjectEstimate) => void;
  deleteProject: (name: string) => void;
  addToRequiredList: (name: string, price: number) => void;
  updateQuantity: (name: string, quantity: number) => void;
  removeFromRequiredList: (name: string) => void;
  updateCartPrices: (localFactor: number, pricing: { name: string; basePrice: number }[]) => void;
  
  login: (email: string, password: string) => Promise<boolean>;
  signup: (formData: any) => Promise<boolean>;
  googleLogin: (credential: string) => Promise<boolean>;
  guestLogin: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_PROJECT: ProjectEstimate = {
  projectName: 'My Dream House',
  plotSize: 1500,
  floors: 2,
  location: 'Bangalore, Karnataka',
  constructionType: 'Residential',
  materialQuality: 'Premium',
  budgetRange: '40-50 Lakhs',
  totalCost: 4567890,
  rooms: 4,
  bedrooms: 2,
  kitchens: 1,
  breakdown: {
    materials: 2345000,
    labor: 1245000,
    interior: 876000,
    tax: 201890
  }
};

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: true,
  currency: 'INR',
  language: 'English',
  notificationsEnabled: true
};

// Fetch wrapper that always includes credentials (cookies)
function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state — no localStorage, determined by server response
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // All state starts empty — populated exclusively from server
  const [projects, setProjects] = useState<ProjectEstimate[]>([]);
  const [user, setUser] = useState<UserProfile>({
    name: '',
    email: '',
    role: 'Homeowner',
    phone: ''
  });
  const [project, setProject] = useState<ProjectEstimate>(DEFAULT_PROJECT);
  const [requiredList, setRequiredList] = useState<RequiredMaterial[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [detections, setDetections] = useState<Defect[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Helper to populate all state from a server response
  const hydrateState = useCallback((data: any) => {
    if (data.projects) setProjects(data.projects);
    if (data.activeProject) setProject(data.activeProject);
    if (data.cart) setRequiredList(data.cart);
    if (data.expenses) setExpenses(data.expenses);
    if (data.milestones) setMilestones(data.milestones);
    if (data.workers) setWorkers(data.workers);
    if (data.detections) setDetections(data.detections);
    if (data.chatMessages) setChatMessages(data.chatMessages);
    if (data.invoices) setInvoices(data.invoices);
    if (data.settings) setSettings(data.settings);
    if (data.notifications) setNotifications(data.notifications);
    if (data.profile) setUser(data.profile);
  }, []);

  // Reset all state to empty
  const resetState = useCallback(() => {
    setProjects([]);
    setProject(DEFAULT_PROJECT);
    setRequiredList([]);
    setExpenses([]);
    setMilestones([]);
    setWorkers([]);
    setDetections([]);
    setChatMessages([]);
    setInvoices([]);
    setSettings(DEFAULT_SETTINGS);
    setNotifications([]);
    setUser({ name: '', email: '', role: 'Homeowner', phone: '' });
  }, []);

  // Helper to sync state updates with server
  const syncStateWithServer = async (updatedFields: any) => {
    if (!isAuthenticated) return;
    try {
      await apiFetch(`${API_URL}/api/state`, {
        method: 'POST',
        body: JSON.stringify(updatedFields)
      });
    } catch (e) {
      console.warn("Backend sync failed.", e);
    }
  };

  // Handle CSS class toggle for dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Check auth status on mount — cookie is sent automatically
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiFetch(`${API_URL}/api/state`);
        if (res.ok) {
          const data = await res.json();
          hydrateState(data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          resetState();
        }
      } catch (e) {
        console.warn("Could not connect to backend server on startup.");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [hydrateState, resetState]);

  // Actions
  const updateUser = (data: Partial<UserProfile>) => {
    setUser(prev => {
      const next = { ...prev, ...data };
      syncStateWithServer({ profile: next });
      return next;
    });
  };

  const calculateEstimate = (inputs: Omit<ProjectEstimate, 'totalCost' | 'breakdown'>) => {
    const plotSizeNum = Number(inputs.plotSize) || 1000;
    const floorsNum = Number(inputs.floors) || 1;
    
    let ratePerSqFt = 2000;
    if (inputs.materialQuality === 'Standard') ratePerSqFt = 2800;
    if (inputs.materialQuality === 'Premium') ratePerSqFt = 3900;

    if (inputs.constructionType === 'Commercial') ratePerSqFt *= 1.25;
    if (inputs.constructionType === 'Industrial') ratePerSqFt *= 1.4;

    const totalArea = plotSizeNum * floorsNum;
    const calculatedTotal = Math.round(totalArea * ratePerSqFt);

    const materials = Math.round(calculatedTotal * 0.52);
    const labor = Math.round(calculatedTotal * 0.28);
    const interior = Math.round(calculatedTotal * 0.15);
    const tax = Math.round(calculatedTotal * 0.05);

    const newProject: ProjectEstimate = {
      ...inputs,
      totalCost: calculatedTotal,
      breakdown: { materials, labor, interior, tax },
      status: 'In Progress',
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    const updatedProj = { ...newProject, status: 'In Progress' as const };
    
    // Compute nextProjectsList synchronously
    const exists = projects.some(p => p.projectName.toLowerCase() === newProject.projectName.toLowerCase());
    const nextProjectsList = exists
      ? projects.map(p => p.projectName.toLowerCase() === newProject.projectName.toLowerCase() ? updatedProj : p)
      : [updatedProj, ...projects];

    // Compute nextNotificationsList synchronously
    const alertId = (notifications.length + 1).toString();
    const newNotification: NotificationItem = {
      id: alertId,
      type: 'success',
      message: `AI generated new estimate: ₹${(calculatedTotal / 100000).toFixed(2)} Lakhs`,
      time: 'Just now',
      read: false
    };
    const nextNotificationsList = [newNotification, ...notifications];

    setProject(updatedProj);
    setProjects(nextProjectsList);
    setNotifications(nextNotificationsList);

    syncStateWithServer({
      projects: nextProjectsList,
      activeProject: updatedProj,
      notifications: nextNotificationsList
    });
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newExp: Expense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9),
      date: today
    };
    const newInv: Invoice = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      vendor: expense.vendor,
      amount: expense.amount,
      status: 'Paid',
      date: today
    };
    
    const nextExp = [newExp, ...expenses];
    const nextInv = [newInv, ...invoices];

    setExpenses(nextExp);
    setInvoices(nextInv);
    syncStateWithServer({ expenses: nextExp, invoices: nextInv });
  };

  const toggleMilestone = (id: string) => {
    const next = milestones.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === 'completed' ? 'pending' : 'completed';
        return {
          ...m,
          status: nextStatus,
          progress: nextStatus === 'completed' ? 100 : 0,
          date: nextStatus === 'completed' ? new Date().toISOString().split('T')[0] : 'Pending'
        };
      }
      return m;
    });
    setMilestones(next);
    syncStateWithServer({ milestones: next });
  };

  const setAttendance = (id: string, status: 'Present' | 'Absent') => {
    const next = workers.map(w => (w.id === id ? { ...w, status } : w));
    setWorkers(next);
    syncStateWithServer({ workers: next });
  };

  const addWorker = (worker: Omit<Worker, 'id'>) => {
    const newWorker: Worker = {
      ...worker,
      id: Math.random().toString(36).substr(2, 9)
    };
    const next = [...workers, newWorker];
    setWorkers(next);
    syncStateWithServer({ workers: next });
  };

  const uploadSitePhoto = async (imageSrc: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const id = Math.random().toString(36).substr(2, 9);
        const defects = [
          { type: 'Brick Mortar Crack', location: 'East Wall - Level 2', severity: 'Medium' as const, confidence: '91%', status: 'Review' as const },
          { type: 'Concrete Void', location: 'Roof Lintel Slab Corner', severity: 'High' as const, confidence: '94%', status: 'Critical' as const }
        ];

        const pick = defects[Math.floor(Math.random() * defects.length)];
        const newDefect: Defect = {
          id,
          type: pick.type,
          location: pick.location,
          severity: pick.severity,
          confidence: pick.confidence,
          status: pick.status,
          image: imageSrc
        };

        const newNotification: NotificationItem = {
          id: Math.random().toString(36).substr(2, 9),
          type: pick.severity === 'High' ? 'warning' : 'info',
          message: `AI Defect Detected: ${pick.type} at ${pick.location}`,
          time: 'Just now',
          read: false
        };

        const nextDetections = [newDefect, ...detections];
        const nextNotifications = [newNotification, ...notifications];

        setDetections(nextDetections);
        setNotifications(nextNotifications);
        syncStateWithServer({ detections: nextDetections, notifications: nextNotifications });

        resolve();
      }, 1500);
    });
  };

  const resolveDefect = (id: string) => {
    const next = detections.map(d => (d.id === id ? { ...d, status: 'Resolved' } : d));
    setDetections(next);
    syncStateWithServer({ detections: next });
  };

  const sendChatMessage = (text: string) => {
    const today = new Date();
    const timeString = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      time: timeString
    };

    const nextUserMsgs = [...chatMessages, userMsg];
    setChatMessages(nextUserMsgs);
    syncStateWithServer({ chatMessages: nextUserMsgs });

    setTimeout(() => {
      const contractorResponses = [
        "Noted! I will instruct the site supervisors about this immediately.",
        "We are on it. I will send you a photo update of the progress in an hour.",
        "Yes, the cement bags are safely stacked. We are starting plastering tomorrow.",
        "The electrician has completed 80% of the conduit routing. Plumbing is scheduled next."
      ];
      
      const replyText = contractorResponses[Math.floor(Math.random() * contractorResponses.length)];
      const replyMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'contractor',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => {
        const nextContractorMsgs = [...prev, replyMsg];
        syncStateWithServer({ chatMessages: nextContractorMsgs });
        return nextContractorMsgs;
      });
    }, 1500);
  };

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newInv: Invoice = {
      ...invoice,
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: today
    };
    const next = [newInv, ...invoices];
    setInvoices(next);
    syncStateWithServer({ invoices: next });
  };

  const payInvoice = (id: string) => {
    const next = invoices.map(inv => (inv.id === id ? { ...inv, status: 'Paid' } : inv));
    setInvoices(next);
    syncStateWithServer({ invoices: next });
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const next = { ...settings, ...newSettings };
    setSettings(next);
    syncStateWithServer({ settings: next });
  };

  const clearNotifications = () => {
    setNotifications([]);
    syncStateWithServer({ notifications: [] });
  };

  const markNotificationRead = (id: string) => {
    const next = notifications.map(n => (n.id === id ? { ...n, read: true } : n));
    setNotifications(next);
    syncStateWithServer({ notifications: next });
  };

  const updateProject = async (data: Partial<ProjectEstimate>) => {
    const nextProj = { ...project, ...data };
    
    const nextProjectsList = projects.some(p => p.projectName.toLowerCase() === nextProj.projectName.toLowerCase())
      ? projects.map(p => p.projectName.toLowerCase() === nextProj.projectName.toLowerCase() ? nextProj : p)
      : projects;

    setProject(nextProj);
    setProjects(nextProjectsList);

    try {
      await apiFetch(`${API_URL}/api/project`, {
        method: 'POST',
        body: JSON.stringify({ project: nextProj })
      });
    } catch (e) {
      console.warn("Backend update failed.");
    }
  };

  const saveProject = async (proj: ProjectEstimate) => {
    const updatedProj = {
      ...proj,
      status: proj.status || 'In Progress',
      date: proj.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
    setProjects(prev => {
      const exists = prev.some(p => p.projectName.toLowerCase() === proj.projectName.toLowerCase());
      if (exists) {
        return prev.map(p => p.projectName.toLowerCase() === proj.projectName.toLowerCase() ? updatedProj : p);
      } else {
        return [updatedProj, ...prev];
      }
    });

    try {
      await apiFetch(`${API_URL}/api/project`, {
        method: 'POST',
        body: JSON.stringify({ project: updatedProj })
      });
    } catch (e) {
      console.warn("Backend update failed.");
    }
  };

  const deleteProject = async (name: string) => {
    setProjects(prev => {
      return prev.filter(p => p.projectName.toLowerCase() !== name.toLowerCase());
    });

    try {
      await apiFetch(`${API_URL}/api/projects/${encodeURIComponent(name)}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn("Backend delete failed.");
    }
  };

  const addToRequiredList = async (name: string, price: number) => {
    let existingItem = requiredList.find(item => item.name === name);
    setRequiredList(prev => {
      if (existingItem) {
        return prev.map(item => 
          item.name === name ? { ...item, quantity: item.quantity + 1, pricePerUnit: price } : item
        );
      }
      return [...prev, { name, pricePerUnit: price, quantity: 1 }];
    });

    try {
      const nextQty = existingItem ? existingItem.quantity + 1 : 1;
      const res = await apiFetch(`${API_URL}/api/cart`, {
        method: 'POST',
        body: JSON.stringify({ item: { name, pricePerUnit: price, quantity: nextQty } })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.cart) setRequiredList(data.cart);
        if (data.activeProject) setProject(data.activeProject);
        if (data.projects) setProjects(data.projects);
      }
    } catch (e) {
      console.warn("Backend sync failed. Operating offline.");
    }
  };

  const updateQuantity = async (name: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromRequiredList(name);
      return;
    }

    setRequiredList(prev => 
      prev.map(item => item.name === name ? { ...item, quantity } : item)
    );

    try {
      const item = requiredList.find(r => r.name === name);
      const pricePerUnit = item ? item.pricePerUnit : 0;
      const res = await apiFetch(`${API_URL}/api/cart`, {
        method: 'POST',
        body: JSON.stringify({ item: { name, pricePerUnit, quantity } })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.cart) setRequiredList(data.cart);
        if (data.activeProject) setProject(data.activeProject);
        if (data.projects) setProjects(data.projects);
      }
    } catch (e) {
      console.warn("Backend sync failed. Operating offline.");
    }
  };

  const removeFromRequiredList = async (name: string) => {
    setRequiredList(prev => prev.filter(item => item.name !== name));

    try {
      const res = await apiFetch(`${API_URL}/api/cart`, {
        method: 'POST',
        body: JSON.stringify({ item: { name, quantity: 0 } })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.cart) setRequiredList(data.cart);
        if (data.activeProject) setProject(data.activeProject);
        if (data.projects) setProjects(data.projects);
      }
    } catch (e) {
      console.warn("Backend sync failed. Operating offline.");
    }
  };

  const updateCartPrices = async (localFactor: number, pricing: { name: string; basePrice: number }[]) => {
    const nextCart = requiredList.map(item => {
      const originalBase = pricing.find(p => p.name === item.name)?.basePrice || item.pricePerUnit;
      return { ...item, pricePerUnit: Math.round(originalBase * localFactor) };
    });
    setRequiredList(nextCart);

    try {
      const res = await apiFetch(`${API_URL}/api/cart`, {
        method: 'POST',
        body: JSON.stringify({ cart: nextCart })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.cart) setRequiredList(data.cart);
        if (data.activeProject) setProject(data.activeProject);
        if (data.projects) setProjects(data.projects);
      }
    } catch (e) {
      console.warn("Backend sync failed. Operating offline.");
    }
  };

  const login = async (emailInput: string, passwordInput: string): Promise<boolean> => {
    try {
      const res = await apiFetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        if (data.profile) setUser(data.profile);
        if (data.userState) {
          hydrateState(data.userState);
        }
        return true;
      } else {
        const err = await res.json();
        alert(err.error || 'Login failed');
        return false;
      }
    } catch (e) {
      console.warn('Could not connect to authentication server. Entering Offline Demo Mode.');
      setIsAuthenticated(true);
      setUser({
        name: (emailInput && emailInput.split('@')[0]) || 'Demo User',
        email: emailInput || 'demo@brickbrain.ai',
        role: 'Homeowner',
        phone: '1234567890'
      });
      return true;
    }
  };

  const signup = async (formData: any): Promise<boolean> => {
    try {
      const res = await apiFetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        if (data.profile) setUser(data.profile);
        if (data.userState) {
          hydrateState(data.userState);
        }
        return true;
      } else {
        const err = await res.json();
        alert(err.error || 'Registration failed');
        return false;
      }
    } catch (e) {
      console.warn('Could not connect to authentication server. Entering Offline Demo Mode.');
      setIsAuthenticated(true);
      setUser({
        name: formData.name || 'Demo User',
        email: formData.email || 'demo@brickbrain.ai',
        role: formData.role || 'Homeowner',
        phone: formData.phone || ''
      });
      return true;
    }
  };

  const googleLogin = async (credential: string): Promise<boolean> => {
    try {
      const res = await apiFetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        body: JSON.stringify({ credential })
      });
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        if (data.profile) setUser(data.profile);
        if (data.userState) {
          hydrateState(data.userState);
        }
        return true;
      } else {
        const err = await res.json();
        alert(err.error || 'Google login failed');
        return false;
      }
    } catch (e) {
      console.warn('Could not connect to authentication server. Entering Offline Demo Mode.');
      setIsAuthenticated(true);
      setUser({
        name: 'Google User',
        email: 'googleuser@brickbrain.ai',
        role: 'Homeowner',
        phone: ''
      });
      return true;
    }
  };

  const guestLogin = () => {
    setIsAuthenticated(true);
    setUser({
      name: 'Guest User',
      email: 'guest@brickbrain.ai',
      role: 'Homeowner',
      phone: ''
    });
  };

  const logout = async () => {
    try {
      await apiFetch(`${API_URL}/api/auth/logout`, { method: 'POST' });
    } catch (e) {
      // Continue with local logout even if server call fails
    }
    // Clear any remaining localStorage items from old versions
    localStorage.removeItem('brickbrain_token');
    localStorage.removeItem('brickbrain_projects');
    localStorage.removeItem('requiredMaterials');
    localStorage.removeItem('brickbrain_invoices');
    localStorage.removeItem('brickbrain_chat_history');

    setIsAuthenticated(false);
    resetState();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        project,
        expenses,
        milestones,
        workers,
        detections,
        chatMessages,
        invoices,
        settings,
        notifications,
        requiredList,
        isAuthenticated,
        isLoading,
        updateUser,
        calculateEstimate,
        addExpense,
        toggleMilestone,
        setAttendance,
        addWorker,
        uploadSitePhoto,
        resolveDefect,
        sendChatMessage,
        addInvoice,
        payInvoice,
        updateSettings,
        clearNotifications,
        markNotificationRead,
        updateProject,
        projects,
        saveProject,
        deleteProject,
        addToRequiredList,
        updateQuantity,
        removeFromRequiredList,
        updateCartPrices,
        login,
        signup,
        googleLogin,
        guestLogin,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
