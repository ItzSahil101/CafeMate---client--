import React from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Utensils,
} from "lucide-react";

import {
  useCart,
} from "../context/CartContext";

import "./Cart.css";


function Cart() {

  const navigate =
    useNavigate();


  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalItems,
    totalAmount,
  } = useCart();


  // ==========================================
  // EMPTY CART
  // ==========================================

  if (!cartItems.length) {

    return (

      <main className="cart-page">

        <div className="cart-container">

          <Link
            to="/menu"
            className="cart-back-link"
          >
            <ArrowLeft size={16} />
            Back to menu
          </Link>


          <div className="cart-empty">

            <div className="cart-empty-icon">
              <ShoppingBag size={27} />
            </div>


            <span className="cart-empty-eyebrow">
              YOUR CART
            </span>


            <h1>
              Nothing here yet.
            </h1>


            <p>
              Pick something delicious
              from our menu and it will
              appear here.
            </p>


            <Link
              to="/menu"
              className="cart-primary-button"
            >

              Browse menu

              <ArrowRight
                size={16}
              />

            </Link>

          </div>

        </div>

      </main>

    );

  }


  return (

    <main className="cart-page">

      <div className="cart-container">


        {/* =====================================
            HEADER
        ====================================== */}

        <div className="cart-header">

          <div>

            <Link
              to="/menu"
              className="cart-back-link"
            >
              <ArrowLeft size={16} />
              Back to menu
            </Link>


            <p className="cart-eyebrow">
              YOUR ORDER
            </p>


            <h1>
              Your cart
            </h1>


            <p className="cart-description">

              {totalItems}{" "}

              {totalItems === 1
                ? "item"
                : "items"}{" "}

              ready to order.

            </p>

          </div>


          <div className="cart-header-count">

            <ShoppingBag
              size={16}
            />

            {totalItems}

          </div>

        </div>



        {/* =====================================
            CONTENT
        ====================================== */}

        <div className="cart-layout">


          {/* ===================================
              ITEMS
          ==================================== */}

          <section className="cart-items">

            {cartItems.map(
              (item) => {

                const price =
                  Number(
                    item.price
                  ) || 0;

                const quantity =
                  Number(
                    item.quantity
                  ) || 0;

                const itemTotal =
                  price * quantity;


                return (

                  <article
                    className="cart-item"
                    key={item.id}
                  >


                    <div className="cart-item-info">

                      <div className="cart-item-icon">
                        <Utensils
                          size={17}
                        />
                      </div>


                      <div>

                        <p className="cart-item-category">
                          {item.categoryName ||
                            "Menu item"}
                        </p>


                        <h2>
                          {item.name}
                        </h2>


                        {item.description && (

                          <p className="cart-item-description">
                            {item.description}
                          </p>

                        )}

                      </div>

                    </div>



                    <div className="cart-item-right">


                      <strong className="cart-item-price">

                        Rs.{" "}

                        {itemTotal.toLocaleString()}

                      </strong>



                      <div className="cart-item-controls">

                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(
                              item.id
                            )
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>


                        <span>
                          {quantity}
                        </span>


                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(
                              item.id
                            )
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>

                      </div>



                      <button
                        type="button"
                        className="cart-remove-button"
                        onClick={() =>
                          removeFromCart(
                            item.id
                          )
                        }
                      >

                        <Trash2
                          size={13}
                        />

                        Remove

                      </button>


                    </div>

                  </article>

                );

              }
            )}

          </section>



          {/* ===================================
              SUMMARY
          ==================================== */}

          <aside className="cart-summary">


            <div className="cart-summary-header">

              <div>

                <span>
                  ORDER SUMMARY
                </span>

                <h2>
                  Your order
                </h2>

              </div>


              <strong>
                {totalItems}{" "}
                {totalItems === 1
                  ? "item"
                  : "items"}
              </strong>

            </div>



            <div className="cart-summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                Rs.{" "}
                {Number(
                  totalAmount
                ).toLocaleString()}
              </strong>

            </div>



            <div className="cart-summary-row">

              <span>
                Service
              </span>

              <span>
                —
              </span>

            </div>



            <div className="cart-summary-divider" />



            <div className="cart-summary-total">

              <span>
                Total
              </span>

              <strong>
                Rs.{" "}
                {Number(
                  totalAmount
                ).toLocaleString()}
              </strong>

            </div>



            <button
              type="button"
              className="cart-checkout-button"
              onClick={() =>
                navigate(
                  "/checkout"
                )
              }
            >

              Continue to checkout

              <ArrowRight
                size={16}
              />

            </button>



            <Link
              to="/menu"
              className="cart-continue-link"
            >
              ← Continue browsing
            </Link>


          </aside>


        </div>

      </div>

    </main>

  );

}


export default Cart;