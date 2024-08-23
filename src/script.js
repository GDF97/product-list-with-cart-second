const menu_items = document.querySelector(".menu-items");
const cart_items = document.querySelector(".cart-items");
const cart_empty = document.querySelector(".cart-empty");
const final_price_display = document.querySelector("#final_price");
const order_confirmed = document.querySelector(".order-confirmed");
const order_stats = document.querySelector(".order-stats");
const btn_new = document.getElementById("btn_new");
const btn_confirmed = document.getElementById("btn_confirmed");
const your_cart = document.getElementById("your-cart");

let dessertArray = [];
let selectedDesserts = [];

function selectDessert(dessertIndex, div) {
  console.log(div);
  if (dessertIndex == undefined) {
    alert("Tente novamente mais tarde!");
    return;
  }
  const newDessert = {
    id: dessertArray[dessertIndex].id,
    name: dessertArray[dessertIndex].name,
    price: dessertArray[dessertIndex].price,
    img: dessertArray[dessertIndex].image.thumbnail,
    quantity: 1,
  };

  insertDessertOnArray(newDessert);
  createButtonQuantity(Number(dessertIndex) + 1, div);
}

function deleteSelectedDessert(idItem) {
  const itemIndex = findItemOnSelectedItems(idItem);
  selectedDesserts.splice(itemIndex, 1);
  const getQtD = document.querySelector(`#quantityDisplay${idItem}`);
  const fodase = getQtD.closest(".btn-quantity");
  fodase.remove();
  createButtonAddToCart(Number(idItem) - 1);

  updateCartItems();
}

function insertDessertOnArray(newDessert) {
  let alreadySelected = false;
  if (selectedDesserts.length == 0) {
    selectedDesserts.push(newDessert);
    updateCartItems();
    return;
  }

  selectedDesserts.forEach((dessert) => {
    if (dessert.id == newDessert.id) {
      alreadySelected = true;
      return;
    }
  });

  if (alreadySelected) {
    return;
  } else {
    selectedDesserts.push(newDessert);
  }

  console.log(selectedDesserts.length);

  updateCartItems();
}

function findItemOnSelectedItems(idItem) {
  let newIdItem = 0;
  for (let i = 0; i < selectedDesserts.length; i++) {
    if (selectedDesserts[i].id == idItem) {
      break;
    } else {
      newIdItem++;
    }
  }
  return newIdItem;
}

function plusItem(idItem) {
  console.log(idItem);
  const itemIndex = findItemOnSelectedItems(idItem);
  selectedDesserts[itemIndex].quantity += 1;
  updateCartItems();
}

function minusItem(idItem) {
  const itemIndex = findItemOnSelectedItems(idItem);
  if (selectedDesserts[itemIndex].quantity == 1) {
    selectedDesserts.splice(itemIndex, 1);
  } else {
    selectedDesserts[itemIndex].quantity -= 1;
  }
  updateCartItems();
}

function updateCartItems() {
  if (selectedDesserts.length == 0) {
    switchCartStatus();
    return;
  }
  cart_items.innerHTML = "";
  selectedDesserts.forEach((dessert) => {
    createItemSelectedOnCart(
      dessert.id,
      dessert.name,
      dessert.price,
      dessert.quantity
    );
  });
  updatePrice();
  your_cart.textContent = `Your Cart (${selectedDesserts.length})`;
}

function updatePrice() {
  let totalPrice = 0;
  selectedDesserts.forEach((dessert) => {
    totalPrice += dessert.price * dessert.quantity;
  });
  final_price_display.textContent = `$${totalPrice.toFixed(2)}`;
}

function switchCartStatus() {
  if (selectedDesserts.length == 0) {
    if (cart_empty.classList.contains("active")) {
      return;
    } else {
      cart_empty.classList.add("active");
      cart_items.classList.remove("active");
    }
  } else {
    if (!cart_items.classList.contains("active")) {
      cart_empty.classList.remove("active");
      cart_items.classList.add("active");
    } else {
      return;
    }
  }
}

function createItemSelectedOnCart(id, name, price, quantity) {
  const item_wrapper = document.createElement("div");
  item_wrapper.classList.add("item-wrapper");

  const item_div = document.createElement("div");
  item_div.classList.add("item");

  const item_name = document.createElement("p");
  item_name.classList.add("item-name");
  item_name.textContent = name;

  const item_price_wrapper = document.createElement("div");
  item_price_wrapper.classList.add("item-price-wrapper");

  const item_quantity = document.createElement("strong");
  item_quantity.classList.add("item-quantity");
  item_quantity.textContent = quantity;

  const item_original_price = document.createElement("p");
  item_original_price.classList.add("item-original-price");
  item_original_price.textContent = `@${price.toFixed(2)}`;

  const item_changed_price = document.createElement("p");
  item_changed_price.classList.add("item-changed-price");
  item_changed_price.textContent = `$${(price * quantity).toFixed(2)}`;

  const cancelButton = document.createElement("button");
  cancelButton.value = id;
  cancelButton.addEventListener("click", (e) => {
    deleteSelectedDessert(e.target.value, e.target);
  });
  const imgButton = document.createElement("img");
  imgButton.src = "./assets/images/icon-remove-item.svg";
  imgButton.style.pointerEvents = "none";
  cancelButton.append(imgButton);

  item_div.append(item_name);
  item_div.append(item_price_wrapper);

  item_price_wrapper.append(item_quantity);
  item_price_wrapper.append(item_original_price);
  item_price_wrapper.append(item_changed_price);

  item_wrapper.append(item_div);
  item_wrapper.append(cancelButton);

  cart_items.append(item_wrapper);

  switchCartStatus();
}

function createButtonAddToCart(index) {
  let teste = `dessert${index + 1}`;
  const divOfDessertSelected = document.querySelector(
    `#${teste} > .dessert-top`
  );

  const button = document.createElement("button");
  button.classList.add("btn-add-cart");
  const icon = document.createElement("img");
  icon.src = "./assets/images/icon-add-to-cart.svg";
  button.textContent = "Add to Cart";
  button.append(icon);
  button.value = index;

  divOfDessertSelected.append(button);

  button.addEventListener("click", (e) => {
    let target = e.target;
    console.log(target);
    selectDessert(target.value, target);
  });
}

function createButtonQuantity(idItem, element) {
  const divOfDessertSelected = element.closest(".dessert");
  const divId = divOfDessertSelected.id;
  const button = document.querySelector(`#${divId} > .dessert-top > button`);
  button.remove();

  const dessertTop = document.querySelector(`#${divId} > .dessert-top`);
  const newButtonWrapper = document.createElement("div");
  newButtonWrapper.classList.add("btn-quantity");

  const btnPlus = document.createElement("button");
  btnPlus.value = idItem;
  btnPlus.addEventListener("click", (e) => {
    plusItem(e.target.value);
    const getQtD = document.querySelector(`#quantityDisplay${idItem}`);
    getQtD.value += 1;
    getQtD.textContent = getQtD.value;
  });
  btnPlus.innerHTML =
    '<img src="./assets/images/icon-increment-quantity.svg" alt="" />';

  const btnMinus = document.createElement("button");
  btnMinus.value = idItem;
  btnMinus.addEventListener("click", (e) => {
    minusItem(e.target.value);
    const getQtD = document.querySelector(`#quantityDisplay${idItem}`);
    getQtD.value -= 1;
    if (getQtD.value <= 0) {
      const fodase = getQtD.closest(".btn-quantity");
      fodase.remove();
      createButtonAddToCart(Number(btnMinus.value) - 1);
    } else {
      getQtD.textContent = getQtD.value;
    }
  });
  btnMinus.innerHTML =
    '<img src="./assets//images/icon-decrement-quantity.svg" alt="" />';

  const quantityDisplay = document.createElement("p");
  quantityDisplay.textContent = 1;
  quantityDisplay.value = 1;
  quantityDisplay.id = `quantityDisplay${idItem}`;

  newButtonWrapper.append(btnMinus);
  newButtonWrapper.append(quantityDisplay);
  newButtonWrapper.append(btnPlus);
  dessertTop.append(newButtonWrapper);
}

function createDessert(id, img, name, category, price, index) {
  const dessert = document.createElement("div");
  dessert.classList.add("dessert");
  dessert.id = `dessert${id}`;

  const dessert_top = document.createElement("div");
  dessert_top.classList.add("dessert-top");

  const image = document.createElement("img");
  image.classList.add("dessert-image");
  image.src = img;

  const button = document.createElement("button");
  button.classList.add("btn-add-cart");
  const icon = document.createElement("img");
  icon.src = "./assets/images/icon-add-to-cart.svg";
  button.textContent = "Add to Cart";
  button.append(icon);
  button.value = index;
  button.addEventListener("click", (e) => {
    selectDessert(e.target.value, e.target);
  });

  dessert_top.append(image);
  dessert_top.append(button);

  dessert.append(dessert_top);

  const dessert_bottom = document.createElement("div");
  dessert_bottom.classList.add("dessert-bottom");

  const dessert_category = document.createElement("p");
  dessert_category.textContent = category;

  const dessert_name = document.createElement("p");
  dessert_name.textContent = name;

  const dessert_price = document.createElement("strong");
  dessert_price.textContent = `$${price.toFixed(2)}`;

  dessert_bottom.append(dessert_category);
  dessert_bottom.append(dessert_name);
  dessert_bottom.append(dessert_price);

  dessert.append(dessert_bottom);

  menu_items.appendChild(dessert);
}

function createItemsInOrderStats(img, name, price, quantity) {
  const item = document.createElement("div");
  item.classList.add("item");
  order_stats.append(item);

  const item_inside = document.createElement("div");
  item.append(item_inside);

  const image = document.createElement("img");
  image.src = `${img}`;
  item_inside.append(image);

  const div2 = document.createElement("div");
  item_inside.append(div2);

  const item_name = document.createElement("p");
  item_name.textContent = name;
  div2.append(item_name);

  const span = document.createElement("span");
  div2.append(span);

  const item_quantity = document.createElement("strong");
  item_quantity.textContent = quantity;
  span.append(item_quantity);

  const item_original_price = document.createElement("p");
  item_original_price.textContent = `@$${price.toFixed(2)}`;
  span.append(item_original_price);

  const item_changed_price = document.createElement("b");
  item_changed_price.textContent = `$${(price * quantity).toFixed(2)}`;

  item.append(item_changed_price);
}

function confirmOrder() {
  selectedDesserts.forEach((element) => {
    createItemsInOrderStats(
      element.img,
      element.name,
      element.price,
      element.quantity
    );
  });

  let totalPrice = 0;
  selectedDesserts.forEach((dessert) => {
    totalPrice += dessert.price * dessert.quantity;
  });
  const order_resume = document.createElement("div");
  order_resume.classList.add("order-resume");

  const p = document.createElement("p");
  p.textContent = "Order Total";
  order_resume.append(p);

  const final_price = document.createElement("h1");
  final_price.id = "final_price_order";
  final_price.textContent = `$${totalPrice.toFixed(2)}`;
  order_resume.append(final_price);

  order_stats.append(order_resume);
  order_confirmed.classList.add("active");
}

function startNewOrder() {
  location.href = "./index.html";
}

function loadItems() {
  let index = 0;
  fetch("src/data.json")
    .then((response) => response.json())
    .then((json) => {
      dessertArray = json;
      json.forEach((element) => {
        createDessert(
          element.id,
          element.image.desktop,
          element.name,
          element.category,
          element.price,
          index
        );
        index++;
      });
    });
}

loadItems();

btn_new.addEventListener("click", startNewOrder);
btn_confirmed.addEventListener("click", confirmOrder);
