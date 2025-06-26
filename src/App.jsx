import React, { useEffect, useState } from 'react';
import './App.css';
import WordCard from './components/WordCard';
import { wordList as words } from './data/wordList';

function App() {
  /* ── hydrate current word from localStorage ─── */
  const [word, setWord]       = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('currentWord') || 'null');
    if (saved) {
      setWord(saved.word);
      setMeaning(saved.meaning);
      setExample(saved.example);
    } else {
      showNewWord();                    
    }
  }, []);                               

  /* ─── the rest of your state ──── */
  const [usedIndexes, setUsedIndexes] = useState([]);

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favoriteWords')) || [];
    } catch { return []; }
  });

  const [showSavedList, setShowSavedList] = useState(false);

  /* ─── new random word ──── */
  const showNewWord = () => {
    if (usedIndexes.length === words.length) {
      alert('All words shown. Starting again.');
      setUsedIndexes([]);
    }
    let index;
    do { index = Math.floor(Math.random() * words.length); }
    while (usedIndexes.includes(index));

    const { word, meaning, example } = words[index];
    setWord(word);
    setMeaning(meaning);
    setExample(example);
    setUsedIndexes(prev => [...prev, index]);
  };

  /* ─── persist current word whenever it changes ──── */
  useEffect(() => {
    if (word) {
      localStorage.setItem('currentWord', JSON.stringify({ word, meaning, example }));
    }
  }, [word, meaning, example]);

  /* ──── favourites helpers (unchanged) ──── */
  const toggleFavorites = () => {
    const exists = favorites.some(w => w.word.toLowerCase() === word.toLowerCase());
    setFavorites(prev =>
      exists
        ? prev.filter(w => w.word.toLowerCase() !== word.toLowerCase())
        : [...prev, { word, meaning, example }]
    );
  };

  const removeFavorite = w =>
    setFavorites(prev => prev.filter(x => x.word.toLowerCase() !== w.toLowerCase()));

  const isCurrentFavorite = favorites.some(f => f.word.toLowerCase() === word.toLowerCase());

  /* save favourites list */
  useEffect(() => {
    localStorage.setItem('favoriteWords', JSON.stringify(favorites));
  }, [favorites]);

  /* ───── pronounce helper (unchanged) ──── */
  const pronounceWord = w => {
    if (!w) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(w);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  };

  /* ──── render ─── */
  return (
    <div className="container">
      <h1>OneWord</h1>

      {!showSavedList ? (
        <WordCard
          word={word}
          meaning={meaning}
          example={example}
          onNewWord={showNewWord}
          onFavorite={toggleFavorites}
          isFavorite={isCurrentFavorite}
          onPronounce={pronounceWord}
        />
      ) : (
        <div className="saved-list">
          <h2>Saved Words</h2>
          {favorites.length === 0 ? (
            <p>No saved words yet.</p>
          ) : (
            <ul>
              {favorites.map(({ word, meaning, example }, i) => (
                <li key={i}>
                  <strong>{word}</strong>: {meaning}<br />
                  <em>{example}</em><br />
                  <button onClick={() => removeFavorite(word)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
          <button className="close-btn" onClick={() => setShowSavedList(false)}>🗙</button>
        </div>
      )}

      {!showSavedList && (
        <footer className="footer">
          <span className="left">© 2025 Kanak</span>
          <button className="right" onClick={() => setShowSavedList(true)}>📃 Saved</button>
        </footer>
      )}
    </div>
  );
}

export default App;
