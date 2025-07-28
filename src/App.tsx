import React, { useState, useEffect, useRef } from 'react';
import { runes, getRandomRune, Rune } from './data/runes';
import { BookOpen, Sparkles, Search } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'dictionary' | 'lookup' | 'bindrunes' | 'wyrd' | 'randompull' | 'history'>('dictionary');
  const [dailyRune, setDailyRune] = useState<Rune | null>(null);
  const [selectedRunes, setSelectedRunes] = useState<Rune[]>([]);
  const [revealedRunes, setRevealedRunes] = useState<Rune[]>([]);
  const [runeCount, setRuneCount] = useState<'one' | 'two' | 'three' | 'five'>('one');
  const [isPulling, setIsPulling] = useState(false);
  const [selectedLookupRune, setSelectedLookupRune] = useState<Rune | null>(null);
  const [dictionarySearch, setDictionarySearch] = useState('');
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  // New state for horizontal pull
  const [horizontalRuneCount, setHorizontalRuneCount] = useState<'one' | 'two' | 'three' | 'five'>('one');
  const [horizontalPulledRunes, setHorizontalPulledRunes] = useState<Rune[]>([]);
  const [horizontalRevealedRunes, setHorizontalRevealedRunes] = useState<number>(0);

  // Add state for tracking window size
  const [isMobile, setIsMobile] = useState(false);
  
  // Add state for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const runeDrawingContainerRef = useRef<HTMLDivElement>(null);
  const singleRuneResultRef = useRef<HTMLDivElement>(null);
  const multipleRunesResultRef = useRef<HTMLDivElement>(null);

  // Effect to track window size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 700);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Helper function to get runes in mobile-first order
  const getMobileOrderedRunes = (runes: Rune[], revealedCount: number) => {
    if (!isMobile || revealedCount === 0) {
      return runes;
    }
    
    return [...runes].sort((a, b) => {
      const aIndex = runes.indexOf(a);
      const bIndex = runes.indexOf(b);
      const aRevealed = aIndex < revealedCount;
      const bRevealed = bIndex < revealedCount;
      
      // Show revealed runes first, then hidden ones
      if (aRevealed && !bRevealed) return -1;
      if (!aRevealed && bRevealed) return 1;
      
      // Among revealed runes, show most recently revealed first
      if (aRevealed && bRevealed) {
        return bIndex - aIndex; // Most recent first
      }
      
      // Among hidden runes, keep original order
      return aIndex - bIndex;
    });
  };

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

  // New horizontal pull logic
  const pullHorizontalRunes = () => {
    const count = parseInt(horizontalRuneCount === 'one' ? '1' : horizontalRuneCount === 'two' ? '2' : horizontalRuneCount === 'three' ? '3' : '5');
    const newRunes: Rune[] = [];
    const usedIndices = new Set<number>();
    while (newRunes.length < count) {
      const randomIndex = Math.floor(Math.random() * runes.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        newRunes.push(runes[randomIndex]);
      }
    }
    setHorizontalPulledRunes(newRunes);
    setHorizontalRevealedRunes(0);
  };
  const revealNextHorizontalRune = () => {
    if (horizontalRevealedRunes < horizontalPulledRunes.length) {
      setHorizontalRevealedRunes((prev) => prev + 1);
    }
  };
  const resetHorizontalRunes = () => {
    setHorizontalPulledRunes([]);
    setHorizontalRevealedRunes(0);
  };

  // Scroll to multiple runes container when it appears or changes
  useEffect(() => {
    if (selectedRunes.length > 0 && !dailyRune) {
      scrollToContainer(multipleRunesResultRef);
    }
  }, [selectedRunes, dailyRune]);

  const handleTabChange = (tab: 'dictionary' | 'lookup' | 'bindrunes' | 'wyrd' | 'randompull' | 'history') => {
    setActiveTab(tab);
    setSelectedLookupRune(null);
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
    // Scroll to top for all tabs with a small delay to ensure menu closes first
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
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
          
          {isMobile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
                  border: '2px solid #3a3a3a',
                  borderRadius: '8px',
                  color: '#e8f4fd',
                  padding: '0.75rem 1rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: 'Cinzel, serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
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
                <span style={{ fontSize: '1.2rem' }}>☰</span>
                {isMobileMenuOpen ? 'Hide Menu' : 'Show Menu'}
              </button>
              
              {isMobileMenuOpen && (
                <nav className="top-nav" style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  left: 0, 
                  right: 0,
                  background: 'rgba(15, 15, 15, 0.95)',
                  backdropFilter: 'blur(15px)',
                  borderTop: '1px solid #3a3a3a',
                  padding: '1rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  zIndex: 1000
                }}>
                  <button
                    className={`nav-button ${activeTab === 'randompull' ? 'active' : ''}`}
                    onClick={() => handleTabChange('randompull')}
                  >
                    <span style={{
                      fontSize: '1.7rem',
                      fontWeight: 'bold',
                      color: '#e8f4fd',
                      textShadow: '0 0 8px #63b3ed, 0 0 16px #63b3ed',
                      marginRight: '0.5rem',
                      verticalAlign: 'middle',
                      display: 'inline-block',
                      lineHeight: 1
                    }}>ᛟ</span>
                    <span>Pull Random Runes</span>
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

                  <button
                    className={`nav-button ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => handleTabChange('history')}
                  >
                    <span style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#e8f4fd',
                      textShadow: '0 0 8px #63b3ed, 0 0 16px #63b3ed',
                      marginRight: '0.5rem',
                      verticalAlign: 'middle',
                      display: 'inline-block',
                      lineHeight: 1
                    }}>ᚨ</span>
                    <span>History of Runes</span>
                  </button>
                </nav>
              )}
            </div>
          ) : (
            <nav className="top-nav">
              <button
                className={`nav-button ${activeTab === 'randompull' ? 'active' : ''}`}
                onClick={() => handleTabChange('randompull')}
              >
                <span style={{
                  fontSize: '1.7rem',
                  fontWeight: 'bold',
                  color: '#e8f4fd',
                  textShadow: '0 0 8px #63b3ed, 0 0 16px #63b3ed',
                  marginRight: '0.5rem',
                  verticalAlign: 'middle',
                  display: 'inline-block',
                  lineHeight: 1
                }}>ᛟ</span>
                <span>Pull Random Runes</span>
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

              <button
                className={`nav-button ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => handleTabChange('history')}
              >
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#e8f4fd',
                  textShadow: '0 0 8px #63b3ed, 0 0 16px #63b3ed',
                  marginRight: '0.5rem',
                  verticalAlign: 'middle',
                  display: 'inline-block',
                  lineHeight: 1
                }}>ᚨ</span>
                <span>History of Runes</span>
              </button>
            </nav>
          )}
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

      {activeTab === 'randompull' && (
        <div style={{ maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', marginTop: 0 }}>
              {(['one', 'two', 'three', 'five'] as const).map((count) => (
                <button
                  key={count}
                  onClick={() => {
                    setHorizontalRuneCount(count);
                    setHorizontalPulledRunes([]);
                    setHorizontalRevealedRunes(0);
                  }}
                  style={{
                    background: horizontalRuneCount === count 
                      ? 'linear-gradient(145deg, #4a5568, #2d3748)' 
                      : 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
                    color: '#e8f4fd',
                    border: horizontalRuneCount === count ? '2px solid #63b3ed' : '2px solid #3a3a3a',
                    borderRadius: '8px',
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: horizontalRuneCount === count ? '0 0 15px rgba(99, 179, 237, 0.3)' : 'none',
                    minWidth: '120px'
                  }}
                  onMouseEnter={(e) => {
                    if (horizontalRuneCount !== count) {
                      e.currentTarget.style.background = 'linear-gradient(145deg, #3a3a3a, #2a2a2a)';
                      e.currentTarget.style.borderColor = '#4a5568';
                      e.currentTarget.style.boxShadow = '0 0 10px rgba(99, 179, 237, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (horizontalRuneCount !== count) {
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
            {/* Context-sensitive main action button */}
            {horizontalPulledRunes.length === 0 ? (
              <button className="pull-button" style={{ marginBottom: '1.5rem', marginTop: 0 }} onClick={pullHorizontalRunes}>
                Pull {horizontalRuneCount === 'one' ? 'Rune' : horizontalRuneCount === 'two' ? 'Two Runes' : horizontalRuneCount === 'three' ? 'Three Runes' : 'Five Runes'}
              </button>
            ) : horizontalRevealedRunes < horizontalPulledRunes.length ? (
              <button className="pull-button" style={{ marginBottom: '1.5rem', marginTop: 0 }} onClick={revealNextHorizontalRune}>
                Reveal Next Rune ({horizontalRevealedRunes + 1} of {horizontalPulledRunes.length})
              </button>
            ) : (
              <button 
                className="pull-button" 
                style={{ 
                  marginBottom: '1.5rem',
                  marginTop: 0,
                  background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
                  border: '2px solid #2a2a2a',
                  color: '#e8f4fd',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  padding: '1.2rem 2.5rem',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                  textShadow: '0 0 8px rgba(232, 244, 253, 0.3)',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  fontFamily: 'Cinzel, serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  cursor: 'pointer'
                }} 
                onClick={pullHorizontalRunes}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(145deg, #2a2a2a, #1a1a1a)';
                  e.currentTarget.style.borderColor = '#3a3a3a';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.5), 0 0 20px rgba(232, 244, 253, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.textShadow = '0 0 12px rgba(232, 244, 253, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(145deg, #1a1a1a, #0f0f0f)';
                  e.currentTarget.style.borderColor = '#2a2a2a';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.textShadow = '0 0 8px rgba(232, 244, 253, 0.3)';
                }}
              >
                <span style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(232, 244, 253, 0.1), transparent)',
                  transition: 'left 0.5s ease',
                  pointerEvents: 'none'
                }} />
                <span style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '1.5rem',
                  opacity: 0.1,
                  color: '#e8f4fd',
                  pointerEvents: 'none',
                  fontFamily: 'Cinzel, serif'
                }}>
                  ᛟ
                </span>
                Pull Another {horizontalRuneCount === 'one' ? 'Rune' : horizontalRuneCount === 'two' ? 'Two Runes' : horizontalRuneCount === 'three' ? 'Three Runes' : 'Five Runes'}
              </button>
            )}
          </div>
          
          {/* Get ordered runes for display */}
          {(() => {
            const orderedRunes = getMobileOrderedRunes(horizontalPulledRunes, horizontalRevealedRunes);
            
            return (
              <>
                {/* Custom layout for 5 runes */}
                {horizontalPulledRunes.length === 5 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
                    <div className="five-rune-row" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
                      {orderedRunes.slice(0, 3).map((rune, _) => {
                        const originalIndex = horizontalPulledRunes.indexOf(rune);
                        return (
                          <div key={originalIndex} style={{
                            background: 'linear-gradient(145deg, #3a3a3a, #2a2a2a)',
                            border: '2px solid #4a5568',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            textAlign: 'center',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                            transition: 'all 0.3s ease',
                            minHeight: '200px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            maxWidth: '350px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            position: 'relative'
                          }}>
                            {originalIndex < horizontalRevealedRunes && horizontalPulledRunes.length > 1 && (
                              <div style={{
                                position: 'absolute',
                                top: '-10px',
                                right: '-10px',
                                background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
                                border: '2px solid #4a5568',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                                zIndex: 10
                              }}>
                                <span style={{
                                  color: '#e8f4fd',
                                  fontSize: '1rem',
                                  fontWeight: 'bold',
                                  fontFamily: 'Cinzel, serif',
                                  textShadow: '0 0 8px rgba(232, 244, 253, 0.3)'
                                }}>
                                  {originalIndex + 1}
                                </span>
                              </div>
                            )}
                            {originalIndex < horizontalRevealedRunes ? (
                              <>
                                <span className="rune-symbol" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{rune.symbol}</span>
                                <h3 className="rune-name" style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{rune.name}</h3>
                                <p className="rune-meaning" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                                  <strong>{rune.meaning}</strong>
                                </p>
                                <p className="rune-meaning" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                                  {rune.description}
                                </p>
                              </>
                            ) : (
                              <>
                                <span className="rune-symbol" style={{ fontSize: '3.5rem', opacity: 0.3, marginBottom: '1rem' }}>?</span>
                                <h3 className="rune-name" style={{ fontSize: '1.3rem', opacity: 0.3, marginBottom: '0.5rem' }}>Hidden</h3>
                                <p style={{ fontSize: '1rem', color: '#a0aec0', fontStyle: 'italic' }}>
                                  Click "Reveal Next Rune" to uncover this rune
                                </p>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="five-rune-row" style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                      {orderedRunes.slice(3, 5).map((rune, _) => {
                        const originalIndex = horizontalPulledRunes.indexOf(rune);
                        return (
                          <div key={originalIndex + 3} style={{
                            background: 'linear-gradient(145deg, #3a3a3a, #2a2a2a)',
                            border: '2px solid #4a5568',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            textAlign: 'center',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                            transition: 'all 0.3s ease',
                            minHeight: '200px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            maxWidth: '350px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            position: 'relative'
                          }}>
                            {originalIndex < horizontalRevealedRunes && horizontalPulledRunes.length > 1 && (
                              <div style={{
                                position: 'absolute',
                                top: '-10px',
                                right: '-10px',
                                background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
                                border: '2px solid #4a5568',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                                zIndex: 10
                              }}>
                                <span style={{
                                  color: '#e8f4fd',
                                  fontSize: '1rem',
                                  fontWeight: 'bold',
                                  fontFamily: 'Cinzel, serif',
                                  textShadow: '0 0 8px rgba(232, 244, 253, 0.3)'
                                }}>
                                  {originalIndex + 1}
                                </span>
                              </div>
                            )}
                            {originalIndex < horizontalRevealedRunes ? (
                              <>
                                <span className="rune-symbol" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{rune.symbol}</span>
                                <h3 className="rune-name" style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{rune.name}</h3>
                                <p className="rune-meaning" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                                  <strong>{rune.meaning}</strong>
                                </p>
                                <p className="rune-meaning" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                                  {rune.description}
                                </p>
                              </>
                            ) : (
                              <>
                                <span className="rune-symbol" style={{ fontSize: '3.5rem', opacity: 0.3, marginBottom: '1rem' }}>?</span>
                                <h3 className="rune-name" style={{ fontSize: '1.3rem', opacity: 0.3, marginBottom: '0.5rem' }}>Hidden</h3>
                                <p style={{ fontSize: '1rem', color: '#a0aec0', fontStyle: 'italic' }}>
                                  Click "Reveal Next Rune" to uncover this rune
                                </p>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : horizontalPulledRunes.length === 3 ? (
                  <div className="three-rune-container" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                    <div className="three-rune-grid">
                      {orderedRunes.map((rune, _) => {
                        const originalIndex = horizontalPulledRunes.indexOf(rune);
                        return (
                          <div
                            key={originalIndex}
                            style={{
                              background: 'linear-gradient(145deg, #3a3a3a, #2a2a2a)',
                              border: '2px solid #4a5568',
                              borderRadius: '12px',
                              padding: '1.5rem',
                              textAlign: 'center',
                              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                              transition: 'all 0.3s ease',
                              minHeight: '200px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              maxWidth: '350px',
                              width: '280px',
                              position: 'relative'
                            }}
                          >
                            {originalIndex < horizontalRevealedRunes && horizontalPulledRunes.length > 1 && (
                              <div style={{
                                position: 'absolute',
                                top: '-10px',
                                right: '-10px',
                                background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
                                border: '2px solid #4a5568',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                                zIndex: 10
                              }}>
                                <span style={{
                                  color: '#e8f4fd',
                                  fontSize: '1rem',
                                  fontWeight: 'bold',
                                  fontFamily: 'Cinzel, serif',
                                  textShadow: '0 0 8px rgba(232, 244, 253, 0.3)'
                                }}>
                                  {originalIndex + 1}
                                </span>
                              </div>
                            )}
                            {originalIndex < horizontalRevealedRunes ? (
                              <>
                                <span className="rune-symbol" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{rune.symbol}</span>
                                <h3 className="rune-name" style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{rune.name}</h3>
                                <p className="rune-meaning" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                                  <strong>{rune.meaning}</strong>
                                </p>
                                <p className="rune-meaning" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                                  {rune.description}
                                </p>
                              </>
                            ) : (
                              <>
                                <span className="rune-symbol" style={{ fontSize: '3.5rem', opacity: 0.3, marginBottom: '1rem' }}>?</span>
                                <h3 className="rune-name" style={{ fontSize: '1.3rem', opacity: 0.3, marginBottom: '0.5rem' }}>Hidden</h3>
                                <p style={{ fontSize: '1rem', color: '#a0aec0', fontStyle: 'italic' }}>
                                  Click "Reveal Next Rune" to uncover this rune
                                </p>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '2rem',
                      justifyContent: 'center',
                      marginTop: '2rem',
                      marginBottom: '2rem',
                      maxWidth: '100%',
                      width: 'fit-content',
                      marginLeft: 'auto',
                      marginRight: 'auto'
                    }}
                  >
                    {orderedRunes.map((rune, _) => {
                      const originalIndex = horizontalPulledRunes.indexOf(rune);
                      return (
                        <div
                          key={originalIndex}
                          style={{
                            background: 'linear-gradient(145deg, #3a3a3a, #2a2a2a)',
                            border: '2px solid #4a5568',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            textAlign: 'center',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                            transition: 'all 0.3s ease',
                            minHeight: '200px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            maxWidth: '350px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            position: 'relative'
                          }}
                        >
                          {originalIndex < horizontalRevealedRunes && horizontalPulledRunes.length > 1 && (
                            <div style={{
                              position: 'absolute',
                              top: '-10px',
                              right: '-10px',
                              background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
                              border: '2px solid #4a5568',
                              borderRadius: '50%',
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                              zIndex: 10
                            }}>
                              <span style={{
                                color: '#e8f4fd',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                fontFamily: 'Cinzel, serif',
                                textShadow: '0 0 8px rgba(232, 244, 253, 0.3)'
                              }}>
                                {originalIndex + 1}
                              </span>
                            </div>
                          )}
                          {originalIndex < horizontalRevealedRunes ? (
                            <>
                              <span className="rune-symbol" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{rune.symbol}</span>
                              <h3 className="rune-name" style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{rune.name}</h3>
                              <p className="rune-meaning" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                                <strong>{rune.meaning}</strong>
                              </p>
                              <p className="rune-meaning" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                                {rune.description}
                              </p>
                            </>
                          ) : (
                            <>
                              <span className="rune-symbol" style={{ fontSize: '3.5rem', opacity: 0.3, marginBottom: '1rem' }}>?</span>
                              <h3 className="rune-name" style={{ fontSize: '1.3rem', opacity: 0.3, marginBottom: '0.5rem' }}>Hidden</h3>
                              <p style={{ fontSize: '1rem', color: '#a0aec0', fontStyle: 'italic' }}>
                                Click "Reveal Next Rune" to uncover this rune
                              </p>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()}
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
              They are used to create powerful magical symbols that combine the meanings and powers of multiple runes.
            </p>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#e8f4fd', marginBottom: '1rem' }}>How Bindrunes Work</h3>
              <p className="rune-meaning">
                When creating a bindrune, runes are overlapped, and shared lines are combined. 
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
              <h3 style={{ color: '#e8f4fd', marginBottom: '1rem' }}>Simple Bindrune Examples</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
                <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)', borderRadius: '12px', border: '2px solid #3a3a3a' }}>
                  <img 
                  src={`${import.meta.env.BASE_URL}bindrunethurisazraidho1.png`}
                    alt="Thurisaz + Raidho Bindrune" 
                    style={{ 
                      maxWidth: '150px', 
                      height: 'auto', 
                      marginBottom: '1rem',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                    onClick={() => setEnlargedImage(`${import.meta.env.BASE_URL}bindrunethurisazraidho1.png`)}
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
                    It can be used for safe travels and protection during journeys, both physical and spiritual.
                  </p>
                </div>
                
                <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)', borderRadius: '12px', border: '2px solid #3a3a3a' }}>
                  <img 
                   src={`${import.meta.env.BASE_URL}bindruneingwazothala1.png`}
                    alt="Ingwaz + Othala Bindrune" 
                    style={{ 
                      maxWidth: '150px', 
                      height: 'auto', 
                      marginBottom: '1rem',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                    onClick={() => setEnlargedImage(`${import.meta.env.BASE_URL}bindruneingwazothala1.png`)}
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
                Bindrunes can be carved into wood, stone, or metal, drawn on paper, or visualized, and shaped in countless other forms.
                They can be used for protection, correction of life paths, guidance, or to pursue specific intentions. 
                The power of a bindrune comes from the focused intention and the harmonious combination of runic energies.
              </p>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p className="rune-meaning" style={{ fontStyle: 'italic', opacity: 0.8 }}>
                When runes are bound together, their power multiplies. 
                Choose wisely, for the bindrune becomes a living symbol of your intent.
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
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '2rem', 
                  flexWrap: 'wrap',
                  marginBottom: '1rem'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <img 
                    src={`${import.meta.env.BASE_URL}webofwyrd1.png`}
                      alt="Web of Wyrd Symbol 1" 
                      style={{
                        width: '200px',
                        height: '200px',
                        objectFit: 'contain',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                        borderRadius: '8px',
                        border: '2px solid #3a3a3a'
                      }}
                      onClick={() => setEnlargedImage(`${import.meta.env.BASE_URL}webofwyrd1.png`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                    <p style={{ fontSize: '0.9rem', color: '#b8d4e6', marginTop: '0.5rem' }}>Web of Wyrd - Version 1</p>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <img 
                    src={`${import.meta.env.BASE_URL}webofwyrd2.png`}
                      alt="Web of Wyrd Symbol 2" 
                      style={{
                        width: '200px',
                        height: '200px',
                        objectFit: 'contain',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                        borderRadius: '8px',
                        border: '2px solid #3a3a3a'
                      }}
                      onClick={() => setEnlargedImage(`${import.meta.env.BASE_URL}webofwyrd2.png`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                    <p style={{ fontSize: '0.9rem', color: '#b8d4e6', marginTop: '0.5rem' }}>Web of Wyrd - Version 2</p>
                  </div>
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
                they are part of the Web, expressed in symbolic form.
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
                By honoring the past, being attentive in the present, and shaping the future with wisdom, 
                we become active participants in the weaving of our own destiny.
              </p>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p className="rune-meaning" style={{ fontStyle: 'italic', opacity: 0.8 }}>
                The threads of wyrd are woven by our choices, 
                and every moment is a chance to change the pattern.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="rune-card" style={{ maxWidth: '800px', margin: '3rem auto', padding: '2rem', background: 'linear-gradient(145deg, #23272e, #181a1f)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', color: '#e8f4fd', fontFamily: 'Crimson Text, serif', fontSize: '1.2rem', lineHeight: 1.7 }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontFamily: 'Cinzel, serif', fontSize: '2.2rem', letterSpacing: '0.1em', color: '#b8d4e6', textShadow: '0 0 12px #63b3ed' }}>
            The History of the Runes
          </h2>
          <p style={{ fontStyle: 'italic', color: '#b8d4e6', marginBottom: '2rem', textAlign: 'center' }}>
            "Nine mighty nights I hung on the wind-swept tree, wounded by spear, given to Odin, myself to myself..."
          </p>
          <p>
            In the mists of the ancient North, before the world was fully formed, the runes were hidden mysteries, woven into the fabric of existence. The gods themselves did not know their secrets. It was Odin, the Allfather, who sought their wisdom above all else.
          </p>
          <p>
            Odin sacrificed himself upon Yggdrasil, the World Tree, hanging for nine nights and nine days, pierced by his own spear, without food or drink. In this ordeal, he gazed into the depths of the Well of Urd, where the Norns weave the fates of gods and men. There, in the darkness and pain, the runes revealed themselves to him—shimmering symbols of power, fate, and magic.
          </p>
          <p>
            With a final cry, Odin seized the runes, gaining their knowledge and the ability to shape destiny. He brought the runes back to the worlds, teaching them to gods, elves, and humankind. Thus, the runes became the language of magic, poetry, and prophecy, a bridge between the seen and unseen.
          </p>
          <p style={{ marginTop: '2rem', color: '#b8d4e6', fontStyle: 'italic', textAlign: 'center' }}>
            From the Well of Urd, from the roots of Yggdrasil, the runes came forth—gifts of sacrifice, wisdom, and fate.
          </p>
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
            backdropFilter: 'blur(5px)',
            padding: '20px'
          }}
          onClick={closeEnlargedImage}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: 'min(95vw, 1600px)',
              maxHeight: 'min(95vh, 1000px)',
              width: 'fit-content',
              height: 'fit-content',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={enlargedImage} 
              alt="Enlarged Bindrune" 
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
              }}
            />
            <button
              onClick={closeEnlargedImage}
              style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                background: 'rgba(232, 244, 253, 0.1)',
                border: '1px solid rgba(232, 244, 253, 0.3)',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                color: '#e8f4fd',
                cursor: 'pointer',
                fontSize: '1.3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                zIndex: 2001
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(232, 244, 253, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(232, 244, 253, 0.5)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(232, 244, 253, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(232, 244, 253, 0.3)';
                e.currentTarget.style.transform = 'scale(1)';
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