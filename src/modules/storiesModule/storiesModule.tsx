import React, { useState } from 'react';
import StoryViewer from './components/storyViewer';
import "./storiesModule.css";
import type { UserStory } from '../../utilities/types';
import { storyData } from '../../utilities/commonStaticData';

const StoriesModule: React.FC = () => {
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);

  return (
    <div>
      <div className='user-imagse-list'>
        {storyData.map((user: UserStory, index: number) => (
          <div
            key={user.user}
            onClick={() => setSelectedUserIndex(index)}
            className='user-list'
          >
            <img
              src={user.avatar}
              alt={user.user}
              className='user-avtar'
            />
          </div>
        ))}
      </div>

      {selectedUserIndex !== null && (
        <StoryViewer
          user={storyData[selectedUserIndex]}
          onClose={() => setSelectedUserIndex(null)}
        />
      )}
    </div>
  );
};

export default StoriesModule;
