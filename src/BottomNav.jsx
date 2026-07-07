import React from 'react';
import { Home, List, Shield, TrendingUp, BookOpen, Headset } from 'lucide-react';
import { t } from './translations';
import './BottomNav.scss';

export default function BottomNav({ route, setRoute, lang }) {
  const tabs = [
    { id: 'home', icon: Home, label: t('Home', lang) },
    { id: 'transactions', icon: List, label: t('Transactions', lang) },
    { id: 'schemes', icon: Shield, label: t('Schemes', lang) },
    { id: 'savings', icon: TrendingUp, label: t('Savings', lang) },
    { id: 'quiz', icon: BookOpen, label: t('Quiz', lang) }
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = route === tab.id;
        return (
          <button 
            key={tab.id} 
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setRoute(tab.id)}
          >
            <Icon size={24} className="nav-icon" />
            <span className="nav-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
