# Caffein Cafe Ordering System

## Product Vision

Caffein Cafe Ordering System is a production-oriented QR ordering and point-of-sale platform for restaurants and cafes. It must be simple enough for a non-technical owner to operate without using the Firebase Console.

Production: https://caffein-cafe-ordering.vercel.app/

## Technology

- React with Vite
- React Router
- Tailwind CSS
- Firebase Firestore and Storage
- Vercel

## Application Areas

### Customer

QR scan -> mobile number -> menu -> cart -> order -> confirmation. The customer flow is operational.

### Staff / Cashier

Current: live tables, order viewing, and table closing.

Planned: discounts, bill calculation and printing, reopening tables, and operational analytics. Cashiers should only see operational screens.

### Administration

Current: dashboard, Menu Studio, category grouping, product editing, availability, promotional flags, and archiving.

Current priority:

1. Firebase Storage product images
2. Better product cards
3. Archived-product filtering and restoration
4. Complete menu import
5. Restaurant setup, table generation, QR codes, and printable QR PDFs

## Menu Data Model

Firestore collection: `Menu`

```js
{
  Name: "",
  Category: "",
  Price: 0,
  Description: "",
  Image: "",
  Available: true,
  BestSeller: false,
  TodaysSpecial: false,
  Archived: false,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

Firebase Storage contains product image files. Firestore stores only download URLs.

## Engineering Rules

- Build production-quality, maintainable code.
- Prefer small reusable components and focused services.
- Avoid temporary implementations, placeholder behavior, and console-only workflows.
- Keep daily operations inside the admin interface.
- Validate input and uploaded files.
- Provide clear loading, success, empty, and error states.
- Preserve compatibility with existing Firestore documents.
- Store secrets only in environment variables.
- Do not repeatedly redesign an established module.
- Add Firebase Security Rules and role-based access before onboarding real restaurants.

## SaaS Architecture Direction

Before serving multiple businesses, all restaurant-owned documents and Storage objects must be scoped by a stable `restaurantId`. Authentication, roles, Firestore rules, Storage rules, audit fields, and tenant-aware queries are required before the product is commercially multi-tenant.

## Roadmap

### Phase 1

- Finish Menu Studio and import the Caffein Cafe menu
- Restaurant setup
- Generate tables, QR codes, and printable QR PDFs
- Discounts and bill printing

### Phase 2

- Analytics and kitchen display
- Authentication and staff roles
- Coupons, taxes, and restaurant settings
- Dark mode

## Definition of Done

A feature is complete when the full flow works without Firebase Console intervention, states and failures are handled, data is validated, existing flows remain compatible, and the production build succeeds.