let curr = -50;

function handleMove(num) {
  let ourCar = document.getElementById("car");
  ourCar.style.transform = `rotate(${num}deg) translate(${curr + num}%)`;
  curr = curr + num;
}
