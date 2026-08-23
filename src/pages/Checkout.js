import React, {
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  ShoppingBag,
  Banknote,
  Utensils,
  MessageSquare,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useCart,
} from "../context/CartContext";

import {
  createOrder,
} from "../api/publicApi";

import "./Checkout.css";


function Checkout() {

  const navigate =
    useNavigate();


  const {
    cartItems,
    totalItems,
    totalAmount,
    clearCart,
  } = useCart();


  // ==========================================
  // FORM STATE
  // ==========================================

  const [customerName, setCustomerName] =
    useState("");

  const [customerPhone, setCustomerPhone] =
    useState("");

  const [tableNumber, setTableNumber] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("cash");

  const [notes, setNotes] =
    useState("");


  // ==========================================
  // REQUEST STATE
  // ==========================================

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();


    if (loading) {
      return;
    }


    setError("");


    // ========================================
    // VALIDATE FORM
    // ========================================

    if (!customerName.trim()) {

      setError(
        "Please enter your name."
      );

      return;
    }


    if (!customerPhone.trim()) {

      setError(
        "Please enter your phone number."
      );

      return;
    }


    if (!tableNumber.trim()) {

      setError(
        "Please enter your table number."
      );

      return;
    }


    if (!cartItems.length) {

      setError(
        "Your cart is empty."
      );

      return;
    }


    try {

      setLoading(true);


      // ======================================
      // SEND ONLY TRUSTED IDENTIFIERS
      // ======================================
      //
      // Do NOT send price from frontend.
      //
      // Backend gets the real menu item
      // and real price from MongoDB.
      // ======================================

      const orderItems =
        cartItems.map(
          (item) => ({
            menuItem:
              item.id,

            quantity:
              Number(
                item.quantity
              ),
          })
        );


      const order =
        await createOrder({

          customerName:
            customerName.trim(),

          customerPhone:
            customerPhone.trim(),

          tableNumber:
            tableNumber.trim(),

          items:
            orderItems,

          paymentMethod,

          notes:
            notes.trim(),

        });


      // ======================================
      // SAVE ORDER TO LOCAL ORDER HISTORY
      // ======================================

      const savedOrders =
        JSON.parse(
          localStorage.getItem(
            "automateCafeOrderIds"
          )
        ) || [];


      // Add newest order to the beginning

      const updatedOrders = [
        order._id,

        ...savedOrders.filter(
          (id) =>
            id !== order._id
        ),
      ];


      // Save all order IDs

      localStorage.setItem(
        "automateCafeOrderIds",
        JSON.stringify(
          updatedOrders
        )
      );


      // Keep latest order separately
      // for quick access if needed.

      localStorage.setItem(
        "automateCafeOrderId",
        order._id
      );


      console.log(
        "Real order created:",
        order
      );


      // ======================================
      // CLEAR CART
      // ======================================

      clearCart();


      // ======================================
      // GO TO REAL ORDER PAGE
      // ======================================

      navigate(
        `/order-success/${order._id}`
      );

    } catch (error) {

      console.error(
        "Order creation failed:",
        error
      );


      setError(
        error.message ||
        "Failed to place order. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // EMPTY CART
  // ==========================================

  if (!cartItems.length) {

    return (

      <main className="checkout-page">

        <div className="checkout-empty">

          <div className="checkout-empty-icon">

            <ShoppingBag
              size={26}
            />

          </div>

          <span>
            YOUR ORDER
          </span>

          <h1>
            Your cart is empty.
          </h1>

          <p>
            Add something from the menu
            before checking out.
          </p>

          <Link
            to="/menu"
            className="checkout-empty-button"
          >

            Browse menu

            <ArrowRight
              size={16}
            />

          </Link>

        </div>

      </main>

    );

  }


  // ==========================================
  // CHECKOUT
  // ==========================================

  return (

    <main className="checkout-page">

      <div className="checkout-container">


        {/* =====================================
            TOP
        ====================================== */}

        <header className="checkout-header">

          <Link
            to="/cart"
            className="checkout-back"
          >

            <ArrowLeft
              size={16}
            />

            Back to cart

          </Link>


          <div className="checkout-heading">

            <span>
              CHECKOUT
            </span>

            <h1>
              Almost there.
            </h1>

            <p>
              Tell us where you’re sitting
              and how you'd like to pay.
            </p>

          </div>

        </header>



        {/* =====================================
            ERROR
        ====================================== */}

        {error && (

          <div className="checkout-error">

            {error}

          </div>

        )}



        <form
          className="checkout-layout"
          onSubmit={
            handleSubmit
          }
        >


          {/* ===================================
              LEFT
          ==================================== */}

          <section className="checkout-form">


            {/* =================================
                CUSTOMER
            ================================== */}

            <div className="checkout-section">

              <div className="checkout-section-heading">

                <div className="checkout-section-icon">

                  <Utensils
                    size={16}
                  />

                </div>

                <div>

                  <span>
                    YOUR DETAILS
                  </span>

                  <h2>
                    Who are we serving?
                  </h2>

                </div>

              </div>


              <div className="checkout-fields">

                <label
                  className="checkout-field"
                >

                  <span>
                    Name
                  </span>

                  <input
                    type="text"
                    value={
                      customerName
                    }
                    onChange={(event) =>
                      setCustomerName(
                        event.target.value
                      )
                    }
                    placeholder="Your name"
                    autoComplete="name"
                    maxLength={100}
                    required
                  />

                </label>


                <label
                  className="checkout-field"
                >

                  <span>
                    Phone number
                  </span>

                  <input
                    type="tel"
                    value={
                      customerPhone
                    }
                    onChange={(event) =>
                      setCustomerPhone(
                        event.target.value
                      )
                    }
                    placeholder="98XXXXXXXX"
                    autoComplete="tel"
                    maxLength={30}
                    required
                  />

                </label>

              </div>

            </div>



            {/* =================================
                TABLE
            ================================== */}

            <div className="checkout-section">

              <div className="checkout-section-heading">

                <div className="checkout-section-icon">

                  <MapPin
                    size={16}
                  />

                </div>

                <div>

                  <span>
                    YOUR TABLE
                  </span>

                  <h2>
                    Where are you sitting?
                  </h2>

                </div>

              </div>


              <label
                className="checkout-field"
              >

                <span>
                  Table number
                </span>

                <input
                  type="text"
                  value={
                    tableNumber
                  }
                  onChange={(event) =>
                    setTableNumber(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Table 7"
                  maxLength={30}
                  required
                />

              </label>


              <p className="checkout-helper">

                Enter the table number shown
                on the table you're sitting at.

              </p>

            </div>



            {/* =================================
                SPECIAL REQUEST / NOTES
            ================================== */}

            <div className="checkout-section">

              <div className="checkout-section-heading">

                <div className="checkout-section-icon">

                  <MessageSquare
                    size={16}
                  />

                </div>

                <div>

                  <span>
                    SPECIAL REQUEST
                  </span>

                  <h2>
                    Anything we should know?
                  </h2>

                </div>

              </div>


              <label
                className="checkout-field checkout-notes-field"
              >

                <span>
                  Notes for the kitchen
                </span>


                <textarea
                  value={
                    notes
                  }
                  onChange={(event) =>
                    setNotes(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Less spicy, no onions, extra sauce..."
                  maxLength={500}
                  rows={4}
                />

              </label>


              <div className="checkout-notes-footer">

                <p className="checkout-helper">

                  Tell us about your taste or
                  any special request.

                </p>


                <span>
                  {notes.length}/500
                </span>

              </div>

            </div>



            {/* =================================
                PAYMENT
            ================================== */}

            <div className="checkout-section">

              <div className="checkout-section-heading">

                <div className="checkout-section-icon">

                  <CreditCard
                    size={16}
                  />

                </div>

                <div>

                  <span>
                    PAYMENT
                  </span>

                  <h2>
                    How would you like to pay?
                  </h2>

                </div>

              </div>


              <div className="payment-options">


                {/* CASH */}

                <label
                  className={
                    paymentMethod ===
                    "cash"
                      ? "payment-option selected"
                      : "payment-option"
                  }
                >

                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={
                      paymentMethod ===
                      "cash"
                    }
                    onChange={() =>
                      setPaymentMethod(
                        "cash"
                      )
                    }
                  />


                  <div className="payment-option-icon">

                    <Banknote
                      size={18}
                    />

                  </div>


                  <div className="payment-option-content">

                    <strong>
                      Cash
                    </strong>

                    <span>
                      Pay at the cafe
                    </span>

                  </div>


                  <span className="payment-check">

                    {paymentMethod ===
                      "cash" && (

                      <Check
                        size={13}
                      />

                    )}

                  </span>

                </label>



                {/* ONLINE */}

                <label
                  className={
                    paymentMethod ===
                    "online"
                      ? "payment-option selected"
                      : "payment-option"
                  }
                >

                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={
                      paymentMethod ===
                      "online"
                    }
                    onChange={() =>
                      setPaymentMethod(
                        "online"
                      )
                    }
                  />


                  <div className="payment-option-icon">

                    <CreditCard
                      size={18}
                    />

                  </div>


                  <div className="payment-option-content">

                    <strong>
                      Online payment
                    </strong>

                    <span>
                      Pay digitally
                    </span>

                  </div>


                  <span className="payment-check">

                    {paymentMethod ===
                      "online" && (

                      <Check
                        size={13}
                      />

                    )}

                  </span>

                </label>

              </div>

            </div>

          </section>



          {/* ===================================
              SUMMARY
          ==================================== */}

          <aside className="checkout-summary">


            <div className="checkout-summary-top">

              <div>

                <span>
                  YOUR ORDER
                </span>

                <h2>
                  Order summary
                </h2>

              </div>


              <div className="checkout-summary-count">

                <ShoppingBag
                  size={14}
                />

                {totalItems}

              </div>

            </div>



            <div className="checkout-summary-items">

              {cartItems.map(
                (item) => {

                  const quantity =
                    Number(
                      item.quantity
                    ) || 0;

                  const price =
                    Number(
                      item.price
                    ) || 0;

                  const subtotal =
                    quantity * price;


                  return (

                    <div
                      className="checkout-summary-item"
                      key={item.id}
                    >

                      <div>

                        <strong>
                          {item.name}
                        </strong>

                        <span>

                          {quantity}
                          {" × Rs. "}
                          {price.toLocaleString()}

                        </span>

                      </div>


                      <strong>

                        Rs.{" "}
                        {subtotal.toLocaleString()}

                      </strong>

                    </div>

                  );

                }
              )}

            </div>



            <div className="checkout-summary-divider" />



            <div className="checkout-summary-row">

              <span>
                Subtotal
              </span>

              <strong>

                Rs.{" "}

                {Number(
                  totalAmount || 0
                ).toLocaleString()}

              </strong>

            </div>


            <div className="checkout-summary-row muted">

              <span>
                Service
              </span>

              <span>
                —
              </span>

            </div>



            <div className="checkout-summary-total">

              <div>

                <span>
                  TOTAL
                </span>

                <strong>

                  Rs.{" "}

                  {Number(
                    totalAmount || 0
                  ).toLocaleString()}

                </strong>

              </div>

            </div>



            <button
              type="submit"
              className="place-order-button"
              disabled={loading}
            >

              <span>

                {loading
                  ? "Placing order..."
                  : "Place order"}

              </span>

              <ArrowRight
                size={17}
              />

            </button>


            <p className="checkout-secure-note">

              Your order will be sent directly
              to the cafe.

            </p>

          </aside>

        </form>

      </div>

    </main>

  );

}


export default Checkout;