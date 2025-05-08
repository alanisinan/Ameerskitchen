const basePrices = {
  kabab: 7.99,
  chicken: 7.99,
  steak: 7.99,
  mix: 9.99,
  baklava: 2,
  beverages: 2
};

const guestSlider = document.getElementById("guests");
const guestCountDisplay = document.getElementById("guest-count");
const totalDisplay = document.getElementById("total");

function getDiscountPerGuest(guests) {
  if (guests >= 100) return 2.0;
  if (guests >= 50) return 1.5;
  if (guests >= 25) return 1.0;
  if (guests >= 10) return 0.5;
  return 0;
}

function calculateTotal() {
  const guestCount = parseInt(guestSlider.value);
  guestCountDisplay.textContent = guestCount;

  const mainMeal = document.querySelector('input[name="main"]:checked').value;
  let baseMainPrice = basePrices[mainMeal];

  let perPersonBase = baseMainPrice + 2; // $2 for salad and rice
  const discount = getDiscountPerGuest(guestCount);
  let discountedMainCost = perPersonBase - discount;

  if (guestCount < 10 && discountedMainCost < 14.99) {
    discountedMainCost = 14.99;
  }

  // Add extras cost on top of main + base
  let perPersonCost = discountedMainCost;
  const extras = document.querySelectorAll('.side-options input[type="checkbox"]:checked');
  extras.forEach(extra => {
    perPersonCost += basePrices[extra.value];
  });

  const total = perPersonCost * guestCount;
  totalDisplay.textContent = `$${total.toFixed(2)}`;
}

guestSlider.addEventListener("input", calculateTotal);
document.querySelectorAll('input[name="main"]').forEach(el => el.addEventListener("change", calculateTotal));
document.querySelectorAll('.side-options input[type="checkbox"]').forEach(el => el.addEventListener("change", calculateTotal));

document.getElementById("screenshot-btn").addEventListener("click", function() {
  html2canvas(document.querySelector(".container")).then(canvas => {
    const link = document.createElement("a");
    link.download = "catering_estimate.png";
    link.href = canvas.toDataURL();
    link.click();
  });
});

calculateTotal();
