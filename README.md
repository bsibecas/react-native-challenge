# 📄 README: In-Flight POS System

This project is a Mobile Payment Flow for managing product selection, applying dynamic discounts, currency conversion, and processing payments (cash/card) in a mobile environment.

-----

## 🚀 Project Setup and How to Run It

This project is built using **React Native** and the **Expo** framework.

### Prerequisites

1.  **Node.js** 
2.  **npm** or **Yarn** (npm is used in the commands below)
3.  **Expo Go** app installed on your physical mobile device (iOS/Android) or simulator/emulator.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [your-repo-link]
    cd [your-project-folder]
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

### Running the Application

1.  **Start the Expo Development Server:**

    ```bash
    npx expo start
    ```

2.  **Access the App:**

      * **Simulator/Emulator:** Press `i` for iOS or `a` for Android in the terminal.
      * **Physical Device:** Scan the QR code displayed in the terminal or browser with the **Expo Go** app.

-----

## 📐 Architecture Decisions and Trade-offs

The application follows a standard React Native component-based architecture with several key design decisions:

### 1\. State Management: React Context (`useCart`)

  * **Decision:** Global state (cart contents, product list) is managed using React's built-in **Context API** via the custom hook `useCart`.
  * **Trade-off:** This is a simple, dependency-free solution suitable for a small-to-medium application without the overhead of external libraries (like Redux). It may lead to more frequent component re-renders compared to optimized state libraries.

### 2\. Logic Separation and DRY Principle

  * **Decision:** Business logic for pricing (dynamic discounts and currency conversion) is centralized in a utility file (`utils/pricing.ts`).
  * **Benefit:** This ensures that the total displayed on the main screen and the total calculated on the payment screen are always **consistent** (Single Source of Truth), adhering to the **DRY** (Don't Repeat Yourself) principle.

### 3\. Navigation and Data Passing

  * **Decision:** **Expo Router** is used for file-system-based routing. Runtime settings that change globally (`currency`, `rates`, `customerType`) are passed via URL `params`.
  * **Trade-off:** Passing complex objects like `rates` requires **serializing** them (`JSON.stringify`) before passing and **deserializing** them (`JSON.parse`) on the receiving screen, which adds minor complexity but maintains state consistency.

## 🧪 How to Run Tests

There are currently no automated tests defined.  

## ⛔ Assumptions and Known Limitations

### Assumptions

1.  **Base Currency:** All product prices stored in the backend/mock API are assumed to be in **USD**. All conversions start from USD.
2.  **Currency API:** The `fetchLatestRates` function is assumed to be working and returning valid exchange rates.
3.  **Payment Simulation:** Payment forms are **simulated**. The `handlePaymentSuccess` function only updates the local stock and clears the cart, without involving a real payment gateway.

### Known Limitations

1.  **Asynchronous Rates Discrepancy:** If the user navigates from the product list to the payment screen immediately before the `fetchLatestRates` call completes, the payment screen might temporarily use the **default/stale rates**, leading to a minor price discrepancy until the rates update via parameters.
2.  **No Persistent Stock Update:** The application loads product data from a static, read-only public JSON repository. Consequently, the updateProductStock function only modifies the stock locally (in the app's state). It cannot persist changes to the external data source via PATCH/PUT.
3.  **Limited Error Handling:** The application lacks robust UI feedback or recovery mechanisms for API failures during the initial product load.

### Future Improvements

1.  Add automated tests (unit + integration).
2.  Integrate real payment provider (Stripe, PayPal, etc.).
3.  Add analytics (Mixpanel or Firebase Analytics).
4.  Improve offline support and caching.