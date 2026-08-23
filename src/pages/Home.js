import React, {
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  Clock3,
  MapPin,
  ShoppingBag,
  Utensils,
  ClipboardList,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

import { getCafe, getMenu } from "../api/publicApi";

import "./Home.css";


function Home() {

  const {
    addToCart,
    cartItems,
  } = useCart();


  const [cafe, setCafe] =
    useState(null);

  const [todaysChoice, setTodaysChoice] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD REAL CAFE + MENU
  // ==========================================

  useEffect(() => {

    const loadHomeData = async () => {

      try {

        setLoading(true);
        setError("");


        const [
          cafeData,
          menuData,
        ] = await Promise.all([
          getCafe(),
          getMenu(),
        ]);


        setCafe(cafeData);


        // Find first available menu item
        // to use as today's choice.
        const availableItems =
          menuData.flatMap(
            (category) =>
              Array.isArray(category.items)
                ? category.items
                : []
          ).filter(
            (item) =>
              item.isAvailable
          );


        if (availableItems.length > 0) {

          const item =
            availableItems[0];


          setTodaysChoice({

            id:
              item._id,

            name:
              item.name,

            description:
              item.description || "",

            price:
              Number(item.price) || 0,

            image:
              item.image || "",

          });

        } else {

          setTodaysChoice(null);

        }

      } catch (error) {

        console.error(
          "Failed to load home data:",
          error
        );

        setError(
          error.message ||
          "Failed to load cafe information."
        );

      } finally {

        setLoading(false);

      }

    };


    loadHomeData();

  }, []);


  // ==========================================
  // CART COUNT
  // ==========================================

  const cartCount =
    cartItems?.reduce(
      (total, item) =>
        total +
        (Number(item.quantity) || 0),
      0
    ) || 0;


  // ==========================================
  // ADD TODAY'S CHOICE
  // ==========================================

  const handleAdd = () => {

    if (!todaysChoice) {
      return;
    }


    addToCart({

      ...todaysChoice,

      _id:
        todaysChoice.id,

      categoryName:
        "Featured",

    });

  };


  // ==========================================
  // DISPLAY DATA
  // ==========================================

  const cafeName =
    cafe?.name ||
    "Our Cafe";

  const cafeAddress =
    cafe?.address ||
    "Visit our cafe";

  const cafePhone =
    cafe?.phone ||
    "Contact us";


  return (

    <div className="customer-home">


      {/* =====================================
          HEADER
      ====================================== */}

      <header className="customer-header">

        <Link
          to="/"
          className="customer-brand"
        >

          <div className="customer-brand-mark">
            <Utensils size={17} />
          </div>

          <div>

            <strong>
              {cafeName}
            </strong>

            <span>
              Fresh · Simple · Delicious
            </span>

          </div>

        </Link>


        <nav className="customer-nav">

          <Link
            to="/"
            className="customer-nav-link active"
          >
            Home
          </Link>

          <Link
            to="/menu"
            className="customer-nav-link"
          >
            Menu
          </Link>

          <Link
            to="/cafe"
            className="customer-nav-link"
          >
            Cafe
          </Link>

        </nav>

        <div className="customer-header-actions">

          {/* ORDERS */}
          <Link
            to="/orders"
            className="customer-cart-button"
            aria-label="My orders"
          >
            <ShoppingBag size={16} />

            <span>
              Orders
            </span>
          </Link>


          {/* CART */}
          <Link
            to="/cart"
            className="customer-cart-button"
            aria-label="Shopping cart"
          >
            <ShoppingBag size={16} />

            <span>
              Cart
            </span>

            {cartCount > 0 && (
              <b>
                {cartCount}
              </b>
            )}
          </Link>

        </div>

      </header>



      {/* =====================================
          HERO
      ====================================== */}

      <section className="customer-hero">

        <div className="customer-hero-content">

          <p className="customer-eyebrow">
            WELCOME TO {cafeName.toUpperCase()}
          </p>

          <h1>
            Good food.
            <br />
            Good mood.
            <br />
            <span>Good moments.</span>
          </h1>

          <p className="customer-hero-description">
            Take a break, grab your favorite drink,
            and enjoy something made just for you.
          </p>


          <div className="customer-hero-actions">

            <Link
              to="/menu"
              className="customer-primary-button rgb-button"
            >
              Explore menu
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/cafe"
              className="customer-secondary-button"
            >
              About our cafe
            </Link>

          </div>

        </div>



        {/* =================================
            HERO VISUAL
        ================================= */}

        <div className="customer-hero-visual">

          <div className="hero-card-main">

            <div className="hero-card-top">

              <span>
                Today's choice
              </span>

              <div className="hero-card-icon">
                <Utensils size={15} />
              </div>

            </div>


            <div className="hero-food-placeholder">

              <div className="hero-food-circle">
                <Utensils size={42} />
              </div>

            </div>


            <div className="hero-card-info">

              <div>

                <span className="hero-card-label">
                  BARISTA PICK
                </span>

                <h3>
                  {loading
                    ? "Loading..."
                    : todaysChoice?.name ||
                    "No item available"}
                </h3>

              </div>

              {todaysChoice && (

                <span className="hero-card-price">
                  Rs.{" "}
                  {todaysChoice.price.toLocaleString()}
                </span>

              )}

            </div>


            <button
              type="button"
              className="hero-add-button rgb-button"
              onClick={handleAdd}
              disabled={!todaysChoice}
            >

              <ShoppingBag size={14} />

              {todaysChoice
                ? "Add to cart"
                : "Unavailable"}

            </button>

          </div>


          <div className="hero-floating-card">

            <div className="hero-floating-icon">
              <Clock3 size={15} />
            </div>

            <div>

              <strong>
                Freshly prepared
              </strong>

              <span>
                Made when you order
              </span>

            </div>

          </div>

        </div>

      </section>



      {/* =====================================
          INFO STRIP
      ====================================== */}

      <section className="customer-info-strip">

        <div className="customer-info-item">

          <div className="customer-info-icon">
            <MapPin size={16} />
          </div>

          <div>

            <span>
              LOCATION
            </span>

            <strong>
              {cafeAddress}
            </strong>

          </div>

        </div>


        <div className="customer-info-item">

          <div className="customer-info-icon">
            <Clock3 size={16} />
          </div>

          <div>

            <span>
              CONTACT
            </span>

            <strong>
              {cafePhone}
            </strong>

          </div>

        </div>


        <Link
          to="/cafe"
          className="customer-info-action"
        >
          View cafe details
          <ArrowRight size={13} />
        </Link>

      </section>



      {/* =====================================
          DISCOVER
      ====================================== */}

      <section className="customer-discover">

        <div className="customer-section-heading">

          <div>

            <p className="customer-eyebrow">
              DISCOVER
            </p>

            <h2>
              Something for every mood.
            </h2>

          </div>

          <Link
            to="/menu"
            className="customer-view-menu"
          >
            View full menu
            <ArrowRight size={13} />
          </Link>

        </div>


        <div className="customer-discover-grid">

          <Link
            to="/menu"
            className="customer-discover-card"
          >

            <div className="discover-card-icon">
              <Utensils size={17} />
            </div>

            <div>

              <span>
                OUR MENU
              </span>

              <h3>
                Explore everything
              </h3>

              <p>
                Browse drinks, food and everything
                we have prepared for you.
              </p>

            </div>

            <ArrowRight size={15} />

          </Link>


          <Link
            to="/cafe"
            className="customer-discover-card"
          >

            <div className="discover-card-icon">
              <MapPin size={17} />
            </div>

            <div>

              <span>
                OUR CAFE
              </span>

              <h3>
                {cafeName}
              </h3>

              <p>
                Find us, check our information and
                learn a little more about the cafe.
              </p>

            </div>

            <ArrowRight size={15} />

          </Link>

        </div>

      </section>



      {/* =====================================
          FINAL CTA
      ====================================== */}

      <section className="customer-final-cta">

        <div>

          <p className="customer-eyebrow">
            HUNGRY?
          </p>

          <h2>
            Let's get you something good.
          </h2>

          <p>
            Browse the menu and order in a few taps.
          </p>

        </div>

        <Link
          to="/menu"
          className="customer-primary-button rgb-button"
        >
          Order now
          <ArrowRight size={15} />
        </Link>

      </section>

    </div>

  );

}


export default Home;