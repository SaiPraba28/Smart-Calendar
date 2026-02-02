const calendarGrid = document.getElementById('calendarGrid');
const monthYear = document.getElementById('monthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const bgImageInput = document.getElementById('bgImage');
const markDateInput = document.getElementById('markDate');
const markImageInput = document.getElementById('markImage');
const addMarkBtn = document.getElementById('addMark');

let currentDate = new Date();

// Load saved data from localStorage
let monthBackgrounds = JSON.parse(localStorage.getItem('monthBackgrounds') || '{}'); // keyed by month 0-11
let dateMarks = JSON.parse(localStorage.getItem('dateMarks') || '{}'); // keyed by YYYY-MM-DD

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function renderCalendar() {
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const todayDate = new Date();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

  monthYear.innerText = `${months[currentMonth]} ${currentYear}`;

  // Set background for this month (same for all years)
  if (monthBackgrounds[currentMonth] ) {
    document.querySelector('.calendar-container').style.backgroundImage = `url(${monthBackgrounds[currentMonth]})`;
  } else {
    document.querySelector('.calendar-container').style.backgroundImage = '';
  }

  // Clear previous dates
  document.querySelectorAll('.date-cell').forEach(d => d.remove());

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('date-cell');
    emptyCell.style.backgroundColor = 'transparent';
    calendarGrid.appendChild(emptyCell);
  }

  // Add date cells
  for (let i = 1; i <= lastDate; i++) {
    const cell = document.createElement('div');
    cell.classList.add('date-cell');
    const dateStr = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
    cell.dataset.date = dateStr;
    cell.innerText = i;

    // Highlight today
    if (todayDate.getFullYear() === currentYear &&
        todayDate.getMonth() === currentMonth &&
        todayDate.getDate() === i) {
      cell.classList.add('today');
    }

    // Add mark image if exists
    if (dateMarks[dateStr]) {
      const img = document.createElement('img');
      img.src = dateMarks[dateStr];
      img.classList.add('mark');
      cell.appendChild(img);
    }

    calendarGrid.appendChild(cell);
  }
}

// Month navigation
prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// Upload background for current month (applies to all years)
bgImageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const monthIndex = currentDate.getMonth();
    monthBackgrounds[monthIndex] = reader.result;
    localStorage.setItem('monthBackgrounds', JSON.stringify(monthBackgrounds));
    renderCalendar();
  };
  reader.readAsDataURL(file);
});

// Add mark to a date
addMarkBtn.addEventListener('click', () => {
  const file = markImageInput.files[0];
  const markDate = markDateInput.value;
  if (!file || !markDate) {
    alert('Please select both a date and an image!');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    dateMarks[markDate] = reader.result;
    localStorage.setItem('dateMarks', JSON.stringify(dateMarks));
    renderCalendar();
  };
  reader.readAsDataURL(file);
});

// Initial render
renderCalendar();
