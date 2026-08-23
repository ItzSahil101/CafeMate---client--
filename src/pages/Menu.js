import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  Search,
  ShoppingBag,
  Plus,
  ChevronRight,
  Utensils,
  Check,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useCart,
} from "../context/CartContext";

import "./Menu.css";

import { getMenu } from "../api/publicApi";


function Menu() {

  const navigate = useNavigate();

  const {
    addToCart,
    totalItems,
  } = useCart();


  const [search, setSearch] =
    useState("");

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [addedItem, setAddedItem] =
    useState(null);

  const [menu, setMenu] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    const loadMenu = async () => {

      try {

        setLoading(true);
        setError("");

        const data = await getMenu();

        setMenu(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          "Failed to load menu:",
          error
        );

        setError(
          error.message ||
          "Failed to load menu."
        );

      } finally {

        setLoading(false);

      }

    };

    loadMenu();

  }, []);

  const categories = [
    "All",
    ...menu.map(
      (category) => category.name
    ),
  ];

  const items = menu.flatMap(
    (category) =>
      category.items.map((item) => ({
        id: item._id,
        name: item.name,
        category: category.name,
        categoryId: category._id,
        description:
          item.description || "",
        price: Number(item.price) || 0,
        available:
          Boolean(item.isAvailable),
        image:
          item.image || "",
      }))
  );


  // ==========================================
  // FILTER
  // ==========================================

  const filteredItems = useMemo(() => {

    const query =
      search.trim().toLowerCase();


    return items.filter((item) => {

      const categoryMatch =
        activeCategory === "All" ||
        item.category === activeCategory;


      const searchMatch =
        !query ||

        item.name
          .toLowerCase()
          .includes(query) ||

        item.description
          .toLowerCase()
          .includes(query);


      return (
        categoryMatch &&
        searchMatch
      );

    });

  }, [
    search,
    activeCategory,
    items,
  ]);


  // ==========================================
  // OPEN DETAILS
  // ==========================================

  const handleItemClick = (item) => {

    navigate(
      `/menu/${item.id}`
    );

  };


  // ==========================================
  // ADD DIRECTLY
  // ==========================================

  const handleAdd = (
    event,
    item
  ) => {

    event.stopPropagation();


    if (!item.available) {
      return;
    }


    addToCart({
      ...item,
      categoryName:
        item.category,
    });


    setAddedItem(item.id);


    setTimeout(() => {

      setAddedItem((current) =>
        current === item.id
          ? null
          : current
      );

    }, 1800);

  };


  return (

    <main className="customer-menu-page">


      {/* =====================================
          HEADER
      ====================================== */}

      <header className="menu-page-header">

        <button
          className="menu-back-button"
          onClick={() =>
            navigate("/")
          }
          aria-label="Back to home"
        >
          <ArrowLeft size={17} />
        </button>


        <div className="menu-page-title">

          <span>
            Our menu
          </span>

          <strong>
            Freshly made for you
          </strong>

        </div>

        <div className="menu-header-actions">

          {/* ORDERS */}
          <button
            className="menu-cart-button"
            onClick={() =>
              navigate("/orders")
            }
            aria-label="Open orders"
            title="My orders"
          >
            <ShoppingBag size={17} />

            <span>
              Orders
            </span>
          </button>


          {/* CART */}
          <button
            className="menu-cart-button"
            onClick={() =>
              navigate("/cart")
            }
            aria-label="Open cart"
            title="Open cart"
          >
            <ShoppingBag size={17} />

            <span>
              Cart
            </span>

            {totalItems > 0 && (
              <span className="menu-cart-count">
                {totalItems}
              </span>
            )}
          </button>

        </div>

      </header>



      {/* =====================================
          INTRO
      ====================================== */}

      <section className="menu-intro">

        <p>
          TAKE YOUR PICK
        </p>

        <h1>
          What are you
          <br />
          <span>
            craving today?
          </span>
        </h1>

        <div className="menu-intro-line" />

      </section>



      {/* =====================================
          SEARCH
      ====================================== */}

      <section className="menu-search-wrapper">

        <Search size={16} />

        <input
          type="text"
          placeholder="Search the menu..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />


        {search && (

          <button
            className="menu-search-clear"
            onClick={() =>
              setSearch("")
            }
          >
            ×
          </button>

        )}

      </section>



      {/* =====================================
          CATEGORIES
      ====================================== */}

      <section className="menu-categories">

        {categories.map(
          (category) => (

            <button
              key={category}
              className={
                activeCategory === category
                  ? "menu-category active"
                  : "menu-category"
              }
              onClick={() =>
                setActiveCategory(
                  category
                )
              }
            >
              {category}
            </button>

          )
        )}

      </section>



      {/* =====================================
          RESULTS
      ====================================== */}
      {loading && (
        <div className="customer-menu-empty">
          <div className="customer-menu-empty-icon">
            <Utensils size={20} />
          </div>

          <h3>
            Loading menu
          </h3>

          <p>
            Getting the latest menu for you...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="customer-menu-empty">

          <div className="customer-menu-empty-icon">
            <Utensils size={20} />
          </div>

          <h3>
            Couldn't load the menu
          </h3>

          <p>
            {error}
          </p>

        </div>
      )}

      <section className="customer-menu-list">

        <div className="menu-results-header">

          <div>

            <span>
              {filteredItems.length}{" "}
              {filteredItems.length === 1
                ? "item"
                : "items"}
            </span>

            {activeCategory !== "All" && (

              <strong>
                {activeCategory}
              </strong>

            )}

          </div>

          {totalItems > 0 && (

            <button
              className="menu-view-cart-hint"
              onClick={() =>
                navigate("/cart")
              }
            >

              <ShoppingBag size={13} />

              View your cart

              <ChevronRight
                size={13}
              />

            </button>

          )}

        </div>



        {filteredItems.length === 0 ? (

          <div className="customer-menu-empty">

            <div className="customer-menu-empty-icon">
              <Search size={20} />
            </div>

            <h3>
              Nothing found
            </h3>

            <p>
              Try another search
              or category.
            </p>

          </div>

        ) : (

          <div className="customer-menu-grid">

            {filteredItems.map(
              (item) => (

                <article
                  className={
                    item.available
                      ? "customer-menu-card"
                      : "customer-menu-card unavailable"
                  }
                  key={item.id}
                  onClick={() =>
                    handleItemClick(
                      item
                    )
                  }
                >


                  {/* CARD TOP */}

                  <div className="customer-menu-card-top">

                    <div className="customer-menu-card-icon">

                      <Utensils
                        size={16}
                      />

                    </div>

                    <span className="customer-menu-card-category">
                      {item.category}
                    </span>

                    <ChevronRight
                      size={14}
                      className="menu-card-arrow"
                    />

                  </div>



                  {/* BODY */}

                  <div className="customer-menu-card-body">

                    <h2>
                      {item.name}
                    </h2>

                    <p>
                      {item.description}
                    </p>

                  </div>



                  {/* BOTTOM */}

                  <div className="customer-menu-card-bottom">

                    <div>

                      <span className="menu-price-label">
                        PRICE
                      </span>

                      <strong>
                        Rs.{" "}
                        {Number(
                          item.price
                        ).toLocaleString()}
                      </strong>

                    </div>


                    {item.available ? (

                      <button
                        type="button"
                        className={
                          addedItem === item.id
                            ? "customer-add-button added"
                            : "customer-add-button"
                        }
                        onClick={(event) =>
                          handleAdd(
                            event,
                            item
                          )
                        }
                      >

                        {addedItem ===
                          item.id ? (

                          <>
                            <Check
                              size={14}
                            />

                            Added

                          </>

                        ) : (

                          <>
                            <Plus
                              size={14}
                            />

                            Add

                          </>

                        )}

                      </button>

                    ) : (

                      <span className="customer-unavailable">
                        Unavailable
                      </span>

                    )}

                  </div>


                  {/* CARD HINT */}

                  {addedItem ===
                    item.id && (

                      <button
                        type="button"
                        className="menu-card-cart-hint"
                        onClick={(event) => {

                          event.stopPropagation();

                          navigate(
                            "/cart"
                          );

                        }}
                      >

                        <ShoppingBag
                          size={12}
                        />

                        Added to cart ·
                        View cart

                      </button>

                    )}

                </article>

              )
            )}

          </div>

        )}

      </section>



      {/* =====================================
          BOTTOM CTA
      ====================================== */}

      <section className="menu-bottom-section">

        <div>

          <span>
            Can't decide?
          </span>

          <strong>
            Start with our favorites.
          </strong>

        </div>


        <button
          onClick={() => {

            setActiveCategory(
              "All"
            );

            setSearch("");

          }}
        >

          Show all

          <ChevronRight
            size={14}
          />

        </button>

      </section>


    </main>

  );

}


export default Menu;