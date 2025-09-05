@@ .. @@
 import React from 'react';
 import { useNavigate, useLocation } from 'react-router-dom';
-import { Home, TrendingUp, FileText, MessageCircle } from 'react-feather';
+import { Home, TrendingUp, FileText } from 'react-feather';
 
 const Sidebar = ({ isCollapsed }) => {
   const navigate = useNavigate();
@@ .. @@
   const navigationItems = [
     { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard' },
     { id: 'status', icon: TrendingUp, label: 'Status', path: '/status' },
-    { id: 'reports', icon: FileText, label: 'Reports', path: '/reports' },
-    { id: 'feedback', icon: MessageCircle, label: 'Feedback', path: 'https://google.com' },
+    { id: 'reports', icon: FileText, label: 'Reports', path: '/reports' }
   ];
 
   const handleNavigation = (path) => {
-    console.log('Navigating to:', path);
-    console.log('Is external URL:', path.startsWith('http'));
-    
     if (path.startsWith('http')) {
-      console.log('Opening external URL in new tab');
       window.open(path, '_blank');
     } else {
-      console.log('Navigating internally');
       navigate(path);
     }
   };