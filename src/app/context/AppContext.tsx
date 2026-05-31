import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin);

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
  token: string | null;
  isAuthenticated: boolean;
  
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
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication states
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('brickbrain_token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('brickbrain_token'));

  // Initialize States
  const [projects, setProjects] = useState<ProjectEstimate[]>(() => {
    const saved = localStorage.getItem('brickbrain_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        projectName: 'My Dream House',
        plotSize: 1500,
        floors: 2,
        location: 'Bangalore, Karnataka',
        constructionType: 'Residential',
        materialQuality: 'Premium',
        budgetRange: '45-50 Lakhs',
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
      }
    ];
  });

  const [user, setUser] = useState<UserProfile>({
    name: 'Demo Builder',
    email: 'demo@brickbrain.ai',
    role: 'Homeowner',
    phone: '+91 98765 43210'
  });

  const [project, setProject] = useState<ProjectEstimate>({
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
  });

  const [requiredList, setRequiredList] = useState<RequiredMaterial[]>(() => {
    const saved = localStorage.getItem('requiredMaterials');
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [detections, setDetections] = useState<Defect[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: true,
    currency: 'INR',
    language: 'English',
    notificationsEnabled: true
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Helper to sync arbitrary state updates with server
  const syncStateWithServer = async (updatedFields: any) => {
    if (!token) return;
    try {
      await fetch(`${API_URL}/api/state`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
      breakdown: {
        materials,
        labor,
        interior,
        tax
      },
      status: 'In Progress',
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    setProject(newProject);
    
    const updatedProj = {
      ...newProject,
      status: 'In Progress' as const
    };
    
    let nextProjectsList: ProjectEstimate[] = [];
    setProjects(prev => {
      const exists = prev.some(p => p.projectName.toLowerCase() === newProject.projectName.toLowerCase());
      if (exists) {
        nextProjectsList = prev.map(p => p.projectName.toLowerCase() === newProject.projectName.toLowerCase() ? updatedProj : p);
      } else {
        nextProjectsList = [updatedProj, ...prev];
      }
      localStorage.setItem('brickbrain_projects', JSON.stringify(nextProjectsList));
      return nextProjectsList;
    });

    const alertId = (notifications.length + 1).toString();
    const newNotification: NotificationItem = {
      id: alertId,
      type: 'success',
      message: `AI generated new estimate: ₹${(calculatedTotal / 100000).toFixed(2)} Lakhs`,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);

    syncStateWithServer({
      projects: nextProjectsList,
      activeProject: updatedProj,
      notifications: [newNotification, ...notifications]
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
    
    setExpenses(prev => {
      const nextExp = [newExp, ...prev];
      setInvoices(prevInv => {
        const nextInv = [newInv, ...prevInv];
        syncStateWithServer({ expenses: nextExp, invoices: nextInv });
        return nextInv;
      });
      return nextExp;
    });
  };

  const toggleMilestone = (id: string) => {
    setMilestones(prev => {
      const next = prev.map(m => {
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
      syncStateWithServer({ milestones: next });
      return next;
    });
  };

  const setAttendance = (id: string, status: 'Present' | 'Absent') => {
    setWorkers(prev => {
      const next = prev.map(w => (w.id === id ? { ...w, status } : w));
      syncStateWithServer({ workers: next });
      return next;
    });
  };

  const addWorker = (worker: Omit<Worker, 'id'>) => {
    const newWorker: Worker = {
      ...worker,
      id: Math.random().toString(36).substr(2, 9)
    };
    setWorkers(prev => {
      const next = [...prev, newWorker];
      syncStateWithServer({ workers: next });
      return next;
    });
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

        setDetections(prev => {
          const nextDetections = [newDefect, ...prev];
          setNotifications(prevNotifications => {
            const nextNotifications = [newNotification, ...prevNotifications];
            syncStateWithServer({ detections: nextDetections, notifications: nextNotifications });
            return nextNotifications;
          });
          return nextDetections;
        });

        resolve();
      }, 1500);
    });
  };

  const resolveDefect = (id: string) => {
    setDetections(prev => {
      const next = prev.map(d => (d.id === id ? { ...d, status: 'Resolved' } : d));
      syncStateWithServer({ detections: next });
      return next;
    });
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

    setChatMessages(prev => {
      const nextUserMsgs = [...prev, userMsg];
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

        setChatMessages(prev2 => {
          const nextContractorMsgs = [...prev2, replyMsg];
          syncStateWithServer({ chatMessages: nextContractorMsgs });
          return nextContractorMsgs;
        });
      }, 1500);

      return nextUserMsgs;
    });
  };

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newInv: Invoice = {
      ...invoice,
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: today
    };
    setInvoices(prev => {
      const next = [newInv, ...prev];
      syncStateWithServer({ invoices: next });
      return next;
    });
  };

  const payInvoice = (id: string) => {
    setInvoices(prev => {
      const next = prev.map(inv => (inv.id === id ? { ...inv, status: 'Paid' } : inv));
      syncStateWithServer({ invoices: next });
      return next;
    });
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...newSettings };
      syncStateWithServer({ settings: next });
      return next;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    syncStateWithServer({ notifications: [] });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => {
      const next = prev.map(n => (n.id === id ? { ...n, read: true } : n));
      syncStateWithServer({ notifications: next });
      return next;
    });
  };

  // Load State from Backend on mount / token change
  useEffect(() => {
    const fetchInitialState = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/api/state`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const db = await res.json();
          if (db.projects) {
            setProjects(db.projects);
            localStorage.setItem('brickbrain_projects', JSON.stringify(db.projects));
          }
          if (db.activeProject) setProject(db.activeProject);
          if (db.cart) {
            setRequiredList(db.cart);
            localStorage.setItem('requiredMaterials', JSON.stringify(db.cart));
          }
          if (db.expenses) setExpenses(db.expenses);
          if (db.milestones) setMilestones(db.milestones);
          if (db.workers) setWorkers(db.workers);
          if (db.detections) setDetections(db.detections);
          if (db.chatMessages) setChatMessages(db.chatMessages);
          if (db.invoices) {
            setInvoices(db.invoices);
            localStorage.setItem('brickbrain_invoices', JSON.stringify(db.invoices));
          }
          if (db.settings) setSettings(db.settings);
          if (db.notifications) setNotifications(db.notifications);
          if (db.profile) setUser(db.profile);
        } else if (res.status === 401) {
          logout();
        }
      } catch (e) {
        console.warn("Could not connect to backend server on startup. Running in local/offline mode.");
      }
    };

    fetchInitialState();
  }, [token]);

  // Sync requiredList to localStorage
  useEffect(() => {
    localStorage.setItem('requiredMaterials', JSON.stringify(requiredList));
  }, [requiredList]);

  // Sync invoices to localStorage
  useEffect(() => {
    localStorage.setItem('brickbrain_invoices', JSON.stringify(invoices));
  }, [invoices]);

  const updateProject = async (data: Partial<ProjectEstimate>) => {
    let nextProj: ProjectEstimate;
    setProject(prev => {
      nextProj = { ...prev, ...data };
      setProjects(prevProjects => {
        const exists = prevProjects.some(p => p.projectName.toLowerCase() === nextProj.projectName.toLowerCase());
        if (exists) {
          const nextList = prevProjects.map(p => p.projectName.toLowerCase() === nextProj.projectName.toLowerCase() ? nextProj : p);
          localStorage.setItem('brickbrain_projects', JSON.stringify(nextList));
          return nextList;
        }
        return prevProjects;
      });
      return nextProj;
    });

    try {
      await fetch(`${API_URL}/api/project`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ project: nextProj! })
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
      let next;
      if (exists) {
        next = prev.map(p => p.projectName.toLowerCase() === proj.projectName.toLowerCase() ? updatedProj : p);
      } else {
        next = [updatedProj, ...prev];
      }
      localStorage.setItem('brickbrain_projects', JSON.stringify(next));
      return next;
    });

    try {
      await fetch(`${API_URL}/api/project`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ project: updatedProj })
      });
    } catch (e) {
      console.warn("Backend update failed.");
    }
  };

  const deleteProject = async (name: string) => {
    setProjects(prev => {
      const next = prev.filter(p => p.projectName.toLowerCase() !== name.toLowerCase());
      localStorage.setItem('brickbrain_projects', JSON.stringify(next));
      return next;
    });

    try {
      await fetch(`${API_URL}/api/projects/${encodeURIComponent(name)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
      const res = await fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
      const res = await fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
      const res = await fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
      const res = await fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('brickbrain_token', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        if (data.profile) setUser(data.profile);
        if (data.userState) {
          const db = data.userState;
          if (db.projects) setProjects(db.projects);
          if (db.activeProject) setProject(db.activeProject);
          if (db.cart) setRequiredList(db.cart);
          if (db.expenses) setExpenses(db.expenses);
          if (db.milestones) setMilestones(db.milestones);
          if (db.workers) setWorkers(db.workers);
          if (db.detections) setDetections(db.detections);
          if (db.chatMessages) setChatMessages(db.chatMessages);
          if (db.invoices) setInvoices(db.invoices);
          if (db.settings) setSettings(db.settings);
          if (db.notifications) setNotifications(db.notifications);
        }
        return true;
      } else {
        const err = await res.json();
        alert(err.error || 'Login failed');
        return false;
      }
    } catch (e) {
      alert('Could not connect to authentication server.');
      return false;
    }
  };

  const signup = async (formData: any): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('brickbrain_token', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        if (data.profile) setUser(data.profile);
        if (data.userState) {
          const db = data.userState;
          if (db.projects) setProjects(db.projects);
          if (db.activeProject) setProject(db.activeProject);
          if (db.cart) setRequiredList(db.cart);
          if (db.expenses) setExpenses(db.expenses);
          if (db.milestones) setMilestones(db.milestones);
          if (db.workers) setWorkers(db.workers);
          if (db.detections) setDetections(db.detections);
          if (db.chatMessages) setChatMessages(db.chatMessages);
          if (db.invoices) setInvoices(db.invoices);
          if (db.settings) setSettings(db.settings);
          if (db.notifications) setNotifications(db.notifications);
        }
        return true;
      } else {
        const err = await res.json();
        alert(err.error || 'Registration failed');
        return false;
      }
    } catch (e) {
      alert('Could not connect to authentication server.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('brickbrain_token');
    setToken(null);
    setIsAuthenticated(false);
    setUser({
      name: 'Demo Builder',
      email: 'demo@brickbrain.ai',
      role: 'Homeowner',
      phone: '+91 98765 43210'
    });
    setProjects([]);
    setProject({
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
    });
    setRequiredList([]);
    setExpenses([]);
    setMilestones([]);
    setWorkers([]);
    setDetections([]);
    setChatMessages([]);
    setInvoices([]);
    setNotifications([]);
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
        token,
        isAuthenticated,
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
