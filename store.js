import items from "./items.json";

const IMG_URL_BIG = "https://dummyimage.com/420x260";
export const IMG_URL_SMALL = "https://dummyimage.com/210x130";

const LOCAL_STORAGE_PREFIX = "SHOPPING_CART";
const CART_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-shopping-cart`;

const cartButton = document.querySelector("#shopping-cart-button");
const fullCart = document.querySelector("[data-full-cart]");
const fullCartLessButton = document.querySelector("[data-cart-almost]");
const template = document.querySelector("#store-item-template");
const cartItemTemplate = document.querySelector("#cart-item-template");
const itemContainer = document.querySelector("[data-item-box]");
const shoppingCartContainer = document.querySelector(
  "[data-shopping-cart-section]"
);
// Retrieving from Local Storage
const storageString = localStorage.getItem(CART_STORAGE_KEY);
// To hold Shopping Cart Items (Color, name, qty, price)
let shoppingCartArray = JSON.parse(storageString) || [];

export function setupStore() {
  refreshCart();

  // Allowing the Cart to Expand / Minimize List
  cartButton.addEventListener("click", () => {
    fullCartLessButton.classList.toggle("invisible");
  });

  // --- For ITEMS ---
  items.forEach((eachItem) => {
    const templateClone = template.content.cloneNode(true);

    // Adding the image source to template
    const image = templateClone.querySelector("img");
    image.src = `${IMG_URL_BIG}/${eachItem.imageColor}/${eachItem.imageColor}`;

    // Amending the Color Category
    const rank = templateClone.querySelector("h3");
    rank.innerText = eachItem.category;

    // Amending the Color Name
    const name = templateClone.querySelector("h2");
    name.innerText = eachItem.name;

    // Amending the Color Price
    const price = templateClone.querySelector("p");
    let formattedPrice = eachItem.priceCents / 100;
    formattedPrice = formattedPrice.toFixed(2);
    price.innerText = `$${formattedPrice}`;

    // Adding Event Listener to Button for "adding to cart"
    const button = templateClone.querySelector("button");
    button.addEventListener("click", () => {
      const tempObj = {
        color: eachItem.imageColor,
        name: eachItem.name,
        quantity: 1,
        price: formattedPrice,
      };

      if (
        !shoppingCartArray.some((eachItem) => {
          return eachItem.name === tempObj.name;
        })
      ) {
        shoppingCartArray.push(tempObj);
      } else {
        const itemFound = shoppingCartArray.find(
          (eachItem) => eachItem.name === tempObj.name
        );
        itemFound.quantity++;
      }
      // Saving changes to Local Storage
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(shoppingCartArray));
      refreshCart();
    });

    // Adding the template clone back into the container
    itemContainer.appendChild(templateClone);
  });
}

export function refreshCart() {
  // Setting the Cart Icon Quantity
  const cartButtonQty = cartButton.querySelector("[data-cart-button-qty]");
  cartButtonQty.innerText = shoppingCartArray.length;

  // Hiding / Showing Icon based on Cart Array
  shoppingCartArray.length > 0
    ? cartButton.classList.remove("invisible")
    : cartButton.classList.add("invisible");

  //   Hiding / Showing Cart List based on Cart Array
  shoppingCartArray.length > 0
    ? fullCart.classList.remove("invisible")
    : fullCart.classList.add("invisible");

  // --- Inner Cart Stuff ---
  shoppingCartContainer.innerHTML = "";
  let finalPrice = 0;

  shoppingCartArray.forEach((eachObj) => {
    const cartItemClone = cartItemTemplate.content.cloneNode(true);

    // Amending Image Color in Cart
    const image = cartItemClone.querySelector("img");
    image.src = `${IMG_URL_SMALL}/${eachObj.color}/${eachObj.color}`;

    // Amending Image Name in Cart
    const colorName = cartItemClone.querySelector("h2");
    colorName.innerText = eachObj.name;

    // Amending Price in Cart
    const colorPrice = cartItemClone.querySelector("[data-cart-price]");
    finalPrice += parseFloat(eachObj.price) * eachObj.quantity;
    colorPrice.innerText = `$${eachObj.price}`;

    // Amending Quantity in Cart
    const colorQuantity = cartItemClone.querySelector("span");
    colorQuantity.innerText = `x${eachObj.quantity}`;

    // Showing / Hiding based on quantity > 1
    eachObj.quantity > 1
      ? colorQuantity.classList.remove("invisible")
      : colorQuantity.classList.add("invisible");

    // Adding the Delete Button
    const deleteButton = cartItemClone.querySelector(
      "[data-remove-from-cart-button]"
    );

    deleteButton.addEventListener("click", () => {
      const found = shoppingCartArray.find((e) => e.name === eachObj.name);
      if (found.quantity > 1) found.quantity--;
      else {
        shoppingCartArray = shoppingCartArray.filter((each) => {
          return each.name !== found.name;
        });
      }
      // Saving changes to Local Storage
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(shoppingCartArray));
      refreshCart();
    });

    // Adding the Template back into the Container
    shoppingCartContainer.appendChild(cartItemClone);
  });

  // Setting the Final Price for the Cart
  const finalPriceElement = document.querySelector("[data-total-price]");
  finalPriceElement.innerText = `$${finalPrice.toFixed(2)}`;
}
