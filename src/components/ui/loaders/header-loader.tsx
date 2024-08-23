import React from 'react';

interface IProps {
  type?: 'left' | 'right';
}

export function HeaderLoader(props: IProps) {
  const { type = 'left' } = props;
  return <div className={`app_loader_${type}`}></div>;
}
