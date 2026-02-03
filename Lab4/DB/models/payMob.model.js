import { Schema, mongoose } from "mongoose";

const payMobSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  payment_methods: { type: Array },
  items: { type: Array },
  billing_data: {
    apartment: {
      type: String,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    street: {
      type: String,
    },
    building: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    country: {
      type: String,
    },
    email: {
      type: String,
    },
    floor: {
      type: String,
    },
    state: {
      type: String,
    },
  },
  customer: {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
    },
    extras: {
      type: Object,
    },
  },
  extras: {
    type: Object,
  },
});

export const PayMob = mongoose.model("PayMob", payMobSchema);
