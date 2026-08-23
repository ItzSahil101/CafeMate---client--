import React from "react";

import {
  ArrowUpRight,
  Heart,
  Utensils,
  Sparkles,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import "./CustomerFooter.css";


function CustomerFooter() {

  return (

    <footer className="customer-cm-footer">

      {/* ==========================================
          BACKGROUND EFFECTS
      =========================================== */}

      <div className="customer-cm-footer-glow customer-cm-footer-glow-one" />

      <div className="customer-cm-footer-glow customer-cm-footer-glow-two" />


      <div className="customer-cm-footer-container">


        {/* ==========================================
            MAIN HERO
        =========================================== */}

        <div className="customer-cm-footer-hero">


          {/* LEFT */}

          <div className="customer-cm-footer-content">

            <div className="customer-cm-footer-badge">

              <span className="customer-cm-footer-badge-dot" />

              POWERED BY CAFEMATE

            </div>


            <h2 className="customer-cm-footer-title">

              Your cafe.
              <br />

              <span>
                Smarter than ever.
              </span>

            </h2>


            <p className="customer-cm-footer-description">

              This ordering experience is powered by
              CafeMate — smart tools built to help
              modern cafes serve better, faster and
              simpler.

            </p>


            <a
              href="https://comingsoon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="customer-cm-footer-cta"
            >

              Get CafeMate for your cafe

              <ArrowUpRight size={14} />

            </a>

          </div>



          {/* RIGHT PRODUCT CARD */}

          <div className="customer-cm-footer-product">

            <div className="customer-cm-footer-product-card">


              {/* TOP */}

              <div className="customer-cm-footer-product-top">

                <div className="customer-cm-footer-product-logo">

                  <Utensils size={18} />

                </div>


                <div>

                  <strong>
                    CafeMate
                  </strong>

                  <span>
                    Cafe automation platform
                  </span>

                </div>

              </div>



              {/* DIVIDER */}

              <div className="customer-cm-footer-product-line" />



              {/* FEATURES */}

              <div className="customer-cm-footer-product-features">

                <div>

                  <Sparkles size={13} />

                  <span>
                    Smart ordering
                  </span>

                </div>


                <div>

                  <Sparkles size={13} />

                  <span>
                    Cafe management
                  </span>

                </div>


                <div>

                  <Sparkles size={13} />

                  <span>
                    Built for growth
                  </span>

                </div>

              </div>



              {/* FLOATING LABEL */}

              <div className="customer-cm-footer-floating">

                <span />

                Built for cafes

              </div>

            </div>

          </div>

        </div>



        {/* ==========================================
            DIVIDER
        =========================================== */}

        <div className="customer-cm-footer-divider" />



        {/* ==========================================
            LOWER BRAND BAR
        =========================================== */}

        <div className="customer-cm-footer-bottom">


          {/* BRAND */}

          <div className="customer-cm-footer-brand">

            <div className="customer-cm-footer-brand-icon">

              <Utensils size={14} />

            </div>


            <div>

              <strong>
                CafeMate
              </strong>

              <span>
                Smart cafe technology
              </span>

            </div>

          </div>



          {/* LINKS */}

          <nav className="customer-cm-footer-links">

            <Link to="/">
              Home
            </Link>

            <Link to="/menu">
              Menu
            </Link>

            <Link to="/cafe">
              Cafe
            </Link>

            <Link to="/orders">
              Orders
            </Link>

          </nav>



          {/* DEVELOPER */}

          <div className="customer-cm-footer-credit">

            <span>
              Developed by
            </span>

            <strong>
              Sahil Jogi
            </strong>

            <Heart size={10} />

          </div>

        </div>



        {/* ==========================================
            COPYRIGHT
        =========================================== */}

        <div className="customer-cm-footer-copyright">

          <span>
            © {new Date().getFullYear()} CafeMate.
            All rights reserved.
          </span>


          <span className="customer-cm-footer-status">

            <span className="customer-cm-footer-status-dot" />

            CafeMate powered experience

          </span>

        </div>


      </div>

    </footer>

  );

}


export default CustomerFooter;