import React from 'react';
import {
  Controller,
  Control,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';
import './style/index.scss';
import color from '@assets/styles/color';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export interface SelectFieldProps<T extends FieldValues = FieldValues> {
  options: { value: string; label: string; component?: React.ReactNode }[];
  label?: string;
  error?: string;
  inputBorder?: boolean;
  controllerProps: {
    name: string;
    rules?: RegisterOptions;
    defaultValue?: any;
    shouldUnregister?: boolean;
    control?: Control<any>;
  };
  multiple?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  options,
  label,
  error,
  controllerProps,
  inputBorder = false,
  multiple = false,
}) => {
  return (
    <Controller
      {...controllerProps}
      render={({ field, fieldState }) => (
        <div
          className={`select-field   ${
            fieldState?.error?.message || error ? 'error' : ''
          }
           ${inputBorder ? 'input-border' : ''}
          `}
        >
          <div className="field-wrapper">
            <div className="input-content">
              {label && <label>{label}</label>}
              <div className="select-wrapper">
                <Select
                  id="demo-simple-select"
                  value={multiple ? [...field.value] : field.value}
                  multiple={multiple}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  error={fieldState?.error ? true : false}
                  sx={{
                    width: '100%',
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: color.textGray,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: color.navy_blue,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: color.navy_blue,
                    },
                    '.MuiSvgIcon-root ': {
                      // fill: 'white !important',
                    },
                  }}
                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.component ? option.component : option.label}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          {error && <span className="error-span">{error}</span>}
          {fieldState?.error?.message && (
            <span className="error-span">{fieldState?.error?.message}</span>
          )}
        </div>
      )}
    />
  );
};

export default SelectField;
