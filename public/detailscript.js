
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

const screenWidth = window.screen.width;
if (screenWidth < 480) {
    deliveryType.classList.remove("flex-row")
    deliverNow.classList.remove("col-4");
    ScheduleNow.classList.remove("col-4");
    
}