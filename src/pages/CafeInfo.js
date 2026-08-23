import React, {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock3,
  Utensils,
} from "lucide-react";

import {
  getCafe,
} from "../api/publicApi";

import "./CafeInfo.css";


function CafeInfo() {

  const [cafe, setCafe] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD REAL CAFE
  // ==========================================

  useEffect(() => {

    const loadCafe = async () => {

      try {

        setLoading(true);
        setError("");

        const data =
          await getCafe();

        setCafe(data);

      } catch (error) {

        console.error(
          "Failed to load cafe:",
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


    loadCafe();

  }, []);


  if (loading) {

    return (

      <div className="cafe-info-page">

        <header className="cafe-info-header">

          <Link
            to="/"
            className="cafe-info-back"
          >
            <ArrowLeft size={17} />
            Back
          </Link>

        </header>


        <main className="cafe-info-content">

          <p className="customer-eyebrow">
            ABOUT US
          </p>

          <h1>
            Loading cafe
            <br />
            <span>information...</span>
          </h1>

          <p className="cafe-info-description">
            Getting the latest information
            about the cafe.
          </p>

        </main>

      </div>

    );

  }


  if (error || !cafe) {

    return (

      <div className="cafe-info-page">

        <header className="cafe-info-header">

          <Link
            to="/"
            className="cafe-info-back"
          >
            <ArrowLeft size={17} />
            Back
          </Link>

        </header>


        <main className="cafe-info-content">

          <p className="customer-eyebrow">
            CAFE
          </p>

          <h1>
            Unable to load
            <br />
            <span>cafe information.</span>
          </h1>

          <p className="cafe-info-description">
            {error ||
              "Cafe information is unavailable right now."}
          </p>

          <Link
            to="/menu"
            className="cafe-info-menu-button"
          >
            Explore our menu
          </Link>

        </main>

      </div>

    );

  }


  // ==========================================
  // CAFE DATA
  // ==========================================

  const cafeName =
    cafe.name ||
    "Our Cafe";

  const cafeAddress =
    cafe.address ||
    "Address not available";

  const cafePhone =
    cafe.phone ||
    "Phone not available";

  const cafeOpeningHours =
    cafe.openingHours ||
    "Opening hours not available";


  return (

    <div className="cafe-info-page">


      {/* =====================================
          HEADER
      ====================================== */}

      <header className="cafe-info-header">

        <Link
          to="/"
          className="cafe-info-back"
        >
          <ArrowLeft size={17} />
          Back
        </Link>


        <div className="cafe-info-brand">

          <div className="cafe-info-brand-icon">
            <Utensils size={17} />
          </div>

          <strong>
            {cafeName}
          </strong>

        </div>

      </header>



      {/* =====================================
          CONTENT
      ====================================== */}

      <main className="cafe-info-content">

        <p className="customer-eyebrow">
          ABOUT US
        </p>

        <h1>
          Welcome to
          <br />
          <span>
            {cafeName}.
          </span>
        </h1>


        <p className="cafe-info-description">
          A place for good food, good coffee,
          and good moments. Come in, take a
          seat, and enjoy something made for you.
        </p>



        <div className="cafe-info-grid">


          {/* =================================
              LOCATION
          ================================== */}

          <div className="cafe-info-card">

            <div className="cafe-info-card-icon">
              <MapPin size={18} />
            </div>

            <div>

              <span>
                LOCATION
              </span>

              <h3>
                {cafeAddress}
              </h3>

              <p>
                Visit us at our cafe.
              </p>

            </div>

          </div>



          {/* =================================
              PHONE
          ================================== */}

          <div className="cafe-info-card">

            <div className="cafe-info-card-icon">
              <Phone size={18} />
            </div>

            <div>

              <span>
                CONTACT
              </span>

              <h3>
                {cafePhone}
              </h3>

              <p>
                We're happy to hear from you.
              </p>

            </div>

          </div>



          {/* =================================
              OPENING HOURS
          ================================== */}

          <div className="cafe-info-card">

            <div className="cafe-info-card-icon">
              <Clock3 size={18} />
            </div>

            <div>

              <span>
                OPENING HOURS
              </span>

              <h3 className="cafe-info-hours-value">
                {cafeOpeningHours}
              </h3>

              <p>
                We're open and ready to serve you.
              </p>

            </div>

          </div>

        </div>



        <Link
          to="/menu"
          className="cafe-info-menu-button"
        >
          Explore our menu
        </Link>

      </main>

    </div>

  );

}


export default CafeInfo;