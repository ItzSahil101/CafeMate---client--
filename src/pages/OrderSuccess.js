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
} from "react-router-dom";

import {
  getOrder,
} from "../api/publicApi";

import "./OrderSuccess.css";


function OrderSuccess() {

  const navigate = useNavigate();

  const { orderId } = useParams();


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

    const loadOrder = async () => {

      try {

        setLoading(true);
        setError("");


        // --------------------------------------
        // GET ORDER ID
        // --------------------------------------

        let savedOrderId =
          orderId ||
          localStorage.getItem(
            "automateCafeOrderId"
          );


        // --------------------------------------
        // BACKUP:
        // GET MOST RECENT ORDER ID
        // --------------------------------------

        if (!savedOrderId) {

          const savedOrderIds =
            JSON.parse(
              localStorage.getItem(
                "automateCafeOrderIds"
              )
            ) || [];


          if (savedOrderIds.length > 0) {

            savedOrderId =
              savedOrderIds[0];

          }

        }


        // --------------------------------------
        // NO ORDER ID
        // --------------------------------------

        if (!savedOrderId) {

          setError(
            "We couldn't find your order."
          );

          return;

        }


        // --------------------------------------
        // FETCH REAL ORDER
        // --------------------------------------

        const orderData =
          await getOrder(
            savedOrderId
          );


        // --------------------------------------
        // EXACTLY LIKE ORDERS.JSX
        // --------------------------------------

        if (!orderData) {

          throw new Error(
            "Order data was not returned."
          );

        }


        setOrder(
          orderData
        );


      } catch (error) {

        console.error(
          "Failed to load order:",
          error
        );


        setError(
          error?.message ||
          "Failed to load your order."
        );


      } finally {

        setLoading(false);

      }

    };


    loadOrder();

  }, [orderId]);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <main className="order-success">

        <div className="success-container">

          <div className="success-icon">

            <Clock3 size={28} />

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
  // ERROR
  // ==========================================

  if (error || !order) {

    return (

      <main className="order-success">

        <div className="success-container">

          <div className="success-icon">

            <AlertCircle size={28} />

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
                navigate("/menu")
              }
            >
              Order something else
            </button>


            <button
              type="button"
              className="success-secondary-button"
              onClick={() =>
                navigate("/")
              }
            >

              <ArrowLeft size={14} />

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


  const totalAmount =
    Number(
      order.totalAmount
    ) || 0;


  const status =
    order.status ||
    "pending";


  const statusLabel =
    status.charAt(0).toUpperCase() +
    status.slice(1);


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

          <Check size={28} />

        </div>



        {/* =====================================
            TITLE
        ====================================== */}

        <p className="success-eyebrow">
          Order placed
        </p>


        <h1>
          Thank you!
        </h1>


        <p className="success-description">

          Your order has been received by the cafe.
          We'll start preparing it shortly.

        </p>



        {/* =====================================
            ORDER NUMBER + TOTAL
        ====================================== */}

        <section className="success-order-card">


          {/* -------------------------------------
              ORDER NUMBER
          -------------------------------------- */}

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



          {/* -------------------------------------
              REAL ORDER INFORMATION
          -------------------------------------- */}

          <div className="success-order-info">


            {/* TOTAL */}

            <div>

              <span>
                Total
              </span>


              <strong>
                Rs.{" "}
                {totalAmount.toLocaleString()}
              </strong>

            </div>



            {/* STATUS */}

            <div>

              <span>
                Status
              </span>


              <strong className="status-pending">

                <span />

                {statusLabel}

              </strong>

            </div>

          </div>

        </section>



        {/* =====================================
            STATUS
        ====================================== */}

        <section className="success-status">


          <div className="status-icon">

            <Clock3 size={16} />

          </div>


          <div>

            <strong>
              {status === "pending"
                ? "We're preparing your order"
                : status === "accepted"
                  ? "Your order has been accepted"
                  : status === "preparing"
                    ? "Your order is being prepared"
                    : status === "ready"
                      ? "Your order is ready"
                      : status === "completed"
                        ? "Your order is completed"
                        : status === "cancelled"
                          ? "Your order was cancelled"
                          : "Your order is being processed"}
            </strong>


            <p>

              {status === "pending"
                ? "The cafe will update your order status as it progresses."
                : status === "accepted"
                  ? "The cafe has accepted your order and will prepare it shortly."
                  : status === "preparing"
                    ? "Your order is currently being freshly prepared."
                    : status === "ready"
                      ? "Your order is ready for pickup."
                      : status === "completed"
                        ? "Thank you for ordering from us."
                        : status === "cancelled"
                          ? "This order has been cancelled."
                          : "You can track your order from the Orders page."}

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
              navigate("/menu")
            }
          >
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

          Please keep your order number for reference.

        </p>


      </div>

    </main>

  );

}


export default OrderSuccess;