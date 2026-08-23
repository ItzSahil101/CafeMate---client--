import React, {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Check,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useCart,
} from "../context/CartContext";

import {
  getMenu,
} from "../api/publicApi";

import "./ItemDetails.css";


function ItemDetails() {

  const navigate = useNavigate();
  const { id } = useParams();

  const {
    addToCart,
    totalItems,
  } = useCart();

  const [item, setItem] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);


  // ==========================================
  // LOAD REAL ITEM
  // ==========================================

  useEffect(() => {

    const loadItem = async () => {

      try {

        setLoading(true);
        setError("");

        const menu = await getMenu();

        let foundItem = null;
        let foundCategory = null;

        for (const category of menu) {

          const match =
            category.items?.find(
              (menuItem) =>
                menuItem._id === id
            );

          if (match) {

            foundItem = match;
            foundCategory = category;

            break;

          }

        }


        if (!foundItem) {

          setError(
            "This menu item doesn't exist."
          );

          return;

        }


        setItem({
          id: foundItem._id,

          name: foundItem.name,

          category:
            foundCategory?.name ||
            "Menu item",

          categoryId:
            foundCategory?._id || "",

          description:
            foundItem.description || "",

          price:
            Number(foundItem.price) || 0,

          available:
            Boolean(foundItem.isAvailable),

          image:
            foundItem.image || "",
        });

      } catch (error) {

        console.error(
          "Failed to load item:",
          error
        );

        setError(
          error.message ||
          "Failed to load menu item."
        );

      } finally {

        setLoading(false);

      }

    };


    loadItem();

  }, [id]);


  // ==========================================
  // QUANTITY
  // ==========================================

  const increaseQuantity = () => {

    setQuantity(
      (current) => current + 1
    );

  };


  const decreaseQuantity = () => {

    setQuantity(
      (current) =>
        Math.max(1, current - 1)
    );

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <main className="item-details-page">

        <header className="item-details-header">

          <button
            className="item-details-back"
            onClick={() =>
              navigate("/menu")
            }
            aria-label="Back to menu"
          >
            <ArrowLeft size={17} />
          </button>

          <span>
            Menu
          </span>

          <button
            className="item-details-cart"
            onClick={() =>
              navigate("/cart")
            }
            aria-label="Open cart"
          >
            <ShoppingBag size={17} />
          </button>

        </header>


        <div className="item-not-found">

          <h1>
            Loading...
          </h1>

          <p>
            Getting the latest item information.
          </p>

        </div>

      </main>

    );

  }


  // ==========================================
  // ERROR / NOT FOUND
  // ==========================================

  if (error || !item) {

    return (

      <main className="item-details-page">

        <div className="item-not-found">

          <h1>
            Item not found
          </h1>

          <p>
            {error ||
              "This menu item doesn't exist."}
          </p>

          <button
            onClick={() =>
              navigate("/menu")
            }
          >
            Back to menu
          </button>

        </div>

      </main>

    );

  }


  // ==========================================
  // TOTAL
  // ==========================================

  const total =
    item.price * quantity;


  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = () => {

    if (!item.available) {
      return;
    }


    // Add once for every requested quantity.
    for (
      let i = 0;
      i < quantity;
      i++
    ) {

      addToCart({
        id: item.id,

        name: item.name,

        categoryName:
          item.category,

        description:
          item.description,

        price:
          item.price,

        image:
          item.image,

      });

    }


    navigate("/cart");

  };


  return (

    <main className="item-details-page">


      {/* =====================================
          HEADER
      ====================================== */}

      <header className="item-details-header">

        <button
          className="item-details-back"
          onClick={() =>
            navigate("/menu")
          }
          aria-label="Back to menu"
        >
          <ArrowLeft size={17} />
        </button>


        <span>
          Menu
        </span>


        <button
          className="item-details-cart"
          onClick={() =>
            navigate("/cart")
          }
          aria-label="Open cart"
        >

          <ShoppingBag size={17} />

          {totalItems > 0 && (
            <span>
              {totalItems}
            </span>
          )}

        </button>

      </header>



      {/* =====================================
          PRODUCT HERO
      ====================================== */}

      <section className="item-details-hero">

        <div className="item-details-icon">

          <div>
            <span />
            <span />
            <span />
          </div>

        </div>

      </section>



      {/* =====================================
          CONTENT
      ====================================== */}

      <section className="item-details-content">

        <div className="item-details-category">

          {item.category}

        </div>


        <h1>
          {item.name}
        </h1>


        <div className="item-details-price">

          Rs.{" "}
          {item.price.toLocaleString()}

        </div>


        <p className="item-details-description">

          {item.description}

        </p>



        {/* AVAILABLE */}

        {item.available && (

          <div className="item-available">

            <span className="item-available-dot" />

            <Check size={12} />

            Available to order

          </div>

        )}


        {!item.available && (

          <div className="item-available">

            Currently unavailable

          </div>

        )}



        <div className="item-details-divider" />



        {/* =====================================
            QUANTITY
        ====================================== */}

        <div className="item-quantity-section">

          <div>

            <span className="item-section-label">
              Quantity
            </span>

            <p>
              How many would you like?
            </p>

          </div>


          <div className="quantity-control">

            <button
              onClick={
                decreaseQuantity
              }
              disabled={
                quantity === 1
              }
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>


            <strong>
              {quantity}
            </strong>


            <button
              onClick={
                increaseQuantity
              }
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>

          </div>

        </div>



        {/* =====================================
            ADD TO CART
        ====================================== */}

        <button
          className="add-to-cart-button"
          onClick={
            handleAddToCart
          }
          disabled={
            !item.available
          }
        >

          <div>

            <ShoppingBag size={16} />

            <span>
              {item.available
                ? "Add to cart"
                : "Unavailable"}
            </span>

          </div>


          <strong>
            Rs.{" "}
            {total.toLocaleString()}
          </strong>

        </button>

      </section>



      {/* =====================================
          FOOTER NOTE
      ====================================== */}

      <div className="item-details-note">

        Freshly prepared when you order.

      </div>

    </main>

  );

}


export default ItemDetails;