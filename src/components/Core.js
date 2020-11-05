import React, { forwardRef } from 'react';

const Box = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className={`wrd-box ${className ? className : ''}`}
    >
      {children}
    </div>
  );
});

const Row = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className={`wrd-row ${className ? className : ''}`}
    >
      {children}
    </div>
  );
});

const Stack = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className={`wrd-stack ${className ? className : ''}`}
    >
      {children}
    </div>
  );
});

export { Box, Row, Stack };
