import moment from "moment";

const formatDateTime = (dateString) => {
  const date = moment(dateString);
  const today = moment().startOf("day");

  if (date.isSame(today, "day")) {
    return { time: date.format("hh:mm A") };
  } else {
    return {
      date: date.format("DD MMM YYYY"),
      time: date.format("hh:mm A"),
    };
  }
};

function formatDateWithContext(isoDate: string): string {
  const date = moment(isoDate);
  const now = moment();

  if (date.isSame(now, "day")) {
    return `Today, ${date.format("hh:mm:ss A")}`;
  } else if (date.isSame(moment().subtract(1, "day"), "day")) {
    return `Yesterday, ${date.format("hh:mm:ss A")}`;
  } else {
    return `${date.format("dddd")}, ${date.format("hh:mm:ss A")}`;
  }
}

const assignLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
  sessionStorage.setItem(key, value);
};

const transformMenuItems = (items) => {
  // Validate that the input is an array
  if (!Array.isArray(items)) {
    throw new Error("Input must be an array");
  }

  // Transform each item in the array
  return items.map((item) => {
    // Ensure the 'menu_id' exists and has an '_id' property
    if (!item.menu_id || !item.menu_id._id) {
      throw new Error(
        "Invalid menu_id: Each item must have a valid 'menu_id' with an '_id'."
      );
    }

    // Return the transformed object
    return {
      menu_id: item.menu_id._id, // Keep only the _id
      quantity: item.quantity, // Keep the quantity unchanged
    };
  });
};

export {
  assignLocalStorage,
  transformMenuItems,
  formatDateTime,
  formatDateWithContext,
};
