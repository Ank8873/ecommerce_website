import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { useState } from "react";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  const [errors, setErrors] = useState({});
  const { toast } = useToast();

  const validateField = (name, value, validation) => {
    if (!validation) return "";
    
    if (validation.required && !value) {
      return "This field is required";
    }
    
    if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
      return validation.message || "Invalid format";
    }
    
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    formControls.forEach((control) => {
      const error = validateField(
        control.name,
        formData[control.name],
        control.validation
      );
      if (error) {
        newErrors[control.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    
    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please check your inputs and try again",
      });
    }
    
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  const handleChange = (name, value, validation) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    const error = validateField(name, value, validation);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";
    const error = errors[getControlItem.name];

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <div className="space-y-2">
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              value={value}
              onChange={(event) => 
                handleChange(getControlItem.name, event.target.value, getControlItem.validation)
              }
              className={error ? "border-red-500" : ""}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );
        break;
      case "select":
        element = (
          <div className="space-y-2">
            <Select
              onValueChange={(value) =>
                handleChange(getControlItem.name, value, getControlItem.validation)
              }
              value={value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={getControlItem.label} />
              </SelectTrigger>
              <SelectContent>
                {getControlItem.options && getControlItem.options.length > 0
                  ? getControlItem.options.map((optionItem) => (
                      <SelectItem key={optionItem.id} value={optionItem.id}>
                        {optionItem.label}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );
        break;
      case "textarea":
        element = (
          <div className="space-y-2">
            <Textarea
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.id}
              value={value}
              onChange={(event) => 
                handleChange(getControlItem.name, event.target.value, getControlItem.validation)
              }
              className={error ? "border-red-500" : ""}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );
        break;

      default:
        element = (
          <div className="space-y-2">
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              value={value}
              onChange={(event) => 
                handleChange(getControlItem.name, event.target.value, getControlItem.validation)
              }
              className={error ? "border-red-500" : ""}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button 
        type="submit" 
        className="mt-2 w-full"
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
