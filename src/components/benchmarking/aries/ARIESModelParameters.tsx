
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useARIESModelParameters } from "./hooks/useARIESModelParameters";

interface ARIESModelParametersProps {
  modelId: string;
}

const ARIESModelParameters = ({ modelId }: ARIESModelParametersProps) => {
  const { parameters } = useARIESModelParameters(modelId);
  const [values, setValues] = useState<Record<string, any>>({});

  const handleValueChange = (paramId: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [paramId]: value
    }));
  };

  if (!parameters || parameters.length === 0) {
    return (
      <div className="text-center py-4 text-sm text-muted-foreground">
        This model does not require additional parameters.
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Model Parameters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {parameters.map((param) => (
            <div key={param.id} className="space-y-2">
              <Label htmlFor={param.id}>
                {param.name}
                {param.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              
              {param.type === 'text' && (
                <Input
                  id={param.id}
                  placeholder={param.placeholder}
                  value={values[param.id] || ''}
                  onChange={(e) => handleValueChange(param.id, e.target.value)}
                />
              )}
              
              {param.type === 'number' && (
                <Input
                  id={param.id}
                  type="number"
                  placeholder={param.placeholder}
                  min={param.min}
                  max={param.max}
                  value={values[param.id] || ''}
                  onChange={(e) => handleValueChange(param.id, parseFloat(e.target.value))}
                />
              )}
              
              {param.type === 'select' && param.options && (
                <Select
                  value={values[param.id] || ''}
                  onValueChange={(value) => handleValueChange(param.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={param.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {param.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {param.type === 'slider' && (
                <div className="pt-2">
                  <Slider
                    defaultValue={[param.defaultValue || param.min || 0]}
                    min={param.min}
                    max={param.max}
                    step={param.step || 1}
                    onValueChange={(values) => handleValueChange(param.id, values[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{param.min}{param.unit}</span>
                    <span>{values[param.id] || param.defaultValue || param.min}{param.unit}</span>
                    <span>{param.max}{param.unit}</span>
                  </div>
                </div>
              )}
              
              {param.type === 'boolean' && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id={param.id}
                    checked={values[param.id] || false}
                    onCheckedChange={(checked) => handleValueChange(param.id, checked)}
                  />
                  <Label htmlFor={param.id}>{param.description}</Label>
                </div>
              )}
              
              {param.description && param.type !== 'boolean' && (
                <p className="text-xs text-muted-foreground">{param.description}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ARIESModelParameters;
