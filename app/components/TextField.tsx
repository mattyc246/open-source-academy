import type { PropsWithChildren } from 'react';

import React from 'react';
import styled from 'styled-components';

import { colors, fontSize } from '~/styles';

interface TextFieldProps extends PropsWithChildren {
  label?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  name?: string;
  defaultValue?: string;
  error?: string;
}

const FieldWrapper = styled.div`
  margin: 0.75rem 0;
`;
const Label = styled.div`
  color: ${colors.black};
  margin-bottom: 0.25rem;
  font-weight: 500;
  font-size: ${fontSize.medium};
  margin-left: 0.25rem;
`;
const Input = styled.input`
  width: 100%;
  display: block;
  padding: 1rem 0.75rem;
  outline: none;
  border: 2px solid ${colors.greyMid};
  border-radius: 8px;
  font-size: ${fontSize.regular};
  color: ${colors.black};

  :focus {
    border: 2px solid ${colors.secondaryLight};
  }
`;
const Error = styled.small`
  display: block;
  color: ${colors.error};
  margin: 0.25rem 0;
  margin-left: 0.25rem;
  font-size: ${fontSize.small};
`;

const TextField: React.FC<TextFieldProps> = ({
  label,
  name,
  placeholder,
  defaultValue,
  error,
  type
}) => {
  return (
    <FieldWrapper>
      {label && <Label>{label}</Label>}
      <Input
        placeholder={placeholder ?? ''}
        name={name}
        defaultValue={defaultValue}
        type={type ?? 'text'}
      />
      {error && <Error>{error}</Error>}
    </FieldWrapper>
  );
};

export default TextField;
