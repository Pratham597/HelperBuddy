# 🛠️ HelperBuddy - Your Trusted Home Service Partner  

HelperBuddy is a **household services platform** that connects users with verified professionals for **AC installation, fan repair, refrigerator servicing, and more**. We ensure **secure bookings, seamless payments, and reliable service professionals** to make home maintenance hassle-free.  

---

## 🚀 Features  

### ✅ **User Features**  
- **Quick & Easy Booking** – Select services, schedule a time, and confirm effortlessly.  
- **Secure Payment Options** – Pay via **Online Payment, Wallet, or Cash on Delivery (COD)**.  
- **OTP-Based Service Verification** – Like Uber, we ensure security with an **OTP verification process before service starts**.  
- **Referral Program** – Share your referral code and **earn ₹100 bonus in your wallet**.  
- **Order Tracking & Status Updates** – Track ongoing and completed service orders.  
- **Customer Support** – Directly contact support for queries and complaints.  

### 👨‍🔧 **Partner Features**  
- **Service Analytics Dashboard** – View **total completed orders, earnings, pending orders, and ratings**.  
- **Real-time Order Notifications** – Get notified when a new service request is assigned.  
- **Pincode-based Service Allocation** – Partners receive jobs based on their preferred locations.  

### 🔐 **Admin Features**  
- **Manage Users, Partners & Services** – Approve service providers, update services, and handle disputes.  
- **Blog Management** – Publish and edit blogs to educate users.  
- **Analytics & Reports** – Track revenue, order trends, and service demand.  

---

## 🛠️ Tech Stack  

### **Frontend:**  
- **Next.js** – Modern React framework for SEO-optimized and fast-loading UI.  
- **Tailwind CSS** – Sleek and responsive UI design.  

### **Backend:**  
- **Next.js** – Robust backend handling APIs and business logic.  
- **MongoDB & Mongoose** – NoSQL database for scalable data management.  
- **JSON Web Tokens (JWT) & `jose`** – Secure authentication & authorization.  

### **Payments & Deployment:**  
- **Razorpay** – Secure and seamless online payments.  
- **Vercel & Render** – Deployment for frontend and backend services.  

---

## 🔌 API Endpoints  

### **User APIs**  
- `POST /api/auth/register` – Register a new user.  
- `POST /api/auth/login` – Login user and receive a token.  
- `GET /api/orders` – Fetch user’s order history.  

### **Partner APIs**  
- `GET /api/partner/orders` – View assigned service orders.  
- `PATCH /api/partner/order/:id/complete` – Mark an order as completed.  
- `GET /api/partner/analytics` – Fetch **earnings, completed & pending jobs, and ratings**.  

### **Admin APIs**  
- `POST /api/admin/add` – Create a new admin (requires Bearer Token authentication).  
- `PATCH /api/admin/update-blog-author` – Update all blog authors to the main admin.  

---

## 💰 Payment & Wallet System  
- **Online Payment via Razorpay**  
- **Wallet Balance Deduction + Online Payment Option**  
- **Referral Bonus (₹100 on sharing code)**  
- **Order History with Payment Details**  

---

## 🔍 Installation & Setup  

### **Clone the Repository**  
```bash
git clone https://github.com/yourusername/HelperBuddy.git
cd HelperBuddy
