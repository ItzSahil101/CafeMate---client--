  import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
  } from "react";

  const CartContext = createContext(null);

  const STORAGE_KEY = "automate-cafe-cart";


  export function CartProvider({ children }) {

    const [cartItems, setCartItems] = useState(() => {

      try {

        const savedCart =
          localStorage.getItem(STORAGE_KEY);

        if (!savedCart) {
          return [];
        }

        const parsed = JSON.parse(savedCart);

        if (!Array.isArray(parsed)) {
          return [];
        }

        return parsed.map((item) => ({
          ...item,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
        }));

      } catch (error) {

        console.error(
          "Failed to load cart:",
          error
        );

        return [];

      }

    });


    // ==========================================
    // SAVE CART
    // ==========================================

    useEffect(() => {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cartItems)
      );

    }, [cartItems]);


    // ==========================================
    // ADD TO CART
    // ==========================================

    const addToCart = (item) => {

      if (!item || !item.id) {
        return;
      }

      setCartItems((current) => {

        const existing = current.find(
          (cartItem) =>
            cartItem.id === item.id
        );


        // Already exists
        if (existing) {

          return current.map((cartItem) =>

            cartItem.id === item.id

              ? {
                  ...cartItem,
                  quantity:
                    Number(cartItem.quantity || 0) + 1,
                }

              : cartItem

          );

        }


        // New item
        return [
          ...current,

          {
            id: item.id,

            name:
              item.name || "Menu item",

            categoryName:
              item.categoryName ||
              item.category ||
              "Menu item",

            description:
              item.description || "",

            price:
              Number(item.price) || 0,

            quantity: 1,
          },

        ];

      });

    };


    // ==========================================
    // REMOVE
    // ==========================================

    const removeFromCart = (itemId) => {

      setCartItems((current) =>

        current.filter(
          (item) => item.id !== itemId
        )

      );

    };


    // ==========================================
    // INCREASE
    // ==========================================

    const increaseQuantity = (itemId) => {

      setCartItems((current) =>

        current.map((item) =>

          item.id === itemId

            ? {
                ...item,
                quantity:
                  Number(item.quantity || 0) + 1,
              }

            : item

        )

      );

    };


    // ==========================================
    // DECREASE
    // ==========================================

    const decreaseQuantity = (itemId) => {

      setCartItems((current) =>

        current

          .map((item) =>

            item.id === itemId

              ? {
                  ...item,
                  quantity:
                    Number(item.quantity || 0) - 1,
                }

              : item

          )

          .filter(
            (item) =>
              Number(item.quantity) > 0
          )

      );

    };


    // ==========================================
    // CLEAR
    // ==========================================

    const clearCart = () => {
      setCartItems([]);
    };


    // ==========================================
    // TOTAL ITEMS
    // ==========================================

    const totalItems = useMemo(() => {

      return cartItems.reduce(
        (total, item) =>
          total +
          (Number(item.quantity) || 0),
        0
      );

    }, [cartItems]);


    // ==========================================
    // TOTAL AMOUNT
    // ==========================================

    const totalAmount = useMemo(() => {

      return cartItems.reduce(
        (total, item) =>

          total +
          (
            Number(item.price) || 0
          ) *
          (
            Number(item.quantity) || 0
          ),

        0
      );

    }, [cartItems]);


    // Keep old names too so nothing else
    // in your project breaks.
    const cartCount = totalItems;
    const cartTotal = totalAmount;


    const value = {

      cartItems,

      totalItems,
      totalAmount,

      cartCount,
      cartTotal,

      addToCart,

      removeFromCart,

      increaseQuantity,

      decreaseQuantity,

      clearCart,

    };


    return (

      <CartContext.Provider value={value}>
        {children}
      </CartContext.Provider>

    );

  }


  export function useCart() {

    const context =
      useContext(CartContext);


    if (!context) {

      throw new Error(
        "useCart must be used inside CartProvider"
      );

    }


    return context;

  }