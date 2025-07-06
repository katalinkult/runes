import React, { useState, useEffect, useRef } from 'react';
import { runes, getRandomRune, Rune } from './data/runes';
import { BookOpen, Sparkles, Search } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'dictionary' | 'daily' | 'lookup'>('dictionary');
  const [dailyRune, setDailyRune] = useState<Rune | null>(null);
  const [selectedRunes, setSelectedRunes] = useState<Rune[]>([]);
  const [revealedRunes, setRevealedRunes] = useState<Rune[]>([]);
  const [runeCount, setRuneCount] = useState<'one' | 'two' | 'three' | 'five'>('one');
  const [isPulling, setIsPulling] = useState(false);
  const [selectedLookupRune, setSelectedLookupRune] = useState<Rune | null>(null);

  const runeDrawingContainerRef = useRef<HTMLDivElement>(null);
  const singleRuneResultRef = useRef<HTMLDivElement>(null);
  const multipleRunesResultRef = useRef<HTMLDivElement>(null);

  const scrollToContainer = (ref: React.RefObject<HTMLDivElement>) => {
    setTimeout(() => {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const pullDailyRune = () => {
    const newRune = getRandomRune();
    setDailyRune(newRune);
    // Scroll to the single rune result container
    scrollToContainer(singleRuneResultRef);
  };

  const pullMultipleRunes = () => {
    setIsPulling(true);
    setDailyRune(null);
    setRevealedRunes([]);
    
    const count = parseInt(runeCount === 'one' ? '1' : runeCount === 'two' ? '2' : runeCount === 'three' ? '3' : '5');
    const newRunes: Rune[] = [];
    const usedIndices = new Set<number>();
    
    // Select unique runes
    while (newRunes.length < count) {
      const randomIndex = Math.floor(Math.random() * runes.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        newRunes.push(runes[randomIndex]);
      }
    }
    
    setSelectedRunes(newRunes);
    setIsPulling(false);
    // Scroll to the multiple runes result container
    scrollToContainer(multipleRunesResultRef);
  };

  const revealNextRune = () => {
    if (revealedRunes.length < selectedRunes.length) {
      const nextRune = selectedRunes[revealedRunes.length];
      setRevealedRunes(prev => [...prev, nextRune]);
      // Scroll to the multiple runes container after revealing
      scrollToContainer(multipleRunesResultRef);
    }
  };

  const resetRunes = () => {
    setSelectedRunes([]);
    setRevealedRunes([]);
    setDailyRune(null);
  };

  // Scroll to multiple runes container when it appears or changes
  useEffect(() => {
    if (selectedRunes.length > 0 && !dailyRune) {
      scrollToContainer(multipleRunesResultRef);
    }
  }, [selectedRunes, dailyRune]);

  const handleTabChange = (tab: 'dictionary' | 'daily' | 'lookup') => {
    setActiveTab(tab);
    setSelectedLookupRune(null);
    if (tab === 'daily') {
      // Scroll to the rune drawing container
      scrollToContainer(runeDrawingContainerRef);
    }
  };

  const handleRuneClick = (rune: Rune) => {
    setSelectedLookupRune(rune);
  };

  const closeLookupRune = () => {
    setSelectedLookupRune(null);
  };

  return (
    <div className="container">
      <header className="header">
        <h1 style={{ fontSize: activeTab === 'daily' ? '1.5rem' : '2.5rem' }}>
          Elder Futhark Runes
        </h1>
        {activeTab === 'dictionary' && (
          <p>The ancient marks carved in tree, stone, and bone</p>
        )}
      </header>

      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'dictionary' ? 'active' : ''}`}
          onClick={() => handleTabChange('dictionary')}
        >
          <BookOpen size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Rune Dictionary
        </button>
        <button
          className={`nav-tab ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => handleTabChange('daily')}
        >
          <Sparkles size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Pull a Rune
        </button>
        <button
          className={`nav-tab ${activeTab === 'lookup' ? 'active' : ''}`}
          onClick={() => handleTabChange('lookup')}
        >
          <Search size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Look up a Rune
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
          {!dailyRune && selectedRunes.length === 0 ? (
            <div ref={runeDrawingContainerRef} className="rune-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
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
              
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#e8f4fd', textAlign: 'center' }}>
                  Choose how many runes to draw:
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  {(['one', 'two', 'three', 'five'] as const).map((count) => (
                    <button
                      key={count}
                      onClick={() => setRuneCount(count)}
                      style={{
                        background: runeCount === count 
                          ? 'linear-gradient(145deg, #4a5568, #2d3748)' 
                          : 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
                        color: '#e8f4fd',
                        border: runeCount === count ? '2px solid #63b3ed' : '2px solid #3a3a3a',
                        borderRadius: '8px',
                        padding: '0.75rem 1.5rem',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: runeCount === count ? '0 0 15px rgba(99, 179, 237, 0.3)' : 'none',
                        minWidth: '120px'
                      }}
                      onMouseEnter={(e) => {
                        if (runeCount !== count) {
                          e.currentTarget.style.background = 'linear-gradient(145deg, #3a3a3a, #2a2a2a)';
                          e.currentTarget.style.borderColor = '#4a5568';
                          e.currentTarget.style.boxShadow = '0 0 10px rgba(99, 179, 237, 0.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (runeCount !== count) {
                          e.currentTarget.style.background = 'linear-gradient(145deg, #2a2a2a, #1a1a1a)';
                          e.currentTarget.style.borderColor = '#3a3a3a';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {count === 'one' ? '1 Rune' : 
                       count === 'two' ? '2 Runes' : 
                       count === 'three' ? '3 Runes' : '5 Runes'}
                    </button>
                  ))}
                </div>
              </div>
              
              <button className="pull-button" onClick={runeCount === 'one' ? pullDailyRune : pullMultipleRunes}>
                Draw {runeCount === 'one' ? 'a Rune' : `${runeCount === 'two' ? 'Two' : runeCount === 'three' ? 'Three' : 'Five'} Runes`}
              </button>
            </div>
          ) : dailyRune ? (
            <div ref={singleRuneResultRef} className="rune-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2>Your Rune</h2>
              <span className="rune-symbol">{dailyRune.symbol}</span>
              <h3 className="rune-name">{dailyRune.name}</h3>
              <p className="rune-meaning">
                <strong>{dailyRune.meaning}</strong>
              </p>
              <p className="rune-meaning">{dailyRune.description}</p>
              
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#e8f4fd', textAlign: 'center' }}>
                  Choose how many runes to draw:
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  {(['one', 'two', 'three', 'five'] as const).map((count) => (
                    <button
                      key={count}
                      onClick={() => setRuneCount(count)}
                      style={{
                        background: runeCount === count 
                          ? 'linear-gradient(145deg, #4a5568, #2d3748)' 
                          : 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
                        color: '#e8f4fd',
                        border: runeCount === count ? '2px solid #63b3ed' : '2px solid #3a3a3a',
                        borderRadius: '8px',
                        padding: '0.75rem 1.5rem',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: runeCount === count ? '0 0 15px rgba(99, 179, 237, 0.3)' : 'none',
                        minWidth: '120px'
                      }}
                      onMouseEnter={(e) => {
                        if (runeCount !== count) {
                          e.currentTarget.style.background = 'linear-gradient(145deg, #3a3a3a, #2a2a2a)';
                          e.currentTarget.style.borderColor = '#4a5568';
                          e.currentTarget.style.boxShadow = '0 0 10px rgba(99, 179, 237, 0.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (runeCount !== count) {
                          e.currentTarget.style.background = 'linear-gradient(145deg, #2a2a2a, #1a1a1a)';
                          e.currentTarget.style.borderColor = '#3a3a3a';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {count === 'one' ? '1 Rune' : 
                       count === 'two' ? '2 Runes' : 
                       count === 'three' ? '3 Runes' : '5 Runes'}
                    </button>
                  ))}
                </div>
              </div>
              
              <button className="pull-button" onClick={runeCount === 'one' ? pullDailyRune : pullMultipleRunes}>
                Pull Another {runeCount === 'one' ? 'Rune' : `${runeCount === 'two' ? 'Two' : runeCount === 'three' ? 'Three' : 'Five'} Runes`}
              </button>
            </div>
          ) : (
            <div ref={multipleRunesResultRef} className="rune-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2>Your {runeCount === 'two' ? 'Two' : runeCount === 'three' ? 'Three' : 'Five'} Runes</h2>
              
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {selectedRunes.map((rune, index) => (
                  <div key={index} style={{ textAlign: 'center', margin: '0.5rem' }}>
                    {index < revealedRunes.length ? (
                      <>
                        <span className="rune-symbol" style={{ fontSize: '3rem' }}>{rune.symbol}</span>
                        <h3 className="rune-name" style={{ fontSize: '1.2rem' }}>{rune.name}</h3>
                      </>
                    ) : (
                      <>
                        <span className="rune-symbol" style={{ fontSize: '3rem', opacity: 0.3 }}>?</span>
                        <h3 className="rune-name" style={{ fontSize: '1.2rem', opacity: 0.3 }}>Hidden</h3>
                      </>
                    )}
                  </div>
                ))}
              </div>
              
              {revealedRunes.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  {revealedRunes.map((rune, index) => (
                    <div key={index} style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ color: '#e8f4fd', marginBottom: '0.5rem' }}>{rune.name}</h4>
                      <p className="rune-meaning">
                        <strong>{rune.meaning}</strong>
                      </p>
                      <p className="rune-meaning">{rune.description}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {revealedRunes.length < selectedRunes.length ? (
                <button className="pull-button" onClick={revealNextRune}>
                  Reveal Next Rune ({revealedRunes.length + 1} of {selectedRunes.length})
                </button>
              ) : (
                <>
                  <div style={{ marginBottom: '2rem' }}>
                    <p style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#e8f4fd', textAlign: 'center' }}>
                      Choose how many runes to draw:
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      {(['one', 'two', 'three', 'five'] as const).map((count) => (
                        <button
                          key={count}
                          onClick={() => setRuneCount(count)}
                          style={{
                            background: runeCount === count 
                              ? 'linear-gradient(145deg, #4a5568, #2d3748)' 
                              : 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
                            color: '#e8f4fd',
                            border: runeCount === count ? '2px solid #63b3ed' : '2px solid #3a3a3a',
                            borderRadius: '8px',
                            padding: '0.75rem 1.5rem',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: runeCount === count ? '0 0 15px rgba(99, 179, 237, 0.3)' : 'none',
                            minWidth: '120px'
                          }}
                          onMouseEnter={(e) => {
                            if (runeCount !== count) {
                              e.currentTarget.style.background = 'linear-gradient(145deg, #3a3a3a, #2a2a2a)';
                              e.currentTarget.style.borderColor = '#4a5568';
                              e.currentTarget.style.boxShadow = '0 0 10px rgba(99, 179, 237, 0.2)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (runeCount !== count) {
                              e.currentTarget.style.background = 'linear-gradient(145deg, #2a2a2a, #1a1a1a)';
                              e.currentTarget.style.borderColor = '#3a3a3a';
                              e.currentTarget.style.boxShadow = 'none';
                            }
                          }}
                        >
                          {count === 'one' ? '1 Rune' : 
                           count === 'two' ? '2 Runes' : 
                           count === 'three' ? '3 Runes' : '5 Runes'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button className="pull-button" onClick={runeCount === 'one' ? pullDailyRune : pullMultipleRunes}>
                    Pull Another {runeCount === 'one' ? 'Rune' : `${runeCount === 'two' ? 'Two' : runeCount === 'three' ? 'Three' : 'Five'} Runes`}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'lookup' && (
        <div>
          {selectedLookupRune ? (
            <div className="rune-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>{selectedLookupRune.name}</h2>
                <button 
                  onClick={closeLookupRune}
                  style={{
                    background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
                    color: '#e8f4fd',
                    border: '2px solid #3a3a3a',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(145deg, #3a3a3a, #2a2a2a)';
                    e.currentTarget.style.borderColor = '#4a5568';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(145deg, #2a2a2a, #1a1a1a)';
                    e.currentTarget.style.borderColor = '#3a3a3a';
                  }}
                >
                  ← Back to Grid
                </button>
              </div>
              <span className="rune-symbol" style={{ fontSize: '4rem', display: 'block', textAlign: 'center', marginBottom: '1rem' }}>
                {selectedLookupRune.symbol}
              </span>
              <h3 className="rune-name" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                {selectedLookupRune.name}
              </h3>
              <p className="rune-meaning" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <strong>{selectedLookupRune.meaning}</strong>
              </p>
              <p className="rune-meaning">{selectedLookupRune.description}</p>
            </div>
          ) : (
            <div>
              <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.2rem', color: '#b8d4e6' }}>
                Click on any rune to see its detailed meaning and description
              </p>
              <div className="rune-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
                {runes.map((rune) => (
                  <div 
                    key={rune.id} 
                    onClick={() => handleRuneClick(rune)}
                    style={{ 
                      cursor: 'pointer', 
                      transition: 'all 0.3s ease',
                      background: 'linear-gradient(145deg, #3a3a3a, #2a2a2a)',
                      border: '2px solid #4a5568',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '80px',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(99, 179, 237, 0.3)';
                      e.currentTarget.style.borderColor = '#63b3ed';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.borderColor = '#4a5568';
                    }}
                  >
                    <span className="rune-symbol" style={{ 
                      fontSize: '2.5rem', 
                      color: '#e8f4fd',
                      textShadow: '0 0 10px rgba(99, 179, 237, 0.5)',
                      marginTop: '0.75rem'
                    }}>
                      {rune.symbol}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App; 