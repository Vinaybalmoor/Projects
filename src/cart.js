let label = document.getElementById("label");
let ShoppingCart = document.getElementById("shopping-cart");

let basket = JSON.parse(localStorage.getItem("data")) || [];

let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};
calculation();

let generateCartItems = () => {
  if (basket.length !== 0) {
    return (ShoppingCart.innerHTML = basket
      .map((x) => {
        let { id, item } = x;
        let search = shopItemsData.find((y) => y.id === id) || []; //y.id is coming from database(i.e from user) id is coming from basket
        let { img, name, price } = search;
        return `
      <div class="cart-item">
      <img width="100" src=${img} alt="" />
      <div class="details">
      
      <div class="title-price-x">
        <h4 class="title-price">
        <p>${name}</p>
        <p class="cart-item-price">₹ ${price}</p>
        </h4>
        <i onclick="removeItem(${id})"class="bi bi-x-lg"></i>
      </div>
      
        <div class="buttons">
              <i onclick="decrement(${id})" class="bi bi-dash-circle"></i>
              <div id= ${id} class="quantity">${item}</div>
              <i onclick="increment(${id})"class="bi bi-plus-circle"></i>
            </div>
      
      <h3>$ ${item * search.price}</h3>
      </div>
      </div>
      
      `;
      })
      .join("")); // this join is used to remove ","
  } else {
    ShoppingCart.innerHTML = ``;
    label.innerHTML = `
    <h2>Cart is Empty </h2>
    <a href = "index.html">
    <button class="HomeBtn">Back to home</button>
    </a>`;
  }
};
generateCartItems();
let increment = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) {
    basket.push({
      id: selectedItem.id,
      item: 1,
    });
  } else {
    search.item += 1;
  }
  generateCartItems();
  update(selectedItem.id);
  basket = basket.filter((x) => x.item !== 0);

  // JSON.stringify is used to display the data in the local storage,
  //  local storage set item is used to set the items in the local storage
  localStorage.setItem("data", JSON.stringify(basket));
};
let decrement = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);
  if (search === undefined) return;
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }
  update(selectedItem.id);
  basket = basket.filter((x) => x.item !== 0);

  generateCartItems(); //it rerender our carrt with updated data
  localStorage.setItem("data", JSON.stringify(basket));
};
let update = (id) => {
  let search = basket.find((x) => x.id === id);
  //console.log(search.item);
  document.getElementById(id).innerHTML = search.item;
  calculation();
  TotalAmount();
};
let removeItem = (id) => {
  let selectedItem = id;
  // console.log(selectedItem.id);
  basket = basket.filter((x) => x.id !== selectedItem.id);
  generateCartItems();
  calculation(); // to make cart icon to 0
  TotalAmount();
  localStorage.setItem("data", JSON.stringify(basket));
};
let clearCart = () => {
  basket = [];
  generateCartItems();
  calculation();
  localStorage.setItem("data", JSON.stringify(basket)); // for rerendering the cart
};
let checkout = () => {
  alert("Your order has been placed. Thank you visit again!");
};
let TotalAmount = () => {
  if (basket.length !== 0) {
    let amount = basket
      .map((x) => {
        //this is used to get the price of the particular id
        let { item, id } = x;
        let search = shopItemsData.find((y) => y.id === id) || []; // if id is found retrun to search or return empty array
        return item * search.price; // after that return the product of item and that particular price to amount.
      })
      .reduce((x, y) => x + y, 0); //  reduces an array to a single value
    // x is previous value and y is next value, x+y return the sum, and 0 is the initial value
    label.innerHTML = `
    <h2>Total Bill : ₹ ${amount}</h2>
    <button onclick="checkout()" class="checkout">Checkout</button>
    <button onclick="clearCart()"class="removeAll">Clear Cart</button>
    
    `;
  } else return;
};
TotalAmount();
