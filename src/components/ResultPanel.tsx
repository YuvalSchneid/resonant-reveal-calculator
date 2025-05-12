
import React from 'react';
import { CircleCheck } from 'lucide-react';

type ResultPanelProps = {
  componentType: 'capacitor' | 'inductor';
  result: {
    value: number;
    unit: string;
  };
  scientificNotation: string;
};

const ResultPanel = ({ componentType, result, scientificNotation }: ResultPanelProps) => {
  return (
    <div className="result-container animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <CircleCheck className="text-green-600 h-6 w-6" />
        <h3 className="font-semibold text-lg">
          Calculated {componentType === 'capacitor' ? 'Capacitance' : 'Inductance'}
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-md border border-indigo-100">
          <p className="text-sm text-muted-foreground mb-1">Scaled Value</p>
          <p className="text-3xl font-semibold text-indigo-700">
            {result.value.toFixed(2)} {result.unit}
          </p>
        </div>
        
        <div className="p-4 bg-white rounded-md border border-indigo-100">
          <p className="text-sm text-muted-foreground mb-1">Scientific Notation</p>
          <p className="text-3xl font-semibold text-indigo-700">
            {scientificNotation}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultPanel;
