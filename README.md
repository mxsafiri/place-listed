This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# PlaceListed

### **Ethos & Vision of PlaceListed**  
PlaceListed is a **business discovery platform** built for small and SME business, helping small businesses become digitally discoverable without needing a website. The platform **empowers SMEs by offering them an online presence, AI-driven branding tools, and SEO optimization**—all at an affordable cost. 

Many world wide and i.e African businesses struggle with digital visibility due to **high costs and technical barriers**. PlaceListed solves this by **providing each business with a dedicated, SEO-optimized profile page** that ranks on Google, enabling easy discovery through search. 

### **Project Scope & Features**  

#### **Tech Stack**
- **Frontend:** Next.js (React) for web, React Native (Expo) for mobile  
- **Backend:** Firebase (Firestore, Authentication, Cloud Functions)  
- **Styling:** Tailwind CSS  
- **Search Engine:** Firestore + Algolia for fast business searches  
- **Hosting:** Vercel (frontend), Firebase (backend)  

#### **Core Features**  
1️⃣ **User Authentication**  
- Sign in via Google, Facebook, Email/Password  
- Allow users to **claim and manage business listings**  
- Secure authentication with Firebase Auth (JWT-based)  

2️⃣ **Business Listings & Profiles**  
- **Business profile page** with name, logo, category, description, contact info, images  
- **User reviews & ratings** to improve credibility  
- AI-generated SEO descriptions to enhance search visibility  

3️⃣ **Search & Discovery**  
- Full-text search using **Algolia + Firestore**  
- Search filters: **Location, Category, Ratings, Open Now**  
- Trending & featured businesses section  

4️⃣ **AI-powered Business Assistant**  
- Chatbot to help businesses improve their digital presence  
- AI-powered recommendations for branding & marketing  
- Automated SEO optimizations for better Google ranking  

5️⃣ **Monetization Features**  
- **Freemium model**: Free listings, paid promotions for premium visibility  
- Paid **ads & lead generation** for businesses  

6️⃣ **UI/UX Design**  
- Simple, intuitive, and easy-to-use design inspired by **Yelp**  
- Homepage with a **search bar & featured businesses**  
- Business profile pages with a **card-based layout**  

7️⃣ **Security & Optimization**  
- **Role-based access control** for business owners & users  
- **CDN & caching** for fast performance  
- **Firebase security rules** to protect data  

8️⃣ **Deployment & Scaling**  
- Host **frontend on Vercel**, backend on **Firebase Functions**  
- Enable scalability through Firebase's infrastructure

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Firebase account
- Vercel account (for deployment)

### Environment Variables
Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_API_KEY=your_algolia_api_key
```

### Installation
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Deployment
The application is set up for deployment with Vercel for the frontend and Firebase for the backend services.

### Vercel Deployment
1. Push your code to GitHub
2. Connect your Vercel account to your GitHub repository
3. Configure environment variables in Vercel dashboard
4. Deploy

### Firebase Deployment
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase: `firebase init`
4. Deploy Firebase functions: `firebase deploy --only functions`

## License
[MIT](https://choosealicense.com/licenses/mit/)
