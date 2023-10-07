'use client';

import styles from './big-calendar.module.scss';

import { useState } from 'react'
import { formatDate } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
// import { INITIAL_EVENTS, createEventId } from './event-utils'

import Absence from 'app/absence/page';

/* eslint-disable-next-line */
export interface BigCalendarProps {
  absences: Absence[],
}

export function BigCalendar({
  absences,
}: BigCalendarProps) {
    const [weekendsVisible, setWeekendsVisible] = useState(true)
    const [currentEvents, setCurrentEvents] = useState([])

//   state = {
//     weekendsVisible: true,
//     currentEvents: []
//   }

    const handleWeekendsToggle = () => {
        setWeekendsVisible(!weekendsVisible)
    }

    const renderSidebar = () => {
        return (
          <div className='demo-app-sidebar'>
            <div className='demo-app-sidebar-section'>
              <h2>Instructions</h2>
              <ul>
                <li>Select dates and you will be prompted to create a new event</li>
                <li>Drag, drop, and resize events</li>
                <li>Click an event to delete it</li>
              </ul>
            </div>
            <div className='demo-app-sidebar-section'>
              <label>
                <input
                  type='checkbox'
                  checked={weekendsVisible}
                  onChange={handleWeekendsToggle}
                ></input>
                toggle weekends
              </label>
            </div>
            <div className='demo-app-sidebar-section'>
              <h2>All Events ({currentEvents.length})</h2>
              <ul>
                {currentEvents.map(renderSidebarEvent)}
              </ul>
            </div>
          </div>
        )
      }

    const handleDateSelect = (selectInfo) => {
        const title = prompt('Please enter a new title for your event')
        const calendarApi = selectInfo.view.calendar
    
        calendarApi.unselect() // clear date selection
    
        if (title) {
          calendarApi.addEvent({        
            // id: createEventId(),
            title,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay
          })
        }
    }

    const handleEventClick = (clickInfo) => {
        if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
            clickInfo.event.remove()
        }
    }

    const handleEvents = (events) => {
        setCurrentEvents(events)
    }    

    return (
      <div className={styles['container']}>
        {renderSidebar()}
        <div className='demo-app-main'>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView='dayGridMonth'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={weekendsVisible}
            // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            select={handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={handleEventClick}
            eventsSet={handleEvents} // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
          />
        </div>
      </div>
    )
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
      <i>{event.title}</i>
    </li>
  )
}

export default BigCalendar;