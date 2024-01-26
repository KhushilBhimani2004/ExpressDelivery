
// const couponBtn = document.getElementById('couponBtn');
couponBtn.addEventListener('click',()=>{
  input.innerHTML = `<input type="text" class="rounded-1 form-control w-25 ms-5">`;
});

ScheduleNow.addEventListener('click',()=>{
    let dateTime = document.querySelectorAll('.dateTime');
    dateTime.forEach(function(element) {
        element.style.display = element.style.display === 'block' ? 'none' : 'block';
    });
});

deliverNow.addEventListener('click',()=>{
    let dateTime = document.querySelectorAll('.dateTime');
    dateTime.forEach(function(element) {
        element.style.display = element.style.display === 'block' ? 'none' : 'none';
    });
})