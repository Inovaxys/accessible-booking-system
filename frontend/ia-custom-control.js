class BookingDateControl {
  constructor(inputElement) {
    this.input = inputElement;
    this.init();
  }

  init() {
    this.input.addEventListener('change', this.validateDate.bind(this));
  }

  validateDate(event) {
    const selectedDate = new Date(event.target.value);
    const today = new Date();

    if (selectedDate < today) {
      alert('Please select a future date');
      this.input.value = '';
    }
  }
}

document.querySelectorAll('.booking-date').forEach(input => {
  new BookingDateControl(input);
});