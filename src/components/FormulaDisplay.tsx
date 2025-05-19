
import React, { useEffect, useRef } from 'react';

type FormulaDisplayProps = {
  componentType: 'capacitor' | 'inductor';
  frequency: string;
  frequencyUnit: string;
  componentValue: string;
  componentUnit: string;
};

const FormulaDisplay = ({ 
  componentType,
  frequency,
  frequencyUnit,
  componentValue,
  componentUnit
}: FormulaDisplayProps) => {
  const formulaRef = useRef<HTMLDivElement>(null);
  
  // Output variables
  const outputType = componentType === 'capacitor' ? 'L' : 'C';
  const inputType = componentType === 'capacitor' ? 'C' : 'L';
  
  useEffect(() => {
    // Ensure MathJax is loaded
    if (window.MathJax && formulaRef.current) {
      const formula = formulaRef.current;
      window.MathJax.typesetClear([formula]);
      window.MathJax.typesetPromise([formula]).catch((err) => console.error('MathJax error:', err));
    }
  }, [componentType, frequency, componentValue]);

  return (
    <div className="formula-box py-2">
      <div ref={formulaRef}>
        {/* General Formula */}
        <div className="mb-4">
          <p className="mb-2 text-sm text-muted-foreground">General Formula:</p>
          {`\\[ ${outputType} = \\frac{1}{(2\\pi f)^2 \\cdot ${inputType}} \\]`}
        </div>
        
        {/* Applied Formula with Values */}
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Applied Formula:</p>
          {`\\[ ${outputType} = \\frac{1}{(2\\pi \\cdot ${frequency}\\,\\text{${frequencyUnit}})^2 \\cdot ${componentValue}\\,\\text{${componentUnit}}} \\]`}
        </div>
      </div>
    </div>
  );
};

// Add MathJax types
declare global {
  interface Window {
    MathJax: {
      typesetPromise: (elements: HTMLElement[]) => Promise<void>;
      typesetClear: (elements: HTMLElement[]) => void;
    };
  }
}

export default FormulaDisplay;
