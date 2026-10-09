import React from 'react';
import { StackedStoryCardsStudio } from '../components/story/StackedStoryCardsStudio';

export const StoryPage = () => {
  return (
    <div className="w-full h-full bg-[#070b12] text-slate-100 overflow-hidden">
      <StackedStoryCardsStudio />
    </div>
  );
};

export default StoryPage;

