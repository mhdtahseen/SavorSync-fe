// MAIN URI
const api_uri = import.meta.env.VITE_API_URI;

// AUTH
const authBase = "auth";
const signup = "auth/signup";
const login = "auth/login";

//RESTAURANT
const restaurantBase = "restaurant";
const addRestaurant = "restaurant/add";

//TABLE
const tables = "tables";

// BILLS
const bill = "bill";
const restaurantBills = "bill/list";

//ANALYTICS
const analytics = "analytics";

export {
  api_uri,
  authBase,
  signup,
  login,
  restaurantBase,
  addRestaurant,
  tables,
  bill,
  restaurantBills,
  analytics,
};
