'use client';

import React, { useState, useRef, useEffect } from 'react';

interface MedicalTooltipProps {
  term: string;
  definition: string;
  children: React.ReactNode;
}

export default function MedicalTooltip({
  term,
  definition,
  children,
}: MedicalTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
    }
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  return (
    <>
      <span
        ref={triggerRef}
        className='medical-term'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ cursor: 'help' }}
      >
        {children}
      </span>

      {isVisible && (
        <div
          ref={tooltipRef}
          className='medical-tooltip'
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translateX(-50%) translateY(-100%)',
            zIndex: 1000,
          }}
        >
          <div className='tooltip-content'>
            <div className='tooltip-header'>
              <strong>{term}</strong>
            </div>
            <div className='tooltip-body'>{definition}</div>
            <div className='tooltip-arrow'></div>
          </div>
        </div>
      )}
    </>
  );
}
