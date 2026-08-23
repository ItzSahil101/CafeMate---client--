import React, {
  useEffect,
  useMemo,
  useState,
  useRef
} from "react";

import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock3,
  PackageCheck,
  ShoppingBag,
  X,
  Utensils,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  cancelOrder,
  getOrder,
} from "../api/publicApi";

import "./Orders.css";


function Orders() {

  const navigate = useNavigate();


  // ==========================================
  // STATE
  // ==========================================

  const [orders, setOrders] =
    useState([]);

    const ordersRef =
    useRef([]);  

  const [expandedOrderId, setExpandedOrderId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [cancelling, setCancelling] =
    useState(false);


  // ==========================================
  // LOAD ALL SAVED ORDERS
  // ==========================================

  useEffect(() => {

    const loadOrders = async () => {

      try {

        setLoading(true);
        setError("");


        // --------------------------------------
        // GET SAVED ORDER IDS
        // --------------------------------------

        let savedOrderIds =
          JSON.parse(
            localStorage.getItem(
              "automateCafeOrderIds"
            )
          ) || [];


        // --------------------------------------
        // BACKWARD COMPATIBILITY
        // --------------------------------------
        // If older version only saved:
        // automateCafeOrderId
        // bring that order into history.
        // --------------------------------------

        const latestSavedId =
          localStorage.getItem(
            "automateCafeOrderId"
          );


        if (
          latestSavedId &&
          !savedOrderIds.includes(
            latestSavedId
          )
        ) {

          savedOrderIds.unshift(
            latestSavedId
          );

        }


        // --------------------------------------
        // NO ORDERS
        // --------------------------------------

        if (!savedOrderIds.length) {

          setOrders([]);

          return;

        }


        // --------------------------------------
        // LOAD EVERY ORDER
        // --------------------------------------

        const results =
          await Promise.allSettled(
            savedOrderIds.map(
              (orderId) =>
                getOrder(orderId)
            )
          );


        const loadedOrders =
          results
            .filter(
              (result) =>
                result.status ===
                "fulfilled" &&
                result.value
            )
            .map(
              (result) =>
                result.value
            );


        // --------------------------------------
        // SORT NEWEST FIRST
        // --------------------------------------

        loadedOrders.sort(
          (a, b) =>
            new Date(
              b.createdAt
            ) -
            new Date(
              a.createdAt
            )
        );


        setOrders(
          loadedOrders
        );


        // --------------------------------------
        // LATEST ORDER OPEN
        // --------------------------------------

        if (
          loadedOrders.length > 0
        ) {

          setExpandedOrderId(
            loadedOrders[0]._id
          );

        }

      } catch (error) {

        console.error(
          "Failed to load orders:",
          error
        );

        setError(
          error.message ||
          "Failed to load your orders."
        );

      } finally {

        setLoading(false);

      }

    };


    loadOrders();

  }, []);

// ==========================================
// AUTO REFRESH ORDER STATUS
// ==========================================

useEffect(() => {

  if (!orders.length) {
    return;
  }


  const refreshOrders = async () => {

    try {

      // Get the latest order IDs from
      // the current state at refresh time.
      setOrders((currentOrders) => {

        if (!currentOrders.length) {
          return currentOrders;
        }

        return currentOrders;

      });

      const currentOrderIds =
        orders.map(
          (order) => order._id
        );


      const updatedResults =
        await Promise.allSettled(
          currentOrderIds.map(
            (orderId) =>
              getOrder(orderId)
          )
        );


      const updatedOrders =
        updatedResults
          .filter(
            (result) =>
              result.status ===
                "fulfilled" &&
              result.value
          )
          .map(
            (result) =>
              result.value
          );


      if (!updatedOrders.length) {
        return;
      }


      setOrders(
        (currentOrders) =>
          currentOrders.map(
            (currentOrder) => {

              const updatedOrder =
                updatedOrders.find(
                  (order) =>
                    order._id ===
                    currentOrder._id
                );


              return updatedOrder ||
                currentOrder;

            }
          )
      );

    } catch (error) {

      console.error(
        "Failed to refresh order status:",
        error
      );

    }

  };


  // Check immediately
  refreshOrders();


  // Check every 5 seconds
  const interval =
    setInterval(
      refreshOrders,
      5000
    );


  return () => {
    clearInterval(interval);
  };


}, [orders]);


  // ==========================================
  // LATEST ORDER
  // ==========================================

  const latestOrder =
    orders[0] || null;


  const previousOrders =
    orders.slice(1);


  // ==========================================
  // STATUS INFO
  // ==========================================

  const getStatusInfo = (
    order
  ) => {

    switch (
    order?.status
    ) {

      case "pending":

        return {
          label: "Order received",
          shortLabel: "Pending",
          description:
            "Your order is waiting to be accepted.",
          icon: Clock3,
        };


      case "accepted":

        return {
          label: "Order accepted",
          shortLabel: "Accepted",
          description:
            "The cafe has accepted your order.",
          icon: Check,
        };


      case "preparing":

        return {
          label: "Being prepared",
          shortLabel: "Preparing",
          description:
            "Your order is being freshly prepared.",
          icon: Utensils,
        };


      case "ready":

        return {
          label: "Ready",
          shortLabel: "Ready",
          description:
            "Your order is ready for you.",
          icon: PackageCheck,
        };


      case "completed":

        return {
          label: "Completed",
          shortLabel: "Completed",
          description:
            "Your order has been completed.",
          icon: Check,
        };


      case "cancelled":

        return {
          label: "Cancelled",
          shortLabel: "Cancelled",
          description:
            "This order has been cancelled.",
          icon: X,
        };


      default:

        return {
          label:
            order?.status ||
            "Unknown",
          shortLabel:
            order?.status ||
            "Unknown",
          description:
            "Order status updated.",
          icon: Clock3,
        };

    }

  };


  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (
    date
  ) => {

    if (!date) {
      return "Unknown date";
    }

    return new Date(
      date
    ).toLocaleString(
      undefined,
      {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );

  };


  // ==========================================
  // ITEM COUNT
  // ==========================================

  const getItemCount = (
    order
  ) => {

    return (
      order?.items?.reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item.quantity
          ),
        0
      ) || 0
    );

  };


  // ==========================================
  // TOGGLE PREVIOUS ORDER
  // ==========================================

  const toggleOrder = (
    orderId
  ) => {

    setExpandedOrderId(
      (current) =>
        current === orderId
          ? null
          : orderId
    );

  };


  // ==========================================
  // CANCEL ORDER
  // ==========================================

  const handleCancel = async (
    order
  ) => {

    if (
      !order ||
      order.status !== "pending"
    ) {

      return;

    }


    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this order?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setCancelling(true);


      const updatedOrder =
        await cancelOrder(
          order._id
        );


      setOrders(
        (currentOrders) =>
          currentOrders.map(
            (currentOrder) =>
              currentOrder._id ===
                updatedOrder._id
                ? updatedOrder
                : currentOrder
          )
      );

    } catch (error) {

      console.error(
        "Failed to cancel order:",
        error
      );

      setError(
        error.message ||
        "Failed to cancel order."
      );

    } finally {

      setCancelling(false);

    }

  };


  // ==========================================
  // STATUS TIMELINE
  // ==========================================

  const statusSteps = useMemo(
    () => [
      "pending",
      "accepted",
      "preparing",
      "ready",
      "completed",
    ],
    []
  );


  const getStatusStepIndex = (
    status
  ) => {

    return statusSteps.indexOf(
      status
    );

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <main className="orders-page">

        <header className="orders-header">

          <button
            className="orders-back-button"
            onClick={() =>
              navigate("/")
            }
          >
            <ArrowLeft size={17} />
          </button>


          <div className="orders-header-title">

            <span>
              Orders
            </span>

            <strong>
              Your order history
            </strong>

          </div>


          <div className="orders-header-icon">
            <ShoppingBag size={17} />
          </div>

        </header>


        <div className="orders-state">

          <div className="orders-loading-icon">
            <ShoppingBag size={20} />
          </div>

          <h2>
            Loading your orders
          </h2>

          <p>
            Getting your latest order history...
          </p>

        </div>

      </main>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

  if (
    error &&
    !orders.length
  ) {

    return (

      <main className="orders-page">

        <header className="orders-header">

          <button
            className="orders-back-button"
            onClick={() =>
              navigate("/")
            }
          >
            <ArrowLeft size={17} />
          </button>


          <div className="orders-header-title">

            <span>
              Orders
            </span>

            <strong>
              Your order history
            </strong>

          </div>


          <div className="orders-header-icon">
            <ShoppingBag size={17} />
          </div>

        </header>


        <div className="orders-state">

          <div className="orders-error-icon">
            <X size={20} />
          </div>

          <h2>
            Couldn't load your orders
          </h2>

          <p>
            {error}
          </p>

          <button
            className="orders-primary-button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try again
          </button>

        </div>

      </main>

    );

  }


  // ==========================================
  // NO ORDERS
  // ==========================================

  if (!latestOrder) {

    return (

      <main className="orders-page">

        <header className="orders-header">

          <button
            className="orders-back-button"
            onClick={() =>
              navigate("/")
            }
          >
            <ArrowLeft size={17} />
          </button>


          <div className="orders-header-title">

            <span>
              Orders
            </span>

            <strong>
              Your order history
            </strong>

          </div>


          <div className="orders-header-icon">
            <ShoppingBag size={17} />
          </div>

        </header>


        <section className="orders-empty">

          <div className="orders-empty-icon">
            <ShoppingBag size={26} />
          </div>

          <p className="orders-eyebrow">
            NO ORDERS YET
          </p>

          <h1>
            Nothing here
            <br />
            <span>yet.</span>
          </h1>

          <p className="orders-empty-description">
            Once you place an order, you can
            come back here to track it and see
            all of your previous orders.
          </p>

          <button
            className="orders-primary-button"
            onClick={() =>
              navigate("/menu")
            }
          >
            Explore menu
          </button>

        </section>

      </main>

    );

  }


  const latestStatus =
    getStatusInfo(
      latestOrder
    );

  const LatestStatusIcon =
    latestStatus.icon;


  const latestStep =
    getStatusStepIndex(
      latestOrder.status
    );


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <main className="orders-page">


      {/* =====================================
            HEADER
        ====================================== */}

      <header className="orders-header">

        <button
          className="orders-back-button"
          onClick={() =>
            navigate("/")
          }
          aria-label="Back"
        >
          <ArrowLeft size={17} />
        </button>


        <div className="orders-header-title">

          <span>
            Orders
          </span>

          <strong>
            Your order history
          </strong>

        </div>


        <div className="orders-header-icon">
          <ShoppingBag size={17} />
        </div>

      </header>



      <section className="orders-content">


        {/* =====================================
              INTRO
          ====================================== */}

        <div className="orders-intro">

          <p className="orders-eyebrow">
            CURRENT ORDER · #{latestOrder.orderNumber}
          </p>

          <h1>
            Here's your
            <br />
            <span>latest order.</span>
          </h1>

          <p>
            Placed{" "}
            {formatDate(
              latestOrder.createdAt
            )}
          </p>

        </div>



        {/* =====================================
              LATEST STATUS
          ====================================== */}

        <section
          className={
            `orders-status-card status-${latestOrder.status}`
          }
        >

          <div className="orders-status-icon">

            <LatestStatusIcon
              size={20}
            />

          </div>


          <div className="orders-status-content">

            <span>
              CURRENT STATUS
            </span>

            <h2>
              {latestStatus.label}
            </h2>

            <p>
              {latestStatus.description}
            </p>

          </div>


          <div className="orders-status-pill">

            {latestStatus.shortLabel}

          </div>

        </section>



        {/* =====================================
              STATUS TIMELINE
          ====================================== */}

        {latestOrder.status !==
          "cancelled" && (

            <section
              className={
                "orders-timeline"
              }
            >

              {statusSteps.map(
                (
                  step,
                  index
                ) => {

                  const isCompleted =
                    latestStep >=
                    index;

                  const isCurrent =
                    latestOrder.status ===
                    step;

                  return (

                    <div
                      className={
                        isCompleted
                          ? "orders-timeline-step completed"
                          : "orders-timeline-step"
                      }
                      key={step}
                    >

                      <div className="orders-timeline-dot">

                        {isCompleted ? (
                          <Check
                            size={10}
                          />
                        ) : (
                          <span />
                        )}

                      </div>

                      <span>
                        {
                          step === "pending"
                            ? "Received"
                            : step === "accepted"
                              ? "Accepted"
                              : step === "preparing"
                                ? "Preparing"
                                : step === "ready"
                                  ? "Ready"
                                  : "Completed"
                        }
                      </span>

                      {isCurrent && (
                        <small>
                          Now
                        </small>
                      )}

                    </div>

                  );

                }
              )}

            </section>

          )}



        {/* =====================================
              LATEST ORDER DETAILS
          ====================================== */}

        <section className="orders-card">

          <div className="orders-card-header">

            <div>

              <span>
                ORDER DETAILS
              </span>

              <h2>
                {getItemCount(
                  latestOrder
                )}{" "}
                {getItemCount(
                  latestOrder
                ) === 1
                  ? "item"
                  : "items"}
              </h2>

            </div>

            <ShoppingBag size={17} />

          </div>


          <div className="orders-items">

            {latestOrder.items.map(
              (
                item,
                index
              ) => (

                <div
                  className="orders-item"
                  key={`${item.menuItem}-${index}`}
                >

                  <div className="orders-item-icon">
                    <Utensils size={15} />
                  </div>


                  <div className="orders-item-info">

                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.quantity}
                      {" × Rs. "}
                      {Number(
                        item.price
                      ).toLocaleString()}
                    </span>

                  </div>


                  <strong>
                    Rs.{" "}
                    {Number(
                      item.subtotal
                    ).toLocaleString()}
                  </strong>

                </div>

              )
            )}

          </div>


          <div className="orders-total">

            <span>
              Total
            </span>

            <strong>
              Rs.{" "}
              {Number(
                latestOrder.totalAmount
              ).toLocaleString()}
            </strong>

          </div>

        </section>

        {/* ===================================
    CUSTOMER NOTE
==================================== */}

        {latestOrder.notes &&
          latestOrder.notes.trim() && (

            <section className="orders-note-card">

              <div className="orders-note-header">

                <div className="orders-note-icon">
                  <Utensils size={16} />
                </div>

                <div>

                  <span>
                    SPECIAL REQUEST
                  </span>

                  <h2>
                    Customer note
                  </h2>

                </div>

              </div>


              <div className="orders-note-content">

                <p>
                  {latestOrder.notes}
                </p>

              </div>

            </section>

          )}


        {/* =====================================
              LATEST ORDER INFORMATION
          ====================================== */}

        <section className="orders-info-grid">

          <div className="orders-info-card">

            <span>
              TABLE
            </span>

            <strong>
              {latestOrder.tableNumber ||
                "—"}
            </strong>

          </div>


          <div className="orders-info-card">

            <span>
              PAYMENT
            </span>

            <strong>
              {latestOrder.paymentMethod ===
                "online"
                ? "Online"
                : "Cash"}
            </strong>

          </div>

        </section>



        {/* =====================================
              CANCEL
          ====================================== */}

        {latestOrder.status ===
          "pending" && (

            <button
              className="orders-cancel-button"
              onClick={() =>
                handleCancel(
                  latestOrder
                )
              }
              disabled={
                cancelling
              }
            >

              <X size={15} />

              {cancelling
                ? "Cancelling..."
                : "Cancel order"}

            </button>

          )}


        {latestOrder.status !==
          "pending" && (

            <p className="orders-cancel-note">

              This order can no longer
              be cancelled.

            </p>

          )}



        {/* =====================================
              ORDER HISTORY
          ====================================== */}

        {previousOrders.length > 0 && (

          <section className="orders-history">

            <div className="orders-history-heading">

              <div>

                <span>
                  ORDER HISTORY
                </span>

                <h2>
                  Previous orders
                </h2>

              </div>

              <span className="orders-history-count">
                {previousOrders.length}
              </span>

            </div>


            <div className="orders-history-list">

              {previousOrders.map(
                (previousOrder) => {

                  const status =
                    getStatusInfo(
                      previousOrder
                    );

                  const StatusIcon =
                    status.icon;

                  const isExpanded =
                    expandedOrderId ===
                    previousOrder._id;


                  return (

                    <article
                      className={
                        `orders-history-card status-${previousOrder.status}` +
                        (
                          isExpanded
                            ? " expanded"
                            : ""
                        )
                      }
                      key={
                        previousOrder._id
                      }
                    >


                      {/* HISTORY HEADER */}

                      <button
                        type="button"
                        className="orders-history-summary"
                        onClick={() =>
                          toggleOrder(
                            previousOrder._id
                          )
                        }
                      >

                        <div className="orders-history-status-icon">

                          <StatusIcon
                            size={16}
                          />

                        </div>


                        <div className="orders-history-main">

                          <div className="orders-history-title-row">

                            <strong>
                              #
                              {
                                previousOrder.orderNumber
                              }
                            </strong>

                            <span className="orders-history-status">

                              {
                                status.shortLabel
                              }

                            </span>

                          </div>


                          <div className="orders-history-meta">

                            <span>
                              {
                                formatDate(
                                  previousOrder.createdAt
                                )
                              }
                            </span>

                            <span>
                              •
                            </span>

                            <span>
                              {
                                getItemCount(
                                  previousOrder
                                )
                              }{" "}
                              {
                                getItemCount(
                                  previousOrder
                                ) === 1
                                  ? "item"
                                  : "items"
                              }
                            </span>

                            <span>
                              •
                            </span>

                            <strong>
                              Rs.{" "}
                              {
                                Number(
                                  previousOrder.totalAmount
                                ).toLocaleString()
                              }
                            </strong>

                          </div>

                        </div>


                        <ChevronDown
                          size={17}
                          className="orders-history-chevron"
                        />

                      </button>



                      {/* EXPANDED DETAILS */}

                      {isExpanded && (

                        <div className="orders-history-details">


                          <div className="orders-history-detail-status">

                            <div>

                              <span>
                                STATUS
                              </span>

                              <strong>
                                {
                                  status.label
                                }
                              </strong>

                            </div>

                            <p>
                              {
                                status.description
                              }
                            </p>

                          </div>


                          <div className="orders-history-items">

                            {previousOrder.items.map(
                              (
                                item,
                                index
                              ) => (

                                <div
                                  className="orders-history-item"
                                  key={
                                    `${item.menuItem}-${index}`
                                  }
                                >

                                  <div className="orders-history-item-icon">
                                    <Utensils
                                      size={13}
                                    />
                                  </div>

                                  <div>

                                    <strong>
                                      {
                                        item.name
                                      }
                                    </strong>

                                    <span>
                                      {
                                        item.quantity
                                      }
                                      {" × Rs. "}
                                      {
                                        Number(
                                          item.price
                                        ).toLocaleString()
                                      }
                                    </span>

                                  </div>

                                  <strong>
                                    Rs.{" "}
                                    {
                                      Number(
                                        item.subtotal
                                      ).toLocaleString()
                                    }
                                  </strong>

                                </div>

                              )
                            )}

                          </div>

                          {/* =====================================
    PREVIOUS ORDER NOTE
====================================== */}

                          {previousOrder.notes &&
                            previousOrder.notes.trim() && (

                              <div className="orders-history-note">

                                <div className="orders-history-note-header">

                                  <div className="orders-history-note-icon">
                                    <Utensils size={13} />
                                  </div>

                                  <span>
                                    SPECIAL REQUEST
                                  </span>

                                </div>

                                <p>
                                  {previousOrder.notes}
                                </p>

                              </div>

                            )}


                          <div className="orders-history-footer">

                            <div>

                              <span>
                                TABLE
                              </span>

                              <strong>
                                {
                                  previousOrder.tableNumber ||
                                  "—"
                                }
                              </strong>

                            </div>


                            <div>

                              <span>
                                PAYMENT
                              </span>

                              <strong>
                                {
                                  previousOrder.paymentMethod ===
                                    "online"
                                    ? "Online"
                                    : "Cash"
                                }
                              </strong>

                            </div>


                            <div>

                              <span>
                                TOTAL
                              </span>

                              <strong>
                                Rs.{" "}
                                {
                                  Number(
                                    previousOrder.totalAmount
                                  ).toLocaleString()
                                }
                              </strong>

                            </div>

                          </div>

                        </div>

                      )}

                    </article>

                  );

                }
              )}

            </div>

          </section>

        )}


        {error && orders.length > 0 && (

          <div className="orders-inline-error">
            {error}
          </div>

        )}

      </section>

    </main>

  );

}


export default Orders;