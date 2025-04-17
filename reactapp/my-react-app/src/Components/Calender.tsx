import React, { useEffect, useRef } from 'react';
import { BorrowedBook } from './interfaces';

declare global {
  interface Window {
    FullCalendar: any;
  }
}

interface CalenderProps {
  BorrowedBookss: BorrowedBook[]; 
}
const CalendarComponent: React.FC<CalenderProps> = ({BorrowedBookss}) => {
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js';
    script.async = true;
    script.onload = initializeCalendar;
    script.onerror = () => console.error('Failed to load FullCalendar');

    document.body.appendChild(script);
    console.log("BorrowedBookss:", BorrowedBookss);

    function initializeCalendar() {
      if (calendarRef.current && window.FullCalendar) {
        
        const borrowedEvents = BorrowedBookss.map(bb => ({
          title: `📚 ${bb.book.bookName}${bb.book.author?.authorName ? ` (${bb.book.author.authorName})` : ''}`,
          start: bb.dateCreated,
          end: bb.dueDate,
          backgroundColor: '#3B82F6',
          borderColor: '#1D4ED8',
          extendedProps: {
            type: 'borrowed-book',
            bookId: bb.book.bookId
          },
          display: 'background',
          classNames: ['book-event']
        }));
    
       
        const dueDateEvents = BorrowedBookss.map(bb => ({
          title: `⏰ Due: ${bb.book.bookName}`,
          start: bb.dueDate,
          backgroundColor: '#EF4444', 
          textColor: 'white',
          display: 'block',
          extendedProps: {
            type: 'due-date',
            bookId: bb.book.bookId
          },
          _id: bb.book.bookId + '_due'
        }));
    
        
        const allEvents = [...borrowedEvents, ...dueDateEvents];
    
        const calendar = new window.FullCalendar.Calendar(calendarRef.current, {
          initialView: 'dayGridMonth',
          themeSystem: 'standard',
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          },
          events: allEvents
        });
    
        calendar.render();
    
        return () => {
          calendar.destroy();
        };
      }
    }

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="calendar" ref={calendarRef} style={{ width: '100%', height: '800px' }} />;
};

export default CalendarComponent; 