// Sample recommended products for the consumer dashboard
export const recommendedProducts = [
  {
    id: '1',
    name: 'Organic Rice (Basmati)',
    description: 'Premium quality organic basmati rice, grown without pesticides. Perfect for daily consumption.',
    price: 85,
    image: '/images/farm/crops/rice.jpg',
    seller: {
      id: '101',
      name: 'Patel Organic Farms',
      location: 'Ahmedabad',
      type: 'farmer'
    },
    category: 'grains',
    isOrganic: true,
    rating: 4.8,
    discountPercent: 10
  },
  {
    id: '2',
    name: 'Fresh Seasonal Vegetables Mix',
    description: 'Locally sourced mixed vegetables including tomatoes, potatoes, onions, and green leafy vegetables.',
    price: 120,
    image: '/images/farm/crops/vegetables.jpg',
    seller: {
      id: '102',
      name: 'Green Valley Farms',
      location: 'Surat',
      type: 'farmer'
    },
    category: 'vegetables',
    isOrganic: true,
    rating: 4.5
  },
  {
    id: '3',
    name: 'Wheat Flour (Chakki Atta)',
    description: 'Stone-ground whole wheat flour made from premium wheat grains. No additives or preservatives.',
    price: 45,
    seller: {
      id: '103',
      name: 'Kumar Flour Mills',
      location: 'Vadodara',
      type: 'store_owner'
    },
    category: 'grains',
    isOrganic: false,
    rating: 4.3
  },
  {
    id: '4',
    name: 'Pure Honey',
    description: 'Raw, unfiltered honey collected from wild flower farms. 100% pure and natural.',
    price: 220,
    seller: {
      id: '104',
      name: 'Natural Apiaries',
      location: 'Rajkot',
      type: 'farmer'
    },
    category: 'honey',
    isOrganic: true,
    rating: 4.9,
    discountPercent: 5
  },
  {
    id: '5',
    name: 'Cold Pressed Groundnut Oil',
    description: 'Traditional cold-pressed groundnut oil with natural flavor and nutrition preserved.',
    price: 180,
    seller: {
      id: '105',
      name: 'Traditional Oil Press',
      location: 'Jamnagar',
      type: 'store_owner'
    },
    category: 'oils',
    isOrganic: true,
    rating: 4.7
  },
  {
    id: '6',
    name: 'Farm Fresh Eggs',
    description: 'Free-range chicken eggs from ethically raised birds fed on organic feed.',
    price: 85,
    seller: {
      id: '106',
      name: 'Happy Hens Farm',
      location: 'Anand',
      type: 'farmer'
    },
    category: 'poultry',
    isOrganic: true,
    rating: 4.6
  },
  {
    id: '7',
    name: 'Organic Turmeric Powder',
    description: 'High-curcumin turmeric powder made from organically grown turmeric roots.',
    price: 75,
    seller: {
      id: '107',
      name: 'Spice Garden',
      location: 'Gandhinagar',
      type: 'farmer'
    },
    category: 'spices',
    isOrganic: true,
    rating: 4.8,
    discountPercent: 15
  },
  {
    id: '8',
    name: 'Fresh Seasonal Fruits Basket',
    description: 'Assorted seasonal fruits including apples, bananas, and locally grown varieties.',
    price: 250,
    seller: {
      id: '108',
      name: 'Fruit Paradise Farms',
      location: 'Bhuj',
      type: 'farmer'
    },
    category: 'fruits',
    isOrganic: false,
    rating: 4.4
  }
];

// Sample seasonal products
export const seasonalProducts = [
  {
    id: '21',
    name: 'Fresh Mango (Kesar)',
    description: 'Farm-fresh Kesar mangoes, known for their sweet taste and golden color.',
    price: 150,
    image: '/images/farm/crops/mango.jpg',
    seller: {
      id: '109',
      name: 'Mango Haven Farms',
      location: 'Junagadh',
      type: 'farmer'
    },
    category: 'fruits',
    isOrganic: true,
    rating: 4.9,
    discountPercent: 0
  },
  {
    id: '22',
    name: 'Watermelon',
    description: 'Juicy and refreshing watermelons, perfect for summer hydration.',
    price: 60,
    seller: {
      id: '110',
      name: 'Summer Fruits Co.',
      location: 'Mehsana',
      type: 'farmer'
    },
    category: 'fruits',
    isOrganic: false,
    rating: 4.3
  },
  {
    id: '23',
    name: 'Green Chillies',
    description: 'Freshly harvested green chillies, perfect for spicing up your summer dishes.',
    price: 30,
    seller: {
      id: '111',
      name: 'Spice Fields',
      location: 'Patan',
      type: 'farmer'
    },
    category: 'vegetables',
    isOrganic: true,
    rating: 4.4
  },
  {
    id: '24',
    name: 'Tender Coconut',
    description: 'Young, sweet coconuts with refreshing water - nature\'s perfect summer drink.',
    price: 40,
    seller: {
      id: '112',
      name: 'Coastal Farms',
      location: 'Porbandar',
      type: 'farmer'
    },
    category: 'fruits',
    isOrganic: true,
    rating: 4.7
  }
];

// Sample shopping cart
export const cartItems = [
  {
    id: '1',
    name: 'Organic Rice (Basmati)',
    price: 85,
    quantity: 2,
    image: '/images/farm/crops/rice.jpg',
    seller: {
      id: '101',
      name: 'Patel Organic Farms',
      location: 'Ahmedabad',
      type: 'farmer'
    },
    discountPercent: 10
  },
  {
    id: '7',
    name: 'Organic Turmeric Powder',
    price: 75,
    quantity: 1,
    seller: {
      id: '107',
      name: 'Spice Garden',
      location: 'Gandhinagar',
      type: 'farmer'
    },
    discountPercent: 15
  }
];

// Sample order history
export const orderHistory = [
  {
    id: 'ORD123456',
    date: '2023-06-15',
    status: 'Delivered',
    total: 430,
    items: [
      {
        id: '1',
        name: 'Organic Rice (Basmati)',
        price: 85,
        quantity: 2
      },
      {
        id: '4',
        name: 'Pure Honey',
        price: 220,
        quantity: 1
      },
      {
        id: '7',
        name: 'Organic Turmeric Powder',
        price: 75,
        quantity: 1
      }
    ]
  },
  {
    id: 'ORD123457',
    date: '2023-05-28',
    status: 'Delivered',
    total: 370,
    items: [
      {
        id: '2',
        name: 'Fresh Seasonal Vegetables Mix',
        price: 120,
        quantity: 1
      },
      {
        id: '5',
        name: 'Cold Pressed Groundnut Oil',
        price: 180,
        quantity: 1
      },
      {
        id: '3',
        name: 'Wheat Flour (Chakki Atta)',
        price: 45,
        quantity: 2
      }
    ]
  },
  {
    id: 'ORD123458',
    date: '2023-05-10',
    status: 'Delivered',
    total: 520,
    items: [
      {
        id: '8',
        name: 'Fresh Seasonal Fruits Basket',
        price: 250,
        quantity: 1
      },
      {
        id: '5',
        name: 'Cold Pressed Groundnut Oil',
        price: 180,
        quantity: 1
      },
      {
        id: '6',
        name: 'Farm Fresh Eggs',
        price: 85,
        quantity: 2
      }
    ]
  }
]; 