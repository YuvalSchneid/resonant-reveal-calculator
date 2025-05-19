
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CircleCheck, Calculator } from 'lucide-react';

// Type definitions
type Unit = 'm' | 'µ' | 'n' | 'p';

const FrequencyCalculator = () => {
  // State management
  const [capacitanceValue, setCapacitanceValue] = useState<string>('');
  const [capacitanceUnit, setCapacitanceUnit] = useState<Unit>('µ');
  const [inductanceValue, setInductanceValue] = useState<string>('');
  const [inductanceUnit, setInductanceUnit] = useState<Unit>('µ');
  const [result, setResult] = useState<{ value: number; unit: string } | null>(null);
  const [scientificNotation, setScientificNotation] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [calculationPerformed, setCalculationPerformed] = useState<boolean>(false);

  // Helper function to convert to base units
  const convertToBaseUnit = (value: number, unit: Unit): number => {
    switch (unit) {
      case 'm': return value * 1e-3;
      case 'µ': return value * 1e-6;
      case 'n': return value * 1e-9;
      case 'p': return value * 1e-12;
      default: return value;
    }
  };

  // Helper function to format frequency with appropriate unit
  const formatFrequency = (hertz: number): { value: number; unit: string } => {
    if (hertz >= 1e9) {
      return { value: hertz / 1e9, unit: 'GHz' };
    } else if (hertz >= 1e6) {
      return { value: hertz / 1e6, unit: 'MHz' };
    } else if (hertz >= 1e3) {
      return { value: hertz / 1e3, unit: 'kHz' };
    } else {
      return { value: hertz, unit: 'Hz' };
    }
  };

  // Calculate the resonance frequency
  const calculateResonanceFrequency = () => {
    try {
      if (!capacitanceValue || !inductanceValue) {
        setError('Please fill in both capacitance and inductance values');
        return;
      }

      const capVal = parseFloat(capacitanceValue);
      const indVal = parseFloat(inductanceValue);
      
      if (isNaN(capVal) || isNaN(indVal)) {
        setError('Please enter valid numbers');
        return;
      }

      // Convert to base units
      const capacitanceInFarads = convertToBaseUnit(capVal, capacitanceUnit);
      const inductanceInHenrys = convertToBaseUnit(indVal, inductanceUnit);

      // Calculate resonance frequency using the formula: f = 1 / (2π * √(LC))
      const resonanceFrequencyInHertz = 1 / (2 * Math.PI * Math.sqrt(inductanceInHenrys * capacitanceInFarads));

      // Format result
      const formattedResult = formatFrequency(resonanceFrequencyInHertz);
      setResult(formattedResult);
      
      // Create scientific notation
      const sci = resonanceFrequencyInHertz.toExponential(4);
      setScientificNotation(`${sci} Hz`);

      setCalculationPerformed(true);
      setError(null);
    } catch (err) {
      setError('Calculation error. Please check your inputs.');
      console.error(err);
    }
  };

  // Reset calculator
  const resetCalculator = () => {
    setCapacitanceValue('');
    setCapacitanceUnit('µ');
    setInductanceValue('');
    setInductanceUnit('µ');
    setResult(null);
    setScientificNotation('');
    setCalculationPerformed(false);
    setError(null);
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">Resonance Frequency Calculator</h1>
        <p className="text-muted-foreground">Calculate the resonance frequency from capacitance and inductance values</p>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Input Component Values</h2>
        
        {/* Capacitance Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Capacitance (C)</label>
          <div className="flex flex-wrap md:flex-nowrap gap-4 items-center">
            <div className="w-full md:flex-grow">
              <Input
                type="number"
                placeholder="Enter capacitance value"
                value={capacitanceValue}
                onChange={(e) => setCapacitanceValue(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-32">
              <Select value={capacitanceUnit} onValueChange={(value: Unit) => setCapacitanceUnit(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m">mF</SelectItem>
                  <SelectItem value="µ">µF</SelectItem>
                  <SelectItem value="n">nF</SelectItem>
                  <SelectItem value="p">pF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Inductance Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Inductance (L)</label>
          <div className="flex flex-wrap md:flex-nowrap gap-4 items-center">
            <div className="w-full md:flex-grow">
              <Input
                type="number"
                placeholder="Enter inductance value"
                value={inductanceValue}
                onChange={(e) => setInductanceValue(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-32">
              <Select value={inductanceUnit} onValueChange={(value: Unit) => setInductanceUnit(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m">mH</SelectItem>
                  <SelectItem value="µ">µH</SelectItem>
                  <SelectItem value="n">nH</SelectItem>
                  <SelectItem value="p">pH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          <Button 
            onClick={calculateResonanceFrequency}
            disabled={!capacitanceValue || !inductanceValue}
            className="flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            Calculate Frequency
          </Button>
          
          {calculationPerformed && (
            <Button 
              variant="outline" 
              onClick={resetCalculator}
            >
              Reset
            </Button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </Card>

      {/* Results Section */}
      {result && (
        <Card className="p-6">
          <div className="result-container animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <CircleCheck className="text-green-600 h-6 w-6" />
              <h3 className="font-semibold text-lg">
                Calculated Resonance Frequency
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

            <div className="mt-6 p-4 bg-white rounded-md border border-indigo-100">
              <p className="text-sm text-muted-foreground mb-2">Formula Used</p>
              <div className="formula-box">
                <div>
                  {/* This will be rendered by MathJax */}
                  {`\\[ f = \\frac{1}{2\\pi \\sqrt{LC}} \\]`}
                  {`\\[ f = \\frac{1}{2\\pi \\sqrt{${capacitanceValue} \\, \\text{${capacitanceUnit}F} \\cdot ${inductanceValue} \\, \\text{${inductanceUnit}H}}} \\]`}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FrequencyCalculator;
