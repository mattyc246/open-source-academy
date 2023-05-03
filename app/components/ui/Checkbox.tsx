import type { PropsWithChildren } from 'react';

import React from 'react';
import styled from 'styled-components';

import { colors, fontSize } from '~/styles';

interface CheckboxProps extends PropsWithChildren {
  checked?: boolean;
  name?: string;
  onChange: (value: boolean) => void;
}

const CheckboxWrapper = styled.div`
  margin: 1rem 0;
  display: flex;
  align-items: center;
`;
const CustomCheckbox = styled.div`
  margin-right: 0.5rem;
  border: 2px solid ${colors.black};
  padding: 1.5px;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  transition: all 0.2s ease-in;

  :hover {
    background-color: ${colors.greyMid};
    cursor: pointer;
  }
`;
const CheckMark = styled.div`
  background-color: ${colors.secondary};
  height: 100%;
  width: 100%;
  border-radius: 2px;
`;
const CheckLabel = styled.div`
  font-size: ${fontSize.medium};
  color: ${colors.black};
  flex: 1;
`;

const Checkbox: React.FC<CheckboxProps> = ({
  children,
  name,
  checked,
  onChange
}) => {
  return (
    <CheckboxWrapper>
      <input
        type="checkbox"
        name={name || ''}
        defaultChecked={checked}
        hidden
      />
      <CustomCheckbox onClick={() => onChange(!checked)}>
        {checked && <CheckMark />}
      </CustomCheckbox>
      <CheckLabel>{children}</CheckLabel>
    </CheckboxWrapper>
  );
};

export default Checkbox;
