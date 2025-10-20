'use client';

import React, { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  value: string; // ISO date string (YYYY-MM-DD)
  onChange: (date: string) => void;
  placeholder?: string;
  showTodayBadge?: boolean;
  maxDate?: string; // Maximum selectable date (YYYY-MM-DD)
  minDate?: string; // Minimum selectable date (YYYY-MM-DD)
}

export default function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  showTodayBadge = false,
  maxDate = new Date().toISOString().split('T')[0], // Default to today
  minDate = '2020-01-01',
}: DatePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCalendar]);

  const formatDisplayDate = (dateString: string): string => {
    const date = new Date(dateString);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dateFormatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return `${dayOfWeek}, ${dateFormatted}`;
  };

  const handleDateSelect = (dateString: string) => {
    onChange(dateString);
    setShowCalendar(false);
  };

  const getDisplayText = () => {
    if (value) {
      return formatDisplayDate(value);
    }
    return placeholder;
  };

  const isPlaceholder = !value;
  const isToday = value === new Date().toISOString().split('T')[0];

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateSelectable = (date: Date): boolean => {
    const dateString = date.toISOString().split('T')[0];
    return dateString >= minDate && dateString <= maxDate;
  };

  const isDateSelected = (date: Date): boolean => {
    return value === date.toISOString().split('T')[0];
  };

  const isTodayDate = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className='date-picker-container'>
      <button
        className='date-picker-button'
        onClick={() => setShowCalendar(!showCalendar)}
        type='button'
      >
        <svg
          className='calendar-icon'
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <rect x='3' y='4' width='18' height='18' rx='2' ry='2'></rect>
          <line x1='16' y1='2' x2='16' y2='6'></line>
          <line x1='8' y1='2' x2='8' y2='6'></line>
          <line x1='3' y1='10' x2='21' y2='10'></line>
        </svg>
        <span className={`date-text ${isPlaceholder ? 'placeholder' : ''}`}>
          {getDisplayText()}
        </span>
        {showTodayBadge && isToday && (
          <span className='today-badge'>Today</span>
        )}
      </button>

      {showCalendar && (
        <div ref={calendarRef} className='calendar-container'>
          <div className='calendar-header'>
            <button
              className='calendar-nav-button'
              onClick={goToPreviousMonth}
              type='button'
            >
              ‹
            </button>
            <h3 className='calendar-title'>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              className='calendar-nav-button'
              onClick={goToNextMonth}
              type='button'
            >
              ›
            </button>
          </div>

          <div className='calendar-grid'>
            {/* Day headers */}
            {dayNames.map(day => (
              <div key={day} className='calendar-day-header'>
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {generateCalendarDays().map((date, index) => {
              if (!date) {
                return <div key={index} className='calendar-day empty'></div>;
              }

              const dateString = date.toISOString().split('T')[0];
              const selectable = isDateSelectable(date);
              const selected = isDateSelected(date);
              const today = isTodayDate(date);

              return (
                <button
                  key={index}
                  className={`calendar-day ${selected ? 'selected' : ''} ${today ? 'today' : ''} ${!selectable ? 'disabled' : ''}`}
                  onClick={() => selectable && handleDateSelect(dateString)}
                  disabled={!selectable}
                  type='button'
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
