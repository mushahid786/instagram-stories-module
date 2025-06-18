import React, { useState, useEffect, useRef } from 'react';
import type { UserStory, StoryItem } from '../../../../utilities/types'; // Adjust path if needed
import './index.css';

interface StoryViewerProps {
  user: UserStory;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ user, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<(HTMLDivElement | null)[]>([]);
  const preloadCache = useRef<Record<number, HTMLImageElement | HTMLVideoElement>>({});

  const currentStory: StoryItem = user.stories[currentIndex];

  const preloadNext = () => {
    const nextIndex = currentIndex + 1;
    const nextStory = user.stories[nextIndex];
    if (!nextStory || preloadCache.current[nextIndex]) return;

    if (nextStory.type === 'image') {
      const img = new Image();
      img.src = nextStory.url;
      preloadCache.current[nextIndex] = img;
    } else if (nextStory.type === 'video') {
      const video = document.createElement('video');
      video.src = nextStory.url;
      video.preload = 'auto';
      preloadCache.current[nextIndex] = video;
    }
  };

  useEffect(() => {
    startTimer();
    preloadNext();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex]);

  const startTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const bar = progressRef.current[currentIndex];
    if (bar) {
      bar.style.transition = 'none';
      bar.style.width = '0%';
      void bar.offsetWidth; // force reflow
      bar.style.transition = `width ${currentStory.duration}ms linear`;
      bar.style.width = '100%';
    }

    timerRef.current = setTimeout(() => {
      if (currentIndex < user.stories.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onClose();
      }
    }, currentStory.duration);
  };

  const handleNext = () => {
    if (currentIndex >= user.stories.length - 1) {
      onClose();
      return;
    }

    const currentBar = progressRef.current[currentIndex];
    if (currentBar) {
      currentBar.style.transition = 'none';
      currentBar.style.width = '100%';
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex <= 0) return;

    const currentBar = progressRef.current[currentIndex];
    if (currentBar) {
      currentBar.style.transition = 'none';
      currentBar.style.width = '0%';
    }

    setCurrentIndex((prev) => prev - 1);
  };

  return (
    <div onClick={handleNext} className="story-viewer-overlay">
      {/* Progress Bars */}
      <div className="story-progress-container">
        {user.stories.map((_, i) => (
          <div key={i} className="story-progress-bar">
            <div
              ref={(el) => { progressRef.current[i] = el; }}
              className="story-progress-fill"
              style={{
                width: i < currentIndex ? '100%' : i === currentIndex ? '0%' : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Current Story Content */}
      {currentStory.type === 'image' && (
        <picture>
          <source srcSet={currentStory.url} type="image/webp" />
          <img
            src={currentStory.url}
            alt="story"
            className="story-content"
          />
        </picture>
      )}
      {currentStory.type === 'video' && (
        <video
          src={currentStory.url}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="story-content"
        />
      )}

      {/* Tap zones */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        className="story-tap-zone"
        style={{ left: 0 }}
      />
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="story-tap-zone"
        style={{ right: 0, left: 'unset', width: '70%' }}
      />

      {/* Close button */}
      <div className="story-close-button" onClick={onClose}>
        ✕
      </div>
    </div>
  );
};

export default StoryViewer;
