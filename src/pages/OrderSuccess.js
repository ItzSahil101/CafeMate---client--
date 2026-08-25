import React from "react";

import {
  Check,
  Clock3,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import "./OrderSuccess.css";


function OrderSuccess() {

  const location = useLocation();
  const navigate = useNavigate();


  // ==========================================
  // GET REAL ORDER DATA
  // ==========================================

  const order = location.state?.order;


  // Real values from backend
  const orderNumber =
    order?.orderNumber || "—";

  const total =
    Number(order?.total) || 0;

  const status =
    order?.status || "pending";


  // ==========================================
  // STATUS LABEL
  // ==========================================

  const statusLabel =
    status.charAt(0).toUpperCase() +
    status.slice(1);


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
            ORDER NUMBER
        ====================================== */}

        <section className="success-order-card">

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
              <ShoppingBag size={17} />
            </div>

          </div>


          <div className="success-divider" />


          <div className="success-order-info">

            <div>

              <span>
                Total
              </span>

              <strong>
                Rs.{" "}
                {total.toLocaleString()}
              </strong>

            </div>


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
              We're preparing your order
            </strong>

            <p>
              The cafe will update your order
              status as it progresses.
            </p>

          </div>

        </section>


        {/* =====================================
            ACTIONS
        ====================================== */}

        <div className="success-actions">

          <button
            className="success-primary-button"
            onClick={() => navigate("/menu")}
          >
            Order something else
          </button>


          <button
            className="success-secondary-button"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={14} />
            Back to cafe
          </button>

        </div>


        <p className="success-footer">
          Please keep your order number for reference.
        </p>

      </div>

    </main>
  );

}


export default OrderSuccess;