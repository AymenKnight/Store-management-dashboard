import './style/index.scss';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {
  Control,
  Controller,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';
import { useMemo } from 'react';
import color from '@assets/styles/color';
import { alpha, styled } from '@mui/material/styles';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface AutocompleteSearchProps<T extends FieldValues = FieldValues> {
  options: {
    value: string;
    label: string;
    component?: React.ReactNode;
  }[];
  inputProps?: React.ClassAttributes<HTMLInputElement> &
    React.InputHTMLAttributes<HTMLInputElement>;
  controllerProps: {
    name: string;
    rules?:
      | Omit<
          RegisterOptions<FieldValues, string>,
          'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
        >
      | undefined;
    defaultValue?: any;
    shouldUnregister?: boolean;
    control?: Control<any>;
  };
  error?: string;
  inputBorder?: boolean;
  label?: string;
  // handleOnChange: (event: any, newValue: CoursesSelect[]) => void;
}

type ValueFunction = (
  fieldValue: string[],
) =>
  | { value: string; label: string; component?: React.ReactNode }[]
  | undefined;

export default function AutocompleteSearch({
  options,
  controllerProps,
  inputProps,
  inputBorder,
  error,
  label,
}: AutocompleteSearchProps) {
  const valueFn: ValueFunction = useMemo(() => {
    return (fieldValue) => {
      return options?.filter((option) => fieldValue.includes(option.value));
    };
  }, [options]);

  return (
    <Controller
      {...controllerProps}
      render={({ field, fieldState }) => (
        <Autocomplete
          className={`auto-field   ${
            fieldState?.error?.message || error ? 'error' : ''
          } ${inputProps?.disabled ? 'disabled' : ''} 
        ${inputBorder ? 'input-border' : ''}
        `}
          multiple
          id="checkboxes-tags-demo"
          options={options}
          disableCloseOnSelect
          sx={{
            width: '100%',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: color.textGray,
            },
            '.MuiOutlinedInput-root': {
              padding: '5px',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: color.navy_blue,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: color.navy_blue,
            },
            '.MuiAutocomplete-inputFocused': {
              borderColor: color.navy_blue,
            },
          }}
          onChange={(_, value) => {
            field.onChange(value?.map((option) => option.value));
          }}
          value={valueFn(field.value)}
          isOptionEqualToValue={(
            option: {
              value: string;
              label: string;
              component?: React.ReactNode;
            },
            value: {
              value: string;
              label: string;
              component?: React.ReactNode;
            },
          ) => option.value === value.value}
          renderOption={(props, option, { selected, index }) =>
            option.component ? (
              <li {...props} key={index}>
                {option.component}
              </li>
            ) : (
              <li {...props} key={index}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  sx={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.component ? option.component : option.label}
              </li>
            )
          }
          renderInput={(params) => (
            <>
              <div className="field-wrapper">
                <div className="input-content">
                  {label && <label>{label}</label>}
                  <CssTextField
                    {...params}
                    error={fieldState?.error ? true : false}
                  />
                </div>
              </div>
              {error && <span className="error-span">{error}</span>}
              {fieldState?.error?.message && (
                <span className="error-span">{fieldState?.error?.message}</span>
              )}
            </>
          )}
        />
      )}
    ></Controller>
  );
}
const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: color.navy_blue,
  },
  // '& .MuiInput-underline:after': {
  //   borderBottomColor: '#B2BAC2',
  // },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: color.textGray,
    },
    '&:hover fieldset': {
      borderColor: color.navy_blue,
    },
    '&.Mui-focused fieldset': {
      borderColor: color.navy_blue,
    },
    '&.Mui-error fieldset': {
      borderColor: color.hot_red,
    },
  },
});
