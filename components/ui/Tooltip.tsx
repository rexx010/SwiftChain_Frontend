'use client';

/**
 * Tooltip — Accessible hover/focus tooltip component.
 *
 * Renders its children as the trigger and shows `content` in a floating
 * popover on hover or keyboard focus. Uses pure CSS positioning so there
 * are no extra runtime dependencies.
 *
 * Usage:
 *   <Tooltip content="Smart contracts operate strictly in XLM.">
 *     <InfoIcon />
 *   </Tooltip>
 */

import React, { useState, useId } from 'react';

export interface TooltipProps {
  /** The tooltip text or JSX content */
  content: React.ReactNode;
  /** The element that triggers the tooltip */
  children: React.ReactElement;
  /** Preferred placement — defaults to "top" */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Extra classes on the tooltip bubble */
  className?: string;
}

const placementClasses: Record<NonNullable<TooltipProps['placement']>, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function Tooltip({
  content,
  children,
  placement = 'top',
  className = '',
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  // Clone the child so we can inject the aria-describedby and event handlers
  const trigger = React.cloneElement(children, {
    'aria-describedby': tooltipId,
    onMouseEnter: (e: React.MouseEvent) => {
      show();
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hide();
      children.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      show();
      children.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      hide();
      children.props.onBlur?.(e);
    },
  });

  return (
    <span className="relative inline-flex items-center">
      {trigger}

      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          className={[
            'pointer-events-none absolute z-50 w-max max-w-xs',
            'rounded-lg bg-gray-900 px-3 py-2',
            'text-xs font-medium text-white shadow-lg',
            'dark:bg-gray-950 dark:text-gray-100',
            placementClasses[placement],
            className,
          ].join(' ')}
        >
          {content}
        </span>
      )}
    </span>
  );
}
