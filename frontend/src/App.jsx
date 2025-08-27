import React, { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./Router/index";
import { Helmet } from "react-helmet"; // Import Helmet for SEO

import ErrorBoundary from "./Error/ErrorBoundary";
import ReactGA from "react-ga4";
import Loader from "./components/Loading";
// import { AuthProvider } from './context/AuthContext';
function App() {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Abyride Transportation and Home Care Service",
    url: "https://yourdomain.com",
    sameAs: [
      "https://www.instagram.com/abyride_transportation/",
      "https://github.com/abyride-transport",
      "https://twitter.com/abyride_transport",
      "https://www.linkedin.com/company/abyride-transport/",
    ],
    image: "./abyride-logo.jpg",
    description:
      "Abyride Transportation and Home Care Service provides reliable transportation and personalized care solutions. Discover our services for individuals and families.",
  };

  return (
    <ErrorBoundary>
      {/* Adding Helmet for SEO optimization */}
      <Helmet>
        <title>Kalinga technology</title>{" "}
        {/* Title for SEO */}
        <meta
          name="description"
          content="Abyride Transportation and Home Care Service offers reliable transportation and compassionate home care services tailored to your needs. Explore our services and solutions."
        />
        <meta
          name="keywords"
          content="Abyride, transportation services, home care, personal care, care solutions, transportation company, home health services, Abyride Transportation"
        />
        <meta
          name="author"
          content="Abyride Transportation and Home Care Service"
        />
        {/* Open Graph metadata for social media sharing */}
        <meta
          property="og:title"
          content="Abyride Transportation and Home Care Service"
        />
        <meta
          property="og:description"
          content="Discover the reliable transportation and home care services offered by Abyride. Learn how we cater to the needs of individuals and families."
        />
        <meta property="og:image" content="./abyride-logo.jpg" />{" "}
        {/* Image for sharing */}
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:type" content="website" />
        {/* Twitter Card metadata */}
        <meta
          name="twitter:title"
          content="Abyride Transportation and Home Care Service"
        />
        <meta
          name="twitter:description"
          content="Explore the exceptional transportation and home care services provided by Abyride."
        />
        <meta name="twitter:image" content="./abyride-logo.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        {/* Structured Data - JSON-LD Schema Markup for enhanced SEO */}
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-F57Y947PR2"
        ></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </script>
        {/* Favicon */}
        <link rel="icon" href="./abyride-logo.jpg" />
        {/* Additional meta tags for mobile optimization */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* Apple touch icon for iPhone */}
        <link rel="apple-touch-icon" href="./abyride-logo.jpg" />
        {/* Theme Color */}
        <meta name="theme-color" content="#00aaff" />
      </Helmet>

      {/* Suspense and ErrorBoundary setup */}
      {/* Auth context for users */}

      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
