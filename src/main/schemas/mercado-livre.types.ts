export type RefreshTokenType = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  user_id: number;
  refresh_token: string;
};

export type OrdersSearchType = {
  id: number;
  date_created: string;
  date_closed: string;
  last_updated: string;
  manufacturing_ending_date: unknown;
  comment: unknown;
  pack_id: number;
  pickup_id: unknown;
  order_request: {
    return: unknown;
    change: unknown;
  };
  fulfilled: unknown;
  mediations: Array<unknown>;
  total_amount: number;
  paid_amount: number;
  coupon: {
    id: unknown;
    amount: number;
  };
  expiration_date: string;
  order_items: Array<{
    item: {
      id: string;
      title: string;
      category_id: string;
      variation_id: number;
      seller_custom_field: unknown;
      variation_attributes: Array<{
        id: string;
        name: string;
        value_id: string;
        value_name: string;
      }>;
      warranty: string;
      condition: string;
      seller_sku: unknown;
      global_price: unknown;
      net_weight: unknown;
    };
    quantity: number;
    requested_quantity: {
      value: number;
      measure: string;
    };
    picked_quantity: unknown;
    unit_price: number;
    full_unit_price: number;
    currency_id: string;
    manufacturing_days: unknown;
    sale_fee: number;
    listing_type_id: string;
  }>;
  currency_id: string;
  payments: Array<{
    id: number;
    order_id: number;
    payer_id: number;
    collector: {
      id: number;
    };
    card_id: unknown;
    site_id: string;
    reason: string;
    payment_method_id: string;
    currency_id: string;
    installments: number;
    issuer_id: unknown;
    atm_transfer_reference: {
      compunknown_id: unknown;
      transaction_id: unknown;
    };
    coupon_id: unknown;
    activation_uri: unknown;
    operation_type: string;
    payment_type: string;
    available_actions: Array<string>;
    status: string;
    status_code: unknown;
    status_detail: string;
    transaction_amount: number;
    transaction_amount_refunded: number;
    taxes_amount: number;
    shipping_cost: number;
    coupon_amount: number;
    overpaid_amount: number;
    total_paid_amount: number;
    installment_amount: unknown;
    deferred_period: unknown;
    date_approved: string;
    authorization_code: unknown;
    transaction_order_id: unknown;
    date_created: string;
    date_last_modified: string;
  }>;
  shipping: {
    id: number;
  };
  status: string;
  status_detail: unknown;
  tags: Array<string>;
  feedback: {
    buyer: unknown;
    seller: unknown;
  };
  context: {
    channel: string;
    site: string;
    flows: Array<unknown>;
  };
  buyer: {
    id: number;
    nickname: string;
    first_name: string;
    last_name: string;
  };
  seller: {
    id: number;
  };
  taxes: {
    amount: unknown;
    currency_id: unknown;
    id: unknown;
  };
};

export type OrderPackType = {
  shipment: {
    id: number;
  };
  orders: Array<{
    id: number;
  }>;
  id: number;
  status: string;
  status_detail: unknown;
  buyer: {
    id: number;
  };
  date_created: string;
  last_updated: string;
};

export type OrderBillingType = {
  site_id: string;
  buyer: {
    cust_id: string;
    billing_info: {
      name: string;
      last_name: string;
      identification: {
        type: string;
        number: string;
      };
      taxes: {
        taxpayer_type: {
          id: string;
          description: string;
        };
      };
      address: {
        street_name: string;
        street_number: string;
        city_name: string;
        state: {
          code: string;
          name: string;
        };
        zip_code: string;
        country_id: string;
      };
      attributes: {
        vat_discriminated_billing: string;
        doc_type_number: string;
        is_normalized: boolean;
        cust_type: string;
      };
    };
  };
  seller: {
    cust_id: number;
  };
};

export type UsersType = {
  id: number;
  nickname: string;
  registration_date: string;
  country_id: string;
  address: {
    state: string;
    city: string;
  };
  user_type: string;
  tags: Array<string>;
  logo: unknown;
  points: number;
  site_id: string;
  permalink: string;
  seller_reputation: {
    level_id: unknown;
    power_seller_status: unknown;
    transactions: {
      period: string;
      total: number;
      completed: number;
      canceled: number;
      ratings: {
        positive: number;
        negative: number;
        neutral: number;
      };
    };
  };
  buyer_reputation: {
    tags: Array<unknown>;
  };
  status: {
    site_status: string;
  };
};

export type ShipmentsType = {
  id: number;
  external_reference: string;
  status: string;
  substatus: string;
  date_created: string;
  last_updated: string;
  declared_value: number;
  dimensions: {
    height: number;
    width: number;
    length: number;
    weight: number;
  };
  logistic: {
    direction: string;
    mode: string;
    type: string;
  };
  source: {
    site_id: string;
    market_place: string;
    application_id: unknown;
  };
  tracking_number: string;
  origin: {
    type: string;
    sender_id: number;
    shipping_address: {
      id: number;
      address_id: number;
      address_line: string;
      street_name: string;
      street_number: number;
      comment: string;
      zip_code: string;
      city: {
        id: string;
        name: string;
      };
      state: {
        id: string;
        name: string;
      };
      country: {
        id: string;
        name: string;
      };
      neighborhood: {
        id: string;
        name: string;
      };
      municipality: {
        id: string;
        name: string;
      };
      types: {
        default_buying_address: number;
      };
      agency: {
        carrier_id: number;
        agency_id: string;
        description: string;
        phone: string;
        open_hours: string;
      };
      latitude: number;
      longitude: number;
      geolocation_type: string;
      is_valid_for_carrier: boolean;
    };
  };
  destination: {
    type: string;
    receiver_id: number;
    receiver_name: string;
    receiver_phone: string;
    comments: string;
    shipping_address: {
      id: number;
      address_id: number;
      address_line: string;
      street_name: string;
      street_number: number;
      comment: string;
      zip_code: string;
      city: {
        id: string;
        name: string;
      };
      state: {
        id: string;
        name: string;
      };
      country: {
        id: string;
        name: string;
      };
      neighborhood: {
        id: string;
        name: string;
      };
      municipality: {
        id: string;
        name: string;
      };
      types: {
        default_buying_address: number;
      };
      agency: {
        carrier_id: number;
        agency_id: string;
        description: string;
        phone: string;
        open_hours: string;
      };
      latitude: number;
      longitude: number;
      geolocation_type: string;
      is_valid_for_carrier: boolean;
    };
  };
  lead_time: {
    option_id: number;
    shipping_method: {
      id: number;
      type: string;
      name: string;
      deliver_to: string;
    };
    currency_id: string;
    cost: number;
    cost_type: string;
    service_id: number;
    estimated_delivery_time: {
      type: string;
      date: string;
      shipping: number;
      handling: number;
      unit: string;
      offset: {
        date: string;
        shipping: number;
      };
      time_frame: {
        from: number;
        to: number;
      };
      pay_before: string;
    };
  };
  tags: Array<string>;
};
