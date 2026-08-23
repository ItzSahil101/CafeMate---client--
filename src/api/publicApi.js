const API_BASE_URL =
  "https://cafe-mate-server.vercel.app/api/public";


// ==========================================
// GET CAFE
// ==========================================

export async function getCafe() {

  const response =
    await fetch(
      `${API_BASE_URL}/cafe`
    );


  const data =
    await response.json();


  if (
    !response.ok ||
    !data.success
  ) {

    throw new Error(
      data.message ||
      "Failed to load cafe information."
    );

  }


  return data.cafe;
}


// ==========================================
// GET MENU
// ==========================================

export async function getMenu() {

  const response =
    await fetch(
      `${API_BASE_URL}/menu`
    );


  const data =
    await response.json();


  if (
    !response.ok ||
    !data.success
  ) {

    throw new Error(
      data.message ||
      "Failed to load menu."
    );

  }


  return data.menu;
}


// ==========================================
// CREATE PUBLIC ORDER
// ==========================================

export async function createOrder(
  orderData
) {

  const response =
    await fetch(
      `${API_BASE_URL}/orders`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            orderData
          ),
      }
    );


  const data =
    await response.json();


  if (
    !response.ok ||
    !data.success
  ) {

    throw new Error(
      data.message ||
      "Failed to create order."
    );

  }


  return data.order;
}

// ==========================================
// GET CUSTOMER ORDER
// ==========================================

export async function getOrder(orderId) {

  const response =
    await fetch(
      `${API_BASE_URL}/orders/${orderId}`
    );


  const data =
    await response.json();


  if (
    !response.ok ||
    !data.success
  ) {

    throw new Error(
      data.message ||
      "Failed to load order."
    );

  }


  return data.order;
}


// ==========================================
// CANCEL CUSTOMER ORDER
// ==========================================

export async function cancelOrder(
  orderId
) {

  const response =
    await fetch(
      `${API_BASE_URL}/orders/${orderId}/cancel`,
      {
        method: "PATCH",
      }
    );


  const data =
    await response.json();


  if (
    !response.ok ||
    !data.success
  ) {

    throw new Error(
      data.message ||
      "Failed to cancel order."
    );

  }


  return data.order;
}