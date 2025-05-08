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

let latestGuestCount = 1;
let latestMeal = "Kabab";
let latestSides = [];
let latestTotal = 0;

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
  latestGuestCount = guestCount;

  const mainMeal = document.querySelector('input[name="main"]:checked');
  const mainMealValue = mainMeal.value;
  latestMeal = mainMeal.parentElement.textContent.trim();
  let baseMainPrice = basePrices[mainMealValue];

  let perPersonBase = baseMainPrice + 2; // salad + rice
  const discount = getDiscountPerGuest(guestCount);
  let discountedMainCost = perPersonBase - discount;

  if (guestCount < 10 && discountedMainCost < 14.99) {
    discountedMainCost = 14.99;
  }

  let perPersonCost = discountedMainCost;
  latestSides = [];
  const extras = document.querySelectorAll('.side-options input[type="checkbox"]:checked');
  extras.forEach(extra => {
    latestSides.push(extra.parentElement.textContent.trim());
    perPersonCost += basePrices[extra.value];
  });

  const total = perPersonCost * guestCount;
  latestTotal = total.toFixed(2);
  totalDisplay.textContent = `$${latestTotal}`;
}

function downloadPDF() {
  const doc = new jspdf.jsPDF();
  doc.setFontSize(16);
  doc.text("Ameer's Kitchen Catering Estimate", 20, 20);
  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 30);
  doc.text(`Number of Guests: ${latestGuestCount}`, 20, 40);
  doc.text(`Selected Meal: ${latestMeal}`, 20, 50);
  if (latestSides.length > 0) {
    doc.text("Extras:", 20, 60);
    latestSides.forEach((side, idx) => {
      doc.text(`- ${side}`, 25, 70 + idx * 10);
    });
  }
  const totalY = 70 + (latestSides.length * 10);
  doc.text(`Total Estimated Cost: $${latestTotal}`, 20, totalY + 20);
  doc.save("catering_estimate.pdf");
}

guestSlider.addEventListener("input", calculateTotal);
document.querySelectorAll('input[name="main"]').forEach(el => el.addEventListener("change", calculateTotal));
document.querySelectorAll('.side-options input[type="checkbox"]').forEach(el => el.addEventListener("change", calculateTotal));

document.getElementById("pdf-btn").addEventListener("click", downloadPDF);

calculateTotal();
