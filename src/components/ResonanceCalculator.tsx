
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CircleCheck, ArrowRight } from 'lucide-react';
import FormulaDisplay from './FormulaDisplay';
import ResultPanel from './ResultPanel';

// Type definitions
type ComponentType = 'capacitor' | 'inductor';
type Unit = 'm' | 'µ' | 'n' | 'p';
type FreqUnit = 'Hz' | 'kHz' | 'MHz' | 'GHz';

const ResonanceCalculator = () => {
  // State management
  const [componentType, setComponentType] = useState<ComponentType>('capacitor');
  const [componentValue, setComponentValue] = useState<string>('');
  const [componentUnit, setComponentUnit] = useState<Unit>('µ');
  const [frequency, setFrequency] = useState<string>('');
  const [frequencyUnit, setFrequencyUnit] = useState<FreqUnit>('MHz');
  const [result, setResult] = useState<{ value: number; unit: string } | null>(null);
  const [scientificNotation, setScientificNotation] = useState<string>('');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [calculationPerformed, setCalculationPerformed] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Reset results when inputs change
  useEffect(() => {
    if (calculationPerformed) {
      setResult(null);
      setScientificNotation('');
      setCalculationPerformed(false);
    }
  }, [componentType, componentValue, componentUnit, frequency, frequencyUnit]);

  // Helper function to convert to base units
  const convertToBaseUnit = (value: number, unit: Unit | FreqUnit): number => {
    switch (unit) {
      case 'm': return value * 1e-3;
      case 'µ': return value * 1e-6;
      case 'n': return value * 1e-9;
      case 'p': return value * 1e-12;
      case 'kHz': return value * 1e3;
      case 'MHz': return value * 1e6;
      case 'GHz': return value * 1e9;
      default: return value;
    }
  };

  // Helper function to format the result with appropriate unit
  const formatResult = (value: number): { value: number; unit: string } => {
    let resultUnit = componentType === 'capacitor' ? 'H' : 'F';
    let displayValue = value;
    let prefix = '';

    if (value >= 1) {
      prefix = '';
    } else if (value >= 1e-3) {
      displayValue = value * 1e3;
      prefix = 'm';
    } else if (value >= 1e-6) {
      displayValue = value * 1e6;
      prefix = 'µ';
    } else if (value >= 1e-9) {
      displayValue = value * 1e9;
      prefix = 'n';
    } else if (value >= 1e-12) {
      displayValue = value * 1e12;
      prefix = 'p';
    }

    return { value: displayValue, unit: `${prefix}${resultUnit}` };
  };

  // Calculate the unknown component
  const calculateResonance = () => {
    try {
      if (!componentValue || !frequency) {
        setError('Please fill in all required fields');
        return;
      }

      const compVal = parseFloat(componentValue);
      const freqVal = parseFloat(frequency);
      
      if (isNaN(compVal) || isNaN(freqVal)) {
        setError('Please enter valid numbers');
        return;
      }

      // Convert to base units
      const compValueInBaseUnits = convertToBaseUnit(compVal, componentUnit);
      const freqValueInHz = convertToBaseUnit(freqVal, frequencyUnit);

      // Calculate resonance using the formula: X = 1 / ((2π*f)²*Y)
      const resonanceFrequency = 2 * Math.PI * freqValueInHz;
      const resonanceValue = 1 / (resonanceFrequency * resonanceFrequency * compValueInBaseUnits);

      // Format result
      const formattedResult = formatResult(resonanceValue);
      setResult(formattedResult);
      
      // Create scientific notation
      const sci = resonanceValue.toExponential(4);
      const resultUnit = componentType === 'capacitor' ? 'H' : 'F';
      setScientificNotation(`${sci} ${resultUnit}`);

      setCalculationPerformed(true);
      setError(null);
      setActiveStep(4); // Move to result step
    } catch (err) {
      setError('Calculation error. Please check your inputs.');
      console.error(err);
    }
  };

  // Move to next step
  const handleNextStep = (step: number) => {
    setActiveStep(step);
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">Projecton Yuval & Yarin</h1>
        <p className="text-muted-foreground">Calculate resonant frequencies for electronic circuits</p>
        <p className="text-muted-foreground">Electrical Engineering Lab || May 2025 </p>
      </div>

      {/* Step 1: Component Selection */}
      <div className={`step ${activeStep === 1 ? 'active' : ''}`}>
        <div className="step-number">1</div>
        <h2 className="text-xl font-semibold mb-4">Select Known Component</h2>
        <p className="mb-4 text-muted-foreground">Which component value do you already know?</p>
        <div className="flex flex-wrap gap-4">
          <Button
            variant={componentType === 'capacitor' ? 'default' : 'outline'}
            onClick={() => {
              setComponentType('capacitor');
              handleNextStep(2);
            }}
            className="flex-1 min-w-[150px]"
          >
            Capacitor (C)
          </Button>
          <Button
            variant={componentType === 'inductor' ? 'default' : 'outline'}
            onClick={() => {
              setComponentType('inductor');
              handleNextStep(2);
            }}
            className="flex-1 min-w-[150px]"
          >
            Inductor (L)
          </Button>
        </div>
      </div>

      {/* Step 2: Component Value */}
      <div 
        className={`step ${activeStep === 2 ? 'active' : ''} ${
          activeStep < 2 ? 'opacity-70' : ''
        }`}
      >
        <div className="step-number">2</div>
        <h2 className="text-xl font-semibold mb-4">
          Enter {componentType === 'capacitor' ? 'Capacitor' : 'Inductor'} Value
        </h2>
        <div className="flex flex-wrap md:flex-nowrap gap-4 items-center">
          <div className="w-full md:flex-grow">
            <Input
              type="number"
              placeholder={`Enter ${componentType === 'capacitor' ? 'capacitance' : 'inductance'} value`}
              value={componentValue}
              onChange={(e) => setComponentValue(e.target.value)}
              onFocus={() => setActiveStep(2)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-32">
            <Select value={componentUnit} onValueChange={(value: Unit) => setComponentUnit(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="m">m</SelectItem>
                <SelectItem value="µ">µ</SelectItem>
                <SelectItem value="n">n</SelectItem>
                <SelectItem value="p">p</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-auto">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => componentValue ? handleNextStep(3) : null}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Step 3: Frequency Input */}
      <div 
        className={`step ${activeStep === 3 ? 'active' : ''} ${
          activeStep < 3 ? 'opacity-70' : ''
        }`}
      >
        <div className="step-number">3</div>
        <h2 className="text-xl font-semibold mb-4">Enter Resonance Frequency</h2>
        <div className="flex flex-wrap md:flex-nowrap gap-4 items-center">
          <div className="w-full md:flex-grow">
            <Input
              type="number"
              placeholder="Enter frequency value"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              onFocus={() => setActiveStep(3)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-32">
            <Select 
              value={frequencyUnit} 
              onValueChange={(value: FreqUnit) => setFrequencyUnit(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hz">Hz</SelectItem>
                <SelectItem value="kHz">kHz</SelectItem>
                <SelectItem value="MHz">MHz</SelectItem>
                <SelectItem value="GHz">GHz</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-auto">
            <Button 
              className="w-full" 
              onClick={calculateResonance}
              disabled={!componentValue || !frequency}
            >
              Calculate
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>

      {/* Step 4: Results */}
      <div 
        className={`step ${activeStep === 4 ? 'active' : ''} ${
          activeStep < 4 || !result ? 'opacity-70' : ''
        }`}
      >
        <div className="step-number">4</div>
        <h2 className="text-xl font-semibold mb-4">Results</h2>
        
        {result ? (
          <>
            <ResultPanel
              componentType={componentType === 'capacitor' ? 'inductor' : 'capacitor'}
              result={result}
              scientificNotation={scientificNotation}
            />

            <div className="mt-6">
              <h3 className="font-medium text-lg mb-2">Formula Used</h3>
              <FormulaDisplay 
                componentType={componentType} 
                frequency={frequency} 
                frequencyUnit={frequencyUnit}
                componentValue={componentValue}
                componentUnit={componentUnit}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Fill all fields and click Calculate to see results
          </div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex justify-center mt-4 gap-4">
        {activeStep > 1 && (
          <Button variant="outline" onClick={() => handleNextStep(activeStep - 1)}>
            Previous Step
          </Button>
        )}
        {activeStep < 4 && componentValue && (
          <Button onClick={() => handleNextStep(activeStep + 1)}>
            Next Step
          </Button>
        )}
        {calculationPerformed && (
          <Button 
            variant="outline" 
            onClick={() => {
              setComponentValue('');
              setFrequency('');
              setResult(null);
              setScientificNotation('');
              setCalculationPerformed(false);
              setActiveStep(1);
              setError(null);
            }}
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResonanceCalculator;
