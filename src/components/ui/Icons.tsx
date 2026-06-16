import { type SVGProps } from "react";

const s = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

type Props = SVGProps<SVGSVGElement>;

export function IcnDashboard(props: Props) {
  return <svg {...s} {...props}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="4" rx="1.5" /><rect x="14" y="11" width="7" height="10" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></svg>;
}
export function IcnMap(props: Props) {
  return <svg {...s} {...props}><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z" /><path d="M9 4v13" /><path d="M15 7v13" /></svg>;
}
export function IcnBuilding(props: Props) {
  return <svg {...s} {...props}><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 6h2" /><path d="M13 6h2" /><path d="M9 10h2" /><path d="M13 10h2" /><path d="M9 14h2" /><path d="M13 14h2" /><path d="M9 18h2" /><path d="M13 18h2" /></svg>;
}
export function IcnUsers(props: Props) {
  return <svg {...s} {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
export function IcnDollar(props: Props) {
  return <svg {...s} {...props}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
}
export function IcnFile(props: Props) {
  return <svg {...s} {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>;
}
export function IcnSettings(props: Props) {
  return <svg {...s} {...props}><circle cx="12" cy="12" r="3" /><path d="M12 1v2" /><path d="M12 21v2" /><path d="M4.22 4.22l1.42 1.42" /><path d="M18.36 18.36l1.42 1.42" /><path d="M1 12h2" /><path d="M21 12h2" /><path d="M4.22 19.78l1.42-1.42" /><path d="M18.36 5.64l1.42-1.42" /></svg>;
}
export function IcnShield(props: Props) {
  return <svg {...s} {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
export function IcnBell(props: Props) {
  return <svg {...s} {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
}
export function IcnSearch(props: Props) {
  return <svg {...s} {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
}
export function IcnChevronLeft(props: Props) {
  return <svg {...s} {...props}><polyline points="15 18 9 12 15 6" /></svg>;
}
export function IcnChevronRight(props: Props) {
  return <svg {...s} {...props}><polyline points="9 18 15 12 9 6" /></svg>;
}
export function IcnChevronDown(props: Props) {
  return <svg {...s} {...props}><polyline points="6 9 12 15 18 9" /></svg>;
}
export function IcnMenu(props: Props) {
  return <svg {...s} {...props}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>;
}
export function IcnDownload(props: Props) {
  return <svg {...s} {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
}
export function IcnPlus(props: Props) {
  return <svg {...s} {...props}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}
export function IcnFilter(props: Props) {
  return <svg {...s} {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>;
}
export function IcnCalendar(props: Props) {
  return <svg {...s} {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
export function IcnClock(props: Props) {
  return <svg {...s} {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
}
export function IcnTrendUp(props: Props) {
  return <svg {...s} {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>;
}
export function IcnTrendDown(props: Props) {
  return <svg {...s} {...props}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>;
}
export function IcnWarning(props: Props) {
  return <svg {...s} {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
}
export function IcnCheckCircle(props: Props) {
  return <svg {...s} {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
}
export function IcnX(props: Props) {
  return <svg {...s} {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
}
export function IcnMail(props: Props) {
  return <svg {...s} {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
}
export function IcnEdit(props: Props) {
  return <svg {...s} {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
}
export function IcnMoreV(props: Props) {
  return <svg {...s} {...props}><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>;
}
export function IcnMapPin(props: Props) {
  return <svg {...s} {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
export function IcnPhone(props: Props) {
  return <svg {...s} {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
}
export function IcnUser(props: Props) {
  return <svg {...s} {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
export function IcnActivity(props: Props) {
  return <svg {...s} {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
}
export function IcnNav(props: Props) {
  return <svg {...s} {...props}><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>;
}
export function IcnLayers(props: Props) {
  return <svg {...s} {...props}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>;
}
export function IcnList(props: Props) {
  return <svg {...s} {...props}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>;
}
export function IcnGrid(props: Props) {
  return <svg {...s} {...props}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>;
}
export function IcnInfo(props: Props) {
  return <svg {...s} {...props}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>;
}
export function IcnRefresh(props: Props) {
  return <svg {...s} {...props}><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>;
}
export function IcnSave(props: Props) {
  return <svg {...s} {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>;
}
export function IcnEye(props: Props) {
  return <svg {...s} {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
}
export function IcnEyeOff(props: Props) {
  return <svg {...s} {...props}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>;
}
export function IcnLock(props: Props) {
  return <svg {...s} {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
}
export function IcnReceipt(props: Props) {
  return <svg {...s} {...props}><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" /><path d="M8 7h8" /><path d="M8 11h8" /><path d="M8 15h5" /></svg>;
}
export function IcnSmartphone(props: Props) {
  return <svg {...s} {...props}><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>;
}
export function IcnUsers2(props: Props) {
  return <svg {...s} {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
export function IcnBarChart(props: Props) {
  return <svg {...s} {...props}><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>;
}
export function IcnScale(props: Props) {
  return <svg {...s} {...props}><path d="M12 22V7" /><path d="M9 7V3h6v4" /><path d="M3 18h18l-3 4H6l-3-4z" /><path d="M5 14l3-4" /><path d="M19 14l-3-4" /><circle cx="12" cy="5" r="2" /></svg>;
}
export function IcnBank(props: Props) {
  return <svg {...s} {...props}><path d="M3 21h18" /><path d="M3 10h18" /><path d="M5 10V7l7-4 7 4v3" /><path d="M8 14v3" /><path d="M12 14v3" /><path d="M16 14v3" /></svg>;
}
export function IcnClipboardCheck(props: Props) {
  return <svg {...s} {...props}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="m9 14 2 2 4-4" /></svg>;
}
export function IcnHome(props: Props) {
  return <svg {...s} {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
}
export function IcnArrowUpRight(props: Props) {
  return <svg {...s} {...props}><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>;
}
export function IcnArrowDownRight(props: Props) {
  return <svg {...s} {...props}><line x1="7" y1="7" x2="17" y2="17" /><polyline points="17 7 17 17 7 17" /></svg>;
}
export function IcnArrowRight(props: Props) {
  return <svg {...s} {...props}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
}
export function IcnTarget(props: Props) {
  return <svg {...s} {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
}
export function IcnMinus(props: Props) {
  return <svg {...s} {...props}><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}
export function IcnCheck(props: Props) {
  return <svg {...s} {...props}><polyline points="20 6 9 17 4 12" /></svg>;
}
export function IcnCircle(props: Props) {
  return <svg {...s} {...props}><circle cx="12" cy="12" r="10" /></svg>;
}
export function IcnQrCode(props: Props) {
  return <svg {...s} {...props}><rect x="3" y="3" width="5" height="5" /><rect x="16" y="3" width="5" height="5" /><rect x="3" y="16" width="5" height="5" /><path d="M21 16h-5v5" /><path d="M3 12h8" /><path d="M13 3v8" /><path d="M13 13h8" /><path d="M13 19h3" /><path d="M19 13v3" /></svg>;
}
export function IcnShieldAlert(props: Props) {
  return <svg {...s} {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
}
export function IcnShieldX(props: Props) {
  return <svg {...s} {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="9" y1="9" x2="15" y2="15" /><line x1="15" y1="9" x2="9" y2="15" /></svg>;
}
export function IcnCheckCircle2(props: Props) {
  return <svg {...s} {...props}><circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" /></svg>;
}
export function IcnClock2(props: Props) {
  return <svg {...s} {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
}
export function IcnAlertCircle(props: Props) {
  return <svg {...s} {...props}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
}
export function IcnStar(props: Props) {
  return <svg {...s} {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
}
export function IcnPrinter(props: Props) {
  return <svg {...s} {...props}><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>;
}
export function IcnCreditCard(props: Props) {
  return <svg {...s} {...props}><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>;
}
export function IcnPackage(props: Props) {
  return <svg {...s} {...props}><path d="M16.5 9.4L7.55 4.24" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.29 7 12 12 20.71 7" /><line x1="12" y1="22" x2="12" y2="12" /></svg>;
}
export function IcnMonitor(props: Props) {
  return <svg {...s} {...props}><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>;
}
export function IcnShirt(props: Props) {
  return <svg {...s} {...props}><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 .55.45 1 1 1h10c.55 0 1-.45 1-1V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" /></svg>;
}
export function IcnHelpCircle(props: Props) {
  return <svg {...s} {...props}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
}
export function IcnArrowUpDown(props: Props) {
  return <svg {...s} {...props}><path d="m21 16-4 4-4-4" /><path d="M17 20V4" /><path d="m3 8 4-4 4 4" /><path d="M7 4v16" /></svg>;
}
export function IcnArrowUp(props: Props) {
  return <svg {...s} {...props}><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>;
}
export function IcnArrowDown(props: Props) {
  return <svg {...s} {...props}><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>;
}
export function IcnGlobe(props: Props) {
  return <svg {...s} {...props}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
}
export function IcnWifi(props: Props) {
  return <svg {...s} {...props}><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" /></svg>;
}
export function IcnDatabase(props: Props) {
  return <svg {...s} {...props}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>;
}
export function IcnUserCheck(props: Props) {
  return <svg {...s} {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" /></svg>;
}

export const icons = {
  dashboard: IcnDashboard,
  map: IcnMap,
  building: IcnBuilding,
  users: IcnUsers,
  dollar: IcnDollar,
  file: IcnFile,
  settings: IcnSettings,
  shield: IcnShield,
  bell: IcnBell,
  search: IcnSearch,
  chevronLeft: IcnChevronLeft,
  chevronRight: IcnChevronRight,
  chevronDown: IcnChevronDown,
  menu: IcnMenu,
  download: IcnDownload,
  plus: IcnPlus,
  filter: IcnFilter,
  calendar: IcnCalendar,
  clock: IcnClock,
  trendUp: IcnTrendUp,
  trendDown: IcnTrendDown,
  warning: IcnWarning,
  checkCircle: IcnCheckCircle,
  x: IcnX,
  mail: IcnMail,
  edit: IcnEdit,
  moreV: IcnMoreV,
  mapPin: IcnMapPin,
  phone: IcnPhone,
  user: IcnUser,
  activity: IcnActivity,
  nav: IcnNav,
  layers: IcnLayers,
  list: IcnList,
  grid: IcnGrid,
  info: IcnInfo,
  refresh: IcnRefresh,
  save: IcnSave,
  eye: IcnEye,
  eyeOff: IcnEyeOff,
  lock: IcnLock,
  receipt: IcnReceipt,
  smartphone: IcnSmartphone,
  users2: IcnUsers2,
  barChart: IcnBarChart,
  scale: IcnScale,
  bank: IcnBank,
  clipboardCheck: IcnClipboardCheck,
  home: IcnHome,
  arrowUpRight: IcnArrowUpRight,
  arrowDownRight: IcnArrowDownRight,
  arrowRight: IcnArrowRight,
  target: IcnTarget,
  minus: IcnMinus,
  check: IcnCheck,
  circle: IcnCircle,
  qrCode: IcnQrCode,
  shieldAlert: IcnShieldAlert,
  shieldX: IcnShieldX,
  checkCircle2: IcnCheckCircle2,
  alertCircle: IcnAlertCircle,
  star: IcnStar,
  printer: IcnPrinter,
  creditCard: IcnCreditCard,
  pkg: IcnPackage,
  monitor: IcnMonitor,
  shirt: IcnShirt,
};
