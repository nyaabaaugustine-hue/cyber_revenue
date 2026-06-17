import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface SimNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  isRead: boolean;
}

interface NotificationContextType {
  notifications: SimNotification[];
  unreadCount: number;
  addNotification: (n: Omit<SimNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const templates = [
  { title: 'Payment Anomaly Detected', message: 'Business BIZ-{id} shows unusual transaction pattern exceeding threshold', type: 'error' as const },
  { title: 'Agent Inactive Alert', message: 'Agent {agent} has been inactive for over 2 hours during work hours', type: 'warning' as const },
  { title: 'Daily Report Ready', message: 'Revenue summary for today is now available in Reports', type: 'info' as const },
  { title: 'High Value Collection', message: 'A collection of GHS {amount} recorded at {business}', type: 'success' as const },
  { title: 'Sync Failure', message: 'Field device of {agent} failed to sync 5 records', type: 'error' as const },
  { title: 'Fraud Flag Triggered', message: 'Suspicious activity detected on collection #{receipt}', type: 'error' as const },
  { title: 'Dispute Filed', message: 'Business {business} has filed a dispute regarding overpayment', type: 'warning' as const },
  { title: 'Compliance Check Failed', message: '{agent} failed compliance check - documentation pending', type: 'warning' as const },
  { title: 'Commission Payout', message: 'Monthly commission of GHS {amount} approved for {agent}', type: 'success' as const },
  { title: 'Remittance Pending', message: '{agent} has unverified remittance of GHS {amount}', type: 'info' as const },
  { title: 'Business Registration', message: 'New business "{business}" registered in {zone}', type: 'success' as const },
  { title: 'Budget Threshold Exceeded', message: 'Operational budget has reached 85% of monthly allocation', type: 'warning' as const },
  { title: 'Offline Data Queue', message: '{count} offline collection records queued for sync', type: 'info' as const },
  { title: 'System Backup Complete', message: 'Daily backup completed successfully - {size} GB', type: 'success' as const },
  { title: 'Receipt Mismatch', message: 'Receipt #{receipt} amount does not match logged collection', type: 'error' as const },
];

const agentNames = ['Emmanuel Owusu', 'Akua Mensah', 'Kofi Asante', 'Ama Boateng', 'Yaw Darko', 'Grace Ansah', 'Samuel Adjei', 'Mariam Idrissu'];
const bizNames = ['Adom Supermarket', 'Amakom Pharmacy', 'Kejetia Traders', 'Asafo Hardware', 'Bantama Mart', 'Suame Auto Parts', 'Tafo Textiles', 'Dichemso Grocers'];
const zoneNames = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];

let counter = 0;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateNotification(): Omit<SimNotification, 'id' | 'timestamp' | 'isRead'> {
  const tpl = pick(templates);
  const agent = pick(agentNames);
  const business = pick(bizNames);
  const amount = (Math.random() * 5000 + 100).toFixed(0);
  const id = Math.floor(Math.random() * 200 + 10);
  const receipt = Math.floor(Math.random() * 9000 + 1000);
  const zone = pick(zoneNames);
  const count = Math.floor(Math.random() * 20 + 1);
  const size = (Math.random() * 2 + 0.5).toFixed(1);

  return {
    title: tpl.title,
    message: tpl.message
      .replace('{id}', String(id))
      .replace('{agent}', agent)
      .replace('{amount}', amount)
      .replace('{business}', business)
      .replace('{receipt}', String(receipt))
      .replace('{zone}', zone)
      .replace('{count}', String(count))
      .replace('{size}', size),
    type: tpl.type,
  };
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<SimNotification[]>([
    { id: 'n-0', title: 'Welcome to CyberRevenue', message: 'System initialized. Monitoring active.', type: 'info', timestamp: new Date().toISOString(), isRead: false },
  ]);

  const addNotification = useCallback((n: Omit<SimNotification, 'id' | 'timestamp' | 'isRead'>) => {
    counter++;
    setNotifications(prev => [{
      ...n,
      id: `n-${counter}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    }, ...prev].slice(0, 50));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const n = generateNotification();
      addNotification(n);
    }, 10000);
    return () => clearInterval(interval);
  }, [addNotification]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
