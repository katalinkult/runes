import React, { useState } from 'react';
import { runes, getRandomRune, Rune } from './data/runes';
import { BookOpen, Sparkles } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'dictionary' | 'daily'>('dictionary');
  const [dailyRune, setDailyRune] = useState<Rune | null>(null);

  const pullDailyRune = () => {
    const newRune = getRandomRune();
    setDailyRune(newRune);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Elder Futhark Runes</h1>
        <p>The ancient wisdom of the 24 runes that guide our lives</p>
      </header>

      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'dictionary' ? 'active' : ''}`}
          onClick={() => setActiveTab('dictionary')}
        >
          <BookOpen size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Rune Dictionary
        </button>
        <button
          className={`nav-tab ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          <Sparkles size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Pull a Rune
        </button>
      </nav>

      {activeTab === 'dictionary' && (
        <div className="rune-grid">
          {runes.map((rune) => (
            <div key={rune.id} className="rune-card">
              <span className="rune-symbol">{rune.symbol}</span>
              <h3 className="rune-name">{rune.name}</h3>
              <p className="rune-meaning">
                <strong>{rune.meaning}</strong>
              </p>
              <p className="rune-meaning">{rune.description}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'daily' && (
        <div>
          {!dailyRune ? (
            <div className="rune-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ marginBottom: '2rem' }}>
                <img src="/huginmunin1.png" alt="Hugin and Munin" style={{ maxWidth: '300px', height: 'auto' }} />
              </div>
              <p style={{ marginBottom: '1rem', fontSize: '1.2rem', color: '#b8d4e6' }}>
                Let your hand find the rune meant for you.<br />
                The one you choose will mark your path.
              </p>
              <p style={{ marginBottom: '2rem', fontSize: '1.2rem', color: '#b8d4e6', fontStyle: 'italic' }}>
                Click the button when you are ready!
              </p>
              <button className="pull-button" onClick={pullDailyRune}>
                Draw a Rune
              </button>
            </div>
          ) : (
            <div className="rune-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2>Your Rune</h2>
              <span className="rune-symbol">{dailyRune.symbol}</span>
              <h3 className="rune-name">{dailyRune.name}</h3>
              <p className="rune-meaning">
                <strong>{dailyRune.meaning}</strong>
              </p>
              <p className="rune-meaning">{dailyRune.description}</p>
              <button className="pull-button" onClick={pullDailyRune}>
                Pull Another Rune
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App; 