import React, { ReactNode, useEffect, useState } from 'react';

interface FancyInputProps {
  initialValue?: string;
  placeholder: string;
  buttonLabel?: string;
  onConfirm?: (value: string) => void;
  onChange?: (value: string) => void;
  children?: ReactNode;
}

const FancyInput = (props: FancyInputProps) => {
  const [value, setValue] = useState(props.initialValue || '');

  useEffect(() => {
    if (props.initialValue) setValue(props.initialValue);
  }, [props.initialValue]);

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder={props.placeholder}
        value={value}
        style={{ marginLeft: 0 }}
        onChange={(e) => {
          setValue(e.target.value);
          if (props.onChange) props.onChange(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && props.onConfirm) {
            props.onConfirm(value);
            setValue('');
          }
        }}
      />
      {props.children}
      {props.buttonLabel && (
        <button
          onClick={() => {
            if (props.onConfirm) {
              props.onConfirm(value);
              setValue('');
            }
          }}
        >
          {props.buttonLabel}
        </button>
      )}
    </div>
  );
};

export default FancyInput;
