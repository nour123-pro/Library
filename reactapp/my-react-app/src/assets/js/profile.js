var con=document.getElementById("container");
console.log(con);
let bar = new ProgressBar.SemiCircle(con, {
    strokeWidth: 10,
    color: "black",
    trailColor: "rgba(255,255,255, 0.4)",
    trailWidth: 3,
    
    easing: "easeInOut",
    duration: 1400,
    svgStyle: null,
    text: {
      value: "",
      alignToBottom: false,
      className: "progressbar__label"
    },step: (state, bar) => {
        bar.path.setAttribute("stroke", state.color);
        var value = Math.round(bar.value() * 100);
        if (value === 0) {
          bar.setText("");
        } else {
          bar.setText("<span style='margin-left:30%;color:var(--blue);font-family:var(--dreamfont);font-weight:900;font-size:60px'>"+value+"%</span>"+"<br><span style='font-size: 14px;color:var(--gray2)'>Your have Completed 10 <span style='font-size: 34px;'>📖</span>      </span>");
         
        }

        bar.text.style.color = state.color;
        bar.text.style.fo
      }
    });
    bar.animate(0.1);
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      themeSystem: 'standard',// Use Standard theme (default)
      headerToolbar: {
        left: 'prev,next today',  // This includes the "Today" button
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
      events: [
      { title: 'Meeting', start: '2025-03-30T10:00:00',  backgroundColor: '#ff6347' },
      { title: 'Workout', start: '2025-03-31', end: '2025-04-01', backgroundColor: '#ff6347' }
  ]
    });
    calendar.render();

