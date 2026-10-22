// Dummy Tag Data
export const TagData = [
  {
    id: '1',
    title: 'My Orders',
    icon: require('../../assets/images/clipboard.png'),
    routeName: 'MyOrdersScreen',
    badgeNeed : false,
  },
  {
    id: '2',
    title: 'Subscriptions',
    icon: require('../../assets/images/cart.png'),
    routeName: 'SubscriptionScreen',
    badgeNeed : false,
  },
  {
    id: '3',
    title: 'Refill',
    icon: require('../../assets/images/ion.png'),
    routeName: 'Refill',
    badgeNeed : false,
  },
  {
    id: '4',
    title: 'Bulk / Event',
    icon: require('../../assets/images/bulk-event.png'),
    routeName: 'BulkRequest',
    badgeNeed: false,
  },
  // NOTE: 'Service' (ServiceRequest) and 'support' (CustomerSupportScreen) were moved OUT of the
  // dashboard quick-actions into Profile → "SERVICES & SUPPORT" (they are help/account actions, not
  // shopping actions). This de-duplicates them (they previously appeared on BOTH Dashboard and Profile).
  // The dashboard keeps only transactional quick-actions: Orders, Subscriptions, Refill, Bulk/Event.
];
