import React, {
  useEffect,
  useState,
} from "react";

import {
  Check,
  Clock3,
  ShoppingBag,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  getOrder,
} from "../api/publicApi";

import "./OrderSuccess.css";


function OrderSuccess() {

  const navigate = useNavigate();

  const { orderId } = useParams();

  const location = useLocation();


  // ==========================================
  // STATE
  // ==========================================

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD REAL ORDER
  // ==========================================

  useEffect(() => {

    let mounted = true;


    const loadOrder = async () => {

      try {

        setLoading(true);
        setError("");


        // ======================================
        // 1. GET ORDER ID FROM URL PARAM
        // ======================================

        let savedOrderId =
          orderId || null;


        // ======================================
        // 2. CHECK QUERY PARAM
        // Supports:
        // /order-success?orderId=xxxx
        // ======================================

        if (!savedOrderId) {

          const queryParams =
            new URLSearchParams(
              location.search
            );

          savedOrderId =
            queryParams.get("orderId");

        }


        // ======================================
        // 3. GET ORDER IDS FROM LOCAL STORAGE
        // ======================================

        let savedOrderIds = [];

        try {

          savedOrderIds =
            JSON.parse(
              localStorage.getItem(
                "automateCafeOrderIds"
              )
            ) || [];

        } catch (storageError) {

          console.warn(
            "Could not read saved order IDs:",
            storageError
          );

          savedOrderIds = [];

        }


        // ======================================
        // 4. MOST RECENT ORDER SHOULD WIN
        //
        // Orders.jsx also uses this storage.
        // ======================================

        if (
          !savedOrderId &&
          Array.isArray(savedOrderIds) &&
          savedOrderIds.length > 0
        ) {

          savedOrderId =
            savedOrderIds[0];

        }


        // ======================================
        // 5. BACKWARD COMPATIBILITY
        // ======================================

        if (!savedOrderId) {

          savedOrderId =
            localStorage.getItem(
              "automateCafeOrderId"
            );

        }


        // ======================================
        // 6. NO ORDER ID
        // ======================================

        if (!savedOrderId) {

          if (mounted) {

            setError(
              "We couldn't find your order. Please open the Orders page and try again."
            );

          }

          return;

        }


        console.log(
          "OrderSuccess: Loading order:",
          savedOrderId
        );


        // ======================================
        // 7. FETCH REAL ORDER
        // EXACT SAME API USED BY ORDERS.JSX
        // ======================================

        const response =
          await getOrder(
            savedOrderId
          );


        console.log(
          "OrderSuccess: API response:",
          response
        );


        // ======================================
        // 8. NORMALIZE RESPONSE
        //
        // Normally getOrder() should directly
        // return the order, exactly like Orders.jsx.
        //
        // These fallbacks also handle:
        // { order: {...} }
        // { data: {...} }
        // ======================================

        let orderData =
          response;


        if (
          response &&
          response.order
        ) {

          orderData =
            response.order;

        } else if (
          response &&
          response.data
        ) {

          orderData =
            response.data;

        }


        // ======================================
        // 9. VERIFY ORDER DATA
        // ======================================

        if (
          !orderData ||
          typeof orderData !== "object"
        ) {

          throw new Error(
            "Order data was not returned from the server."
          );

        }


        // ======================================
        // 10. VERIFY IMPORTANT ORDER FIELDS
        // ======================================

        console.log(
          "OrderSuccess: Real order:",
          orderData
        );

        console.log(
          "OrderSuccess: Order number:",
          orderData.orderNumber
        );

        console.log(
          "OrderSuccess: Total amount:",
          orderData.totalAmount
        );

        console.log(
          "OrderSuccess: Status:",
          orderData.status
        );


        if (mounted) {

          setOrder(
            orderData
          );

        }

      } catch (error) {

        console.error(
          "OrderSuccess: Failed to load order:",
          error
        );


        if (mounted) {

          setError(
            error?.message ||
            "Failed to load your order."
          );

        }

      } finally {

        if (mounted) {

          setLoading(false);

        }

      }

    };


    loadOrder();


    return () => {

      mounted = false;

    };


  }, [
    orderId,
    location.search,
  ]);


  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {

    return (

      <main className="order-success">

        <div className="success-container">

          <div className="success-icon">

            <Clock3
              size={28}
            />

          </div>


          <p className="success-eyebrow">
            ORDER
          </p>


          <h1>
            Loading...
          </h1>


          <p className="success-description">
            Getting your order details...
          </p>

        </div>

      </main>

    );

  }


  // ==========================================
  // ERROR STATE
  // ==========================================

  if (
    error ||
    !order
  ) {

    return (

      <main className="order-success">

        <div className="success-container">

          <div className="success-icon">

            <AlertCircle
              size={28}
            />

          </div>


          <p className="success-eyebrow">
            ORDER
          </p>


          <h1>
            Order not found
          </h1>


          <p className="success-description">
            {error ||
              "We couldn't find your order details."}
          </p>


          <div className="success-actions">

            <button
              type="button"
              className="success-primary-button"
              onClick={() =>
                navigate("/orders")
              }
            >
              View my orders
            </button>


            <button
              type="button"
              className="success-secondary-button"
              onClick={() =>
                navigate("/")
              }
            >

              <ArrowLeft
                size={14}
              />

              Back to cafe

            </button>

          </div>

        </div>

      </main>

    );

  }


  // ==========================================
  // REAL ORDER DATA
  // ==========================================

  const orderNumber =
    order.orderNumber ||
    "—";


  // ==========================================
  // REAL TOTAL
  // ==========================================

  const totalAmount =
    Number(
      order.totalAmount
    ) || 0;


  // ==========================================
  // REAL STATUS
  // ==========================================

  const status =
    order.status ||
    "pending";


  // ==========================================
  // STATUS LABEL
  // ==========================================

  const statusLabel =
    status.charAt(0).toUpperCase() +
    status.slice(1);


  // ==========================================
  // STATUS MESSAGE
  // ==========================================

  let statusTitle =
    "Your order is being processed";

  let statusDescription =
    "You can track your order from the Orders page.";


  if (status === "pending") {

    statusTitle =
      "We're preparing your order";

    statusDescription =
      "The cafe will update your order status as it progresses.";

  } else if (status === "accepted") {

    statusTitle =
      "Your order has been accepted";

    statusDescription =
      "The cafe has accepted your order and will prepare it shortly.";

  } else if (status === "preparing") {

    statusTitle =
      "Your order is being prepared";

    statusDescription =
      "Your order is currently being freshly prepared.";

  } else if (status === "ready") {

    statusTitle =
      "Your order is ready";

    statusDescription =
      "Your order is ready for pickup.";

  } else if (status === "completed") {

    statusTitle =
      "Your order is completed";

    statusDescription =
      "Thank you for ordering from us.";

  } else if (status === "cancelled") {

    statusTitle =
      "Your order was cancelled";

    statusDescription =
      "This order has been cancelled.";

  }


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <main className="order-success">

      <div className="success-container">


        {/* =====================================
            SUCCESS ICON
        ====================================== */}

        <div className="success-icon">

          <Check
            size={28}
          />

        </div>


        {/* =====================================
            TITLE
        ====================================== */}

        <p className="success-eyebrow">
          ORDER PLACED
        </p>


        <h1>
          Thank you!
        </h1>


        <p className="success-description">
          Your order has been received by the cafe.
          We'll start preparing it shortly.
        </p>



        {/* =====================================
            REAL ORDER CARD
        ====================================== */}

        <section className="success-order-card">


          {/* ===================================
              ORDER NUMBER
          ==================================== */}

          <div className="success-order-top">

            <div>

              <span>
                Order number
              </span>


              <strong>
                {orderNumber}
              </strong>

            </div>


            <div className="success-order-icon">

              <ShoppingBag
                size={17}
              />

            </div>

          </div>



          <div className="success-divider" />



          {/* ===================================
              REAL ORDER INFORMATION
          ==================================== */}

          <div className="success-order-info">


            {/* TOTAL */}

            <div>

              <span>
                Total
              </span>


              <strong>

                Rs.{" "}

                {totalAmount.toLocaleString(
                  "en-IN"
                )}

              </strong>

            </div>



            {/* STATUS */}

            <div>

              <span>
                Status
              </span>


              <strong
                className={
                  `status-${status}`
                }
              >

                <span />

                {statusLabel}

              </strong>

            </div>


          </div>

        </section>



        {/* =====================================
            STATUS
        ====================================== */}

        <section
          className={
            `success-status status-${status}`
          }
        >

          <div className="status-icon">

            <Clock3
              size={16}
            />

          </div>


          <div>

            <strong>
              {statusTitle}
            </strong>


            <p>
              {statusDescription}
            </p>

          </div>

        </section>



        {/* =====================================
            ACTIONS
        ====================================== */}

        <div className="success-actions">

          <button
            type="button"
            className="success-primary-button"
            onClick={() =>
              navigate("/orders")
            }
          >
            View my order
          </button>


          <button
            type="button"
            className="success-secondary-button"
            onClick={() =>
              navigate("/menu")
            }
          >

            <ShoppingBag
              size={14}
            />

            Order something else

          </button>


          <button
            type="button"
            className="success-secondary-button"
            onClick={() =>
              navigate("/")
            }
          >

            <ArrowLeft
              size={14}
            />

            Back to cafe

          </button>

        </div>



        {/* =====================================
            FOOTER
        ====================================== */}

        <p className="success-footer">

          Please keep your order number{" "}
          <strong>
            {orderNumber}
          </strong>{" "}
          for reference.

        </p>


      </div>

    </main>

  );

}


export default OrderSuccess;