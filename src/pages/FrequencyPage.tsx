
import React from 'react';
import FrequencyCalculator from '../components/FrequencyCalculator';

const FrequencyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary py-8">
      <div className="container mx-auto px-4">
        <FrequencyCalculator />
      </div>
    </div>
  );
};

export default FrequencyPage;
