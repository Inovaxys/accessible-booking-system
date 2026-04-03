console.log("APP JS LOADED");

// 🔔 Toast
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// ⏳ Loader
function showLoader() {
  document.getElementById('loader').classList.remove('hidden');
}

function hideLoader() {
  document.getElementById('loader').classList.add('hidden');
}

// 📦 Load slots
async function loadSlots(search = '') {
  try {
    showLoader();

    const res = await fetch(`http://localhost:3000/slots?search=${search}`);
    const data = await res.json();

    const list = document.getElementById('slots');
    list.innerHTML = '';

    if (data.length === 0) {
      list.innerHTML = '<p class="empty">No slots available</p>';
      return;
    }

    data.forEach(slot => {
      const li = document.createElement('li');

      const start = new Date(slot.start_time).toLocaleString();
      const end = new Date(slot.end_time).toLocaleString();

      li.innerHTML = `
        <span class="time">${start} → ${end}</span>
        <button onclick="bookSlot(${slot.id})">Book</button>
      `;

      list.appendChild(li);
    });

  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    hideLoader();
  }
}

// 📌 Book slot
async function bookSlot(slotId) {
  try {
    showLoader();

    const res = await fetch('http://localhost:3000/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 1, slot_id: slotId })
    });

    const data = await res.json();

    showToast(data.message || "Booking successful");

    loadSlots();

  } catch (err) {
    console.error(err);
  } finally {
    hideLoader();
  }
}

// 🔍 Debounced search
let timeout;

function handleSearch(value) {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    loadSlots(value);
  }, 300);
}

// 🚀 Initial load
loadSlots();