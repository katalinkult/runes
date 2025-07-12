import React, { useState, useEffect, useRef } from 'react';
import { runes, getRandomRune, Rune } from './data/runes';
import { BookOpen, Sparkles, Search } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'dictionary' | 'daily' | 'lookup' | 'bindrunes' | 'wyrd'>('dictionary');
  const [dailyRune, setDailyRune] = useState<Rune | null>(null);
  const [selectedRunes, setSelectedRunes] = useState<Rune[]>([]);
  const [revealedRunes, setRevealedRunes] = useState<Rune[]>([]);
  const [runeCount, setRuneCount] = useState<'one' | 'two' | 'three' | 'five'>('one');
  const [isPulling, setIsPulling] = useState(false);
  const [selectedLookupRune, setSelectedLookupRune] = useState<Rune | null>(null);
  const [dictionarySearch, setDictionarySearch] = useState('');
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

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

  const handleTabChange = (tab: 'dictionary' | 'daily' | 'lookup' | 'bindrunes' | 'wyrd') => {
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

  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  const filteredRunes = runes.filter(rune => 
    rune.name.toLowerCase().includes(dictionarySearch.toLowerCase()) ||
    rune.meaning.toLowerCase().includes(dictionarySearch.toLowerCase()) ||
    rune.description.toLowerCase().includes(dictionarySearch.toLowerCase())
  );

  return (
    <>
      <div className="top-band">
        <div className="top-band-content">
          <h1 className="app-title">Elder Futhark Runes</h1>
          
          <nav className="top-nav">
            <button
              className={`nav-button ${activeTab === 'daily' ? 'active' : ''}`}
              onClick={() => handleTabChange('daily')}
            >
              <Sparkles size={18} />
              <span>Pull a Rune</span>
            </button>
            
            <button
              className={`nav-button ${activeTab === 'dictionary' ? 'active' : ''}`}
              onClick={() => handleTabChange('dictionary')}
            >
              <BookOpen size={18} />
              <span>Dictionary</span>
            </button>
            
            <button
              className={`nav-button ${activeTab === 'lookup' ? 'active' : ''}`}
              onClick={() => handleTabChange('lookup')}
            >
              <Search size={18} />
              <span>Look up a Rune</span>
            </button>
            
            <button
              className={`nav-button ${activeTab === 'bindrunes' ? 'active' : ''}`}
              onClick={() => handleTabChange('bindrunes')}
            >
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>ᛒ</span>
              <span>Bindrunes</span>
            </button>
            
            <button
              className={`nav-button ${activeTab === 'wyrd' ? 'active' : ''}`}
              onClick={() => handleTabChange('wyrd')}
            >
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>ᛉ</span>
              <span>Web of Wyrd</span>
            </button>
          </nav>
        </div>
      </div>
      
      <div className="container">

      {activeTab === 'dictionary' && (
        <div style={{ position: 'relative' }}>
          <div style={{ 
            marginBottom: '2rem', 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ position: 'relative', minWidth: '300px', maxWidth: '500px', width: '100%' }}>
              <input
                type="text"
                placeholder="Search runes by name, meaning, or description..."
                value={dictionarySearch}
                onChange={(e) => setDictionarySearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 1rem',
                  background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
                  border: '2px solid #3a3a3a',
                  borderRadius: '8px',
                  color: '#e8f4fd',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#63b3ed';
                  e.target.style.boxShadow = '0 0 15px rgba(99, 179, 237, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3a3a3a';
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
                }}
              />
              {dictionarySearch && (
                <button
                  onClick={() => setDictionarySearch('')}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#b8d4e6',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#e8f4fd';
                    e.currentTarget.style.background = 'rgba(232, 244, 253, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#b8d4e6';
                    e.currentTarget.style.background = 'none';
                  }}
                >
                  ×
                </button>
              )}
            </div>
            {dictionarySearch && (
              <div style={{ 
                color: '#b8d4e6', 
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                Found {filteredRunes.length} rune{filteredRunes.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          
          <div className="rune-grid">
            {filteredRunes.map((rune) => (
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
          
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
              border: '2px solid #3a3a3a',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              color: '#e8f4fd',
              fontSize: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(145deg, #3a3a3a, #2a2a2a)';
              e.currentTarget.style.borderColor = '#4a5568';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4), 0 0 15px rgba(232, 244, 253, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(145deg, #2a2a2a, #1a1a1a)';
              e.currentTarget.style.borderColor = '#3a3a3a';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            }}
          >
            ↑
          </button>
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
        <div 
          onClick={() => selectedLookupRune && closeLookupRune()}
          style={{ 
            minHeight: '100vh',
            width: '100%',
            position: 'relative'
          }}
        >
          {selectedLookupRune ? (
            <div 
              className="rune-card" 
              style={{ maxWidth: '600px', margin: '0 auto' }}
              onClick={(e) => e.stopPropagation()}
            >
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

      {activeTab === 'bindrunes' && (
        <div>
          <div className="rune-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Bindrunes</h2>
            
            <p className="rune-meaning" style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <strong>Bindrunes</strong> are combinations of two or more runes merged into a single symbol. 
              They were used to create powerful magical symbols that combined the meanings and energies of multiple runes.
            </p>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#e8f4fd', marginBottom: '1rem' }}>How Bindrunes Work</h3>
              <p className="rune-meaning">
                When creating a bindrune, runes are overlapped and shared lines are combined. 
                This creates a unified symbol that represents the combined intent and power of the individual runes. 
                The most common bindrunes combine 2-3 runes, though more complex combinations exist.
              </p>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#e8f4fd', marginBottom: '1rem' }}>Creating Your Own Bindrune</h3>
              <p className="rune-meaning">
                To create a bindrune, first identify the runes whose meanings align with your intention. 
                Then, sketch how they might overlap and share lines. The goal is to create a harmonious, 
                balanced symbol that flows naturally while maintaining the recognizable elements of each rune.
              </p>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#e8f4fd', marginBottom: '1rem' }}>Common Bindrune Examples</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
                <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)', borderRadius: '12px', border: '2px solid #3a3a3a' }}>
                  <img 
                    src="/bindrunethurisazraidho1.png" 
                    alt="Thurisaz + Raidho Bindrune" 
                    style={{ 
                      maxWidth: '150px', 
                      height: 'auto', 
                      marginBottom: '1rem',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                    onClick={() => setEnlargedImage('/bindrunethurisazraidho1.png')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                  <h4 style={{ color: '#e8f4fd', marginBottom: '0.5rem' }}>Thurisaz + Raidho</h4>
                  <p style={{ fontSize: '0.9rem', color: '#b8d4e6', marginBottom: '0.5rem' }}>Protection + Journey</p>
                  <p style={{ fontSize: '0.85rem', color: '#a0aec0', fontStyle: 'italic' }}>
                    This bindrune combines the protective power of Thurisaz with the guidance of Raidho. 
                    It's often used for safe travels and protection during journeys, both physical and spiritual.
                  </p>
                </div>
                
                <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)', borderRadius: '12px', border: '2px solid #3a3a3a' }}>
                  <img 
                    src="/bindruneingwazothala2.png" 
                    alt="Ingwaz + Othala Bindrune" 
                    style={{ 
                      maxWidth: '150px', 
                      height: 'auto', 
                      marginBottom: '1rem',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                    onClick={() => setEnlargedImage('/bindruneingwazothala2.png')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                  <h4 style={{ color: '#e8f4fd', marginBottom: '0.5rem' }}>Ingwaz + Othala</h4>
                  <p style={{ fontSize: '0.9rem', color: '#b8d4e6', marginBottom: '0.5rem' }}>Fertility + Heritage</p>
                  <p style={{ fontSize: '0.85rem', color: '#a0aec0', fontStyle: 'italic' }}>
                    This bindrune unites the creative energy of Ingwaz with the ancestral wisdom of Othala. 
                    It represents the continuation of family traditions and the fertile ground for new beginnings.
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#e8f4fd', marginBottom: '1rem' }}>Using Bindrunes</h3>
              <p className="rune-meaning">
                Bindrunes can be carved into wood, stone, or metal, drawn on paper, or visualized in meditation. 
                They are often used for protection, healing, guidance, or to manifest specific intentions. 
                The power of a bindrune comes from the focused intention and the harmonious combination of runic energies.
              </p>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p className="rune-meaning" style={{ fontStyle: 'italic', opacity: 0.8 }}>
                "When runes are bound together, their power multiplies. 
                Choose wisely, for the bindrune becomes a living symbol of your intent."
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'wyrd' && (
        <div>
          <div className="rune-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>The Web of Wyrd</h2>
            
            <p className="rune-meaning" style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <strong>The Web of Wyrd</strong> represents the interconnected nature of all things - past, present, and future. 
              It is the cosmic tapestry woven by the Norns, where every action ripples through time and space.
            </p>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#e8f4fd', marginBottom: '1rem' }}>The Three Norns</h3>
              <p className="rune-meaning">
                <strong>Urd</strong> (Past) - She who has become, representing what has been woven into the fabric of existence.<br />
                <strong>Verdandi</strong> (Present) - She who is becoming, the moment of creation and choice.<br />
                <strong>Skuld</strong> (Future) - She who shall be, the potential and what is owed to the past.
              </p>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#e8f4fd', marginBottom: '1rem' }}>The Nine Worlds</h3>
              <p className="rune-meaning">
                The Web connects all nine realms of Norse cosmology, from the heights of Asgard to the depths of Hel. 
                Each world influences the others, and the threads of wyrd bind them together in an eternal dance of cause and effect.
              </p>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#e8f4fd', marginBottom: '1rem' }}>Understanding Wyrd</h3>
              <p className="rune-meaning">
                Wyrd is not simple fate or destiny, but the complex web of relationships, choices, and consequences that shape our lives. 
                Every decision we make affects the pattern, and every action ripples outward to touch others. 
                The past influences the present, and the present shapes the future, but we always have the power to choose our path.
              </p>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#e8f4fd', marginBottom: '1rem' }}>The Symbol</h3>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{ 
                  fontSize: '4rem', 
                  color: '#e8f4fd',
                  textShadow: '0 0 20px rgba(232, 244, 253, 0.5)',
                  marginBottom: '1rem'
                }}>
                  ᛉ
                </div>
                <p style={{ fontSize: '1.1rem', color: '#b8d4e6', fontStyle: 'italic' }}>
                  The Web of Wyrd symbol represents the interconnected threads of fate
                </p>
              </div>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#e8f4fd', marginBottom: '1rem' }}>The Runes in the Web</h3>
              <p className="rune-meaning">
                All 24 runes of the Elder Futhark can be found within the Web of Wyrd. When we study the runes, 
                we are actually reading the patterns of wyrd itself. The runes are not separate from the Web - 
                they are the Web, expressed in symbolic form.
              </p>
              <p className="rune-meaning">
                When you draw runes or work with them, you are connecting directly to the threads of wyrd. 
                Each rune carries the wisdom of the Web and can reveal how the past, present, and future are 
                woven together in your life. The runes are the language of wyrd, and through them, 
                we can learn to read the patterns of the great tapestry.
              </p>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#e8f4fd', marginBottom: '1rem' }}>Working with Wyrd</h3>
              <p className="rune-meaning">
                To work with wyrd is to understand that we are both weavers and threads in the great tapestry. 
                We can learn to read the patterns, make conscious choices, and take responsibility for our actions. 
                By honoring the past, being mindful in the present, and shaping the future with wisdom, 
                we become active participants in the weaving of our own destiny.
              </p>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p className="rune-meaning" style={{ fontStyle: 'italic', opacity: 0.8 }}>
                "The threads of wyrd are woven by our choices, 
                and every moment is a chance to change the pattern."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(5px)'
          }}
          onClick={closeEnlargedImage}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={enlargedImage} 
              alt="Enlarged Bindrune" 
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
              }}
            />
            <button
              onClick={closeEnlargedImage}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'rgba(232, 244, 253, 0.1)',
                border: '1px solid rgba(232, 244, 253, 0.3)',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                color: '#e8f4fd',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(232, 244, 253, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(232, 244, 253, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(232, 244, 253, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(232, 244, 253, 0.3)';
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

export default App; 