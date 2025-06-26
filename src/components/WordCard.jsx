// WordCard.jsx
import React from 'react';
import './WordCard.css';

function WordCard({
  word,
  meaning,
  example,
  onNewWord,
  onFavorite,
  isFavorite,
  onPronounce,
}) {
  return (
    <div className="card">

      <h2 className="title">⭐ Word of the Day</h2>

      {/* ◀️ NEW flex row */}
      <div className="word-row">
        <h1 className="word">{word}</h1>

        <button
          className="audio-btn"
          onClick={() => onPronounce(word)}
          aria-label="Play pronunciation"
        >
          🔊
        </button>
      </div>

      <p className="meaning">{meaning}</p>
      <p className="example">"{example}"</p>

      <button className="new-word-btn" onClick={onNewWord}>
        🔁 New Word
      </button>

      <button
        className={`fav-btn ${isFavorite ? 'active' : ''}`}
        onClick={onFavorite}
      >
        {isFavorite ? '❤️' : '🤍'} Favourite
      </button>
    </div>
  );
}

export default WordCard;
