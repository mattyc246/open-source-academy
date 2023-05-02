import type { ButtonHTMLAttributes } from 'react';

import React from 'react';
import styled from 'styled-components';

import { colors, fontSize } from '~/styles';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
}

const CustomButton = styled.button`
  display: ${({ fullWidth }: CustomButtonProps) =>
    fullWidth ? 'block' : 'inline-block'};
  width: ${({ fullWidth }: CustomButtonProps) => (fullWidth ? '100%' : 'auto')};
  background-color: ${colors.secondary};
  border: 0;
  color: ${colors.white};
  font-size: ${fontSize.medium};
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  letter-spacing: 2.5px;
  text-transform: uppercase;
  padding: 0.75rem 1rem;
  transition: background-color 0.2s ease-in;
  cursor: pointer;
  border-radius: 4px;

  :hover {
    background-color: ${colors.secondaryLight};
  }

  :disabled {
    background-color: ${colors.greyMid};
    cursor: not-allowed;
  }
`;

const Button: React.FC<CustomButtonProps> = ({
  children,
  disabled,
  type,
  fullWidth,
  ...rest
}) => {
  return (
    <CustomButton
      type={type ?? 'button'}
      fullWidth={fullWidth}
      disabled={disabled}
      {...rest}
    >
      {children}
    </CustomButton>
  );
};

export default Button;
