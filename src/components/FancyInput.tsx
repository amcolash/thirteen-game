import React, { useState } from 'react';

interface FancyInputProps {
  initialValue?: string;
  placeholder: string;
  buttonLabel?: string;
  onConfirm: (value: string) => void;
}

const FancyInput = (props: FancyInputProps) => {
  const [value, setValue] = useState(props.initialValue || '');

  return (
    <div>
      <input
        type="text"
        placeholder={props.placeholder}
        value={value}
        style={{ marginLeft: 0 }}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            props.onConfirm(value);
            setValue('');
          }
        }}
      />
      {props.buttonLabel && (
        <button
          onClick={() => {
            props.onConfirm(value);
            setValue('');
          }}
        >
          {props.buttonLabel}
        </button>
      )}
    </div>
  );
};

export default FancyInput;
