import React, { useState } from 'react'
import { t } from './translations'
import './SchemesPage.scss'

export default function SchemesPage({ lang = 'en-IN' }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  const schemes = [
    {
      id: 'myscheme',
      title: 'myScheme Portal',
      desc: 'National one‑stop platform to discover and apply for government schemes.',
      link: 'https://www.myscheme.gov.in',
      category: 'general',
      icon: '🏛️'
    },
    {
      id: 'pmmvy',
      title: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
      desc: 'Cash incentive scheme for pregnant and lactating women.',
      link: 'https://pmmvy.gov.in',
      category: 'health',
      icon: '🤰'
    },
    {
      id: 'standup',
      title: 'Stand Up India',
      desc: 'Loans for women entrepreneurs to start new ventures.',
      link: 'https://www.standupmitra.in',
      category: 'business',
      icon: '💼'
    },
    {
      id: 'ssy',
      title: 'Sukanya Samriddhi Yojana',
      desc: 'Savings scheme for girl children (via banks/post offices).',
      link: 'https://www.indiapost.gov.in/Financial/Pages/Content/Post-Office-Savings-Schemes.aspx',
      category: 'savings',
      icon: '👧'
    },
    {
      id: 'ujjawala',
      title: 'Ujjawala Scheme',
      desc: 'Rescue, rehabilitation, and reintegration of trafficked women.',
      link: 'https://wcd.nic.in/schemes/ujjawala-scheme',
      category: 'health',
      icon: '🤝'
    },
    {
      id: 'hostel',
      title: 'Working Women Hostel',
      desc: 'Safe and affordable accommodation for working women.',
      link: 'https://wcd.nic.in/schemes/working-women-hostel',
      category: 'general',
      icon: '🏢'
    },
    {
      id: 'osc',
      title: 'One Stop Centre Scheme',
      desc: 'Support services for women facing violence.',
      link: 'https://wcd.nic.in/schemes/one-stop-centre-scheme',
      category: 'health',
      icon: '🛡️'
    }
  ]

  function open(url) {
    const win = window.open(url, '_blank', 'noopener,noreferrer')
    if (!win) alert('Popup blocked. Please allow popups for this site.')
  }

  const filteredSchemes = schemes.filter(s => {
    const matchesCategory = filterType === 'all' || s.category === filterType
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.desc.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="schemes-page">
      <div className="sch-bg-animation"></div>

      <div className="sch-hero">
        <h2>{t('Schemes', lang)}</h2>
        <p>Discover government benefits, financial aids, and empowerment programs tailored for you.</p>
      </div>

      <div className="sch-controls">
        <div className="sch-search">
          <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Search for schemes, benefits, or keywords..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="sch-filters">
          <button className={`sch-filter-btn ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>All Schemes</button>
          <button className={`sch-filter-btn ${filterType === 'business' ? 'active' : ''}`} onClick={() => setFilterType('business')}>Business & Loans</button>
          <button className={`sch-filter-btn ${filterType === 'health' ? 'active' : ''}`} onClick={() => setFilterType('health')}>Health & Safety</button>
          <button className={`sch-filter-btn ${filterType === 'savings' ? 'active' : ''}`} onClick={() => setFilterType('savings')}>Savings</button>
          <button className={`sch-filter-btn ${filterType === 'general' ? 'active' : ''}`} onClick={() => setFilterType('general')}>General</button>
        </div>
      </div>

      <div className="sch-grid">
        {filteredSchemes.length === 0 ? (
          <div className="sch-empty">
            <div className="icon">🔍</div>
            <h3>No schemes found</h3>
            <p>Try adjusting your filters or search for something else.</p>
          </div>
        ) : (
          filteredSchemes.map((s, index) => (
            <div className="sch-card" key={s.id} style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="sch-card-header">
                <div className="sch-icon-wrap">{s.icon}</div>
                <div>
                  <h3 className="sch-title">{s.title}</h3>
                  <span className={`sch-badge ${s.category}`}>
                    {s.category === 'business' ? 'Business' : 
                     s.category === 'health' ? 'Health & Safety' : 
                     s.category === 'savings' ? 'Savings' : 'General'}
                  </span>
                </div>
              </div>
              <p className="sch-desc">{s.desc}</p>
              <div className="sch-actions" style={{ display: 'flex', gap: 12 }}>
                <button className="secondary-btn" onClick={() => open(s.link)}>Details</button>
                <button className="primary-btn" onClick={() => open(s.link)}>{t('ApplyNow', lang)}</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
