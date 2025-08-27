/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { Children, lazy, Suspense } from "react";



// Lazy-load all components
const PortfolioManage = lazy(
  () => import("../components/service/PortfolioManage.jsx"),
);
const TeamLeadership = lazy(
  () => import("../components/service/TeamLeadership.jsx"),
);
const MarketResearch = lazy(
  () => import("../components/service/MarketResearch.jsx"),
);
const ExecutiveSearch = lazy(
  () => import("../components/service/ExecutiveSearch.jsx"),
);

const AboutUs = lazy(() => import("../views/AboutUs.jsx"));

const PaymentSuccess = lazy(() => import("../views/requestRide/PaymentSuccess.jsx"));
const PaymentFailed = lazy(() => import("../views/requestRide/PaymentFailed.jsx"));
const ReservationPendingPage = lazy(() => import("../views/requestRide/ReservationPendingPage.jsx"));
const ApplicationPendingPage = lazy(() => import("../views/DriverProcess/Auth/driverApply/ApplicationPending.jsx"));

const Blog = lazy(() => import("../views/Blog.jsx"));
const BlogDetails = lazy(
  () => import("../components/BogDetails/BlogDetails.jsx"),
);
const Fleet = lazy(() => import("../views/Fleet.jsx"))
const History = lazy(() => import("../views/History.jsx"));
const ContactUs = lazy(() => import("../views/ContactUs"));
const Team = lazy(() => import("../views/Team"));
const Service = lazy(() => import("../views/Service"));
const Home = lazy(() => import("../views/Home.jsx"));
const Faq = lazy(() => import("../views/Faq.jsx"));
const Pricing = lazy(() => import("../views/Pricing.jsx"));
const LandingLayout = lazy(() => import("../layouts/LandingLayout"));
const ErrorLayout = lazy(() => import("../Error/ErrorLayout"));
const SignInOptions = lazy(() => import("../views/userSign.jsx"));
const TermsAndConditions = lazy(() => import("../views/TermsAndConditions.jsx"))
const PrivacyPolicy = lazy(() => import("../views/PrivacyPolicy.jsx"));
const Copyright = lazy(() => import("../views/CopyrightPage.jsx"));
const Product = lazy(()=> import("../views/Product.jsx"))

const Activity = lazy(() => import("../views/Activity.jsx"));

// Reusable Loader Component
import Loader from "../components/Loading.jsx";
import DriverLayout from "../layouts/DriverLayout.jsx";
import ClientsAuthLayout from "../layouts/Clients/ClientsAuthLayout.jsx";
import ClientLogin from "../views/ClientProcess/Auth/ClientLogin.jsx";
import DriverApply from "../views/DriverProcess/Auth/driverApply/driverApply.jsx";
import LockScreen from "../views/Dispatch/dashboard/Lockscreen.jsx";
import ReservationManagement from "../views/Dispatch/dashboard/ReservationManagement.jsx";
import ReservationDetailManagement from "../views/Dispatch/dashboard/ReservationManagementDetails.jsx";
import SummaryPage from "../views/Dispatch/dashboard/SummaryPage.jsx";
import DriverProtectedLayout from "../layouts/Driver/DriverProtectedLayout.jsx";
import DriverSummaryDashboard from "../views/DriverProcess/Dashboard/DriverSummary.jsx";
import DriverProfile from "../views/DriverProcess/Auth/DriverProfile.jsx";
import DriverReservation from "../views/DriverProcess/Dashboard/DriverReservation.jsx";
import DriverReservationDetail from "../views/DriverProcess/Dashboard/DriverReservationDetail.jsx";
import ClientProtectedLayout from "../layouts/Clients/ClientProtectedRouter.jsx";
import ClientProtectedRouter from "../layouts/Clients/ClientProtectedRouter.jsx";
import FeeSettingManagement from "../views/Dispatch/dashboard/FeeSettingsManagement.jsx";
import MemberRegistrationForm from "../views/Member/auth/MemeberRegistration.jsx";
import TaskManagement from "../views/Dispatch/dashboard/TaskManagement.jsx";
import EmployeeManagement from "../views/Dispatch/dashboard/EmployeeManagement.jsx";
import LocationManagement from "../views/Dispatch/dashboard/LocationManagement.jsx";
import GeneralLayout from "../layouts/Dispatch/GeneralLayout.jsx";
import UserManagementLayout from "../layouts/Dispatch/UserManagement.jsx";

import UserMangementHomePage from "../views/Dispatch/dashboard/general/UserMangementHomePage.jsx";
import CustomerManagement from "../views/Dispatch/dashboard/general/CustomerManagementPage.jsx";
import MemberManagement from "../views/Dispatch/dashboard/MemberManagement.jsx";
import ExploreLocation from "../views/ExploreLocation.jsx";
import FoundPropertiesManagement from "../views/Dispatch/dashboard/general/FoundPropertiesManagement.jsx";
import FoundPropertyViewMore from "../views/Dispatch/dashboard/general/FoundPropertyViewMore.jsx";
import FoundPropertiesPage from "../views/FoundPropertiesPage.jsx";
import LostPropertiesManagement from "../views/Dispatch/dashboard/general/LostProperties.jsx";
import LostPropertyPage from "../views/LostProperty.jsx";
import ReservationFormDipatch from "../views/Dispatch/dashboard/ReservationDipatch.jsx";
import BookingManagement from "../views/Dispatch/dashboard/reservation/BookingManagement.jsx";
import ReservationView from "../views/Dispatch/dashboard/reservation/ReservationViewMore.jsx";
import DashboardOverview from "../views/Dispatch/dashboard/DashboardHome.jsx";

// import suspsense driver component section

const DriverLogin = lazy(
  () => import("../views/DriverProcess/Auth/DriverLogin.jsx"),
);




const ReservationForm = lazy(() => import('../views/requestRide/ReservationForm.jsx'));
const ReservationCanceledPage = lazy(() => import('../views/requestRide/ReservationCanceled.jsx'));
const ReservationRatingPage = lazy(() => import('../views/requestRide/Rate-driver.jsx'));
const DeclareLostItemPage = lazy(() => import('../views/requestRide/Declare-lost-item.jsx'));

const DashboardMainLayout = lazy(() => import('../layouts/Dispatch/DashboardMainLayout.jsx'));
const DashboardLayout = lazy(() => import('../layouts/Dispatch/DashboardLayout.jsx'));
const DashboardAuthLayout = lazy(() => import('../layouts/Dispatch/DashboardAuthLayout.jsx'));
const DashboardProtectedLayout = lazy(() => import('../layouts/Dispatch/DashboardProtectedLayout.jsx'));
const Profile = lazy(() => import("../views/Dispatch/dashboard/Profile.jsx"));
const ClientProfile = lazy(() => import("../views/ClientProcess/Auth/ClientProfile.jsx"));


// driver dashboard
const DriverMainLayout = lazy(() => import("../layouts/Driver/DriverDashboardLayout.jsx"));
const ClientMainLayout = lazy(() => import("../layouts/Clients/ClientDashboardLayout.jsx"));


const DashboardLogin = lazy(() => import('../views/Dispatch/Login.jsx'));
const DriverManagement = lazy(() => import('../views/Dispatch/dashboard/DriverManagement.jsx'));
const DriverManagementDetail = lazy(() => import("../views/Dispatch/dashboard/DriverManagementDetail.jsx"));
const VehicleManagement = lazy(() => import('../views/Dispatch/dashboard/VehicleManagement.jsx'));
const VehicleManagementDetail = lazy(() => import('../views/Dispatch/dashboard/VehicleManagementDetail.jsx'));
const FeeManagement = lazy(() => import("../views/Dispatch/dashboard/FeeManagement.jsx"));
const ContactMessages = lazy(() => import("../views/Dispatch/dashboard/ContactMessageManagement"));
const LostPropertyManagement = lazy(() => import("../views/Dispatch/dashboard/LostProperty.jsx"));
const FoundPropertyManagement = lazy(() => import("../views/Dispatch/dashboard/FoundProperty.jsx"));
const ComplaintManagement = lazy(() => import("../views/Dispatch/dashboard/Compliant.jsx"));
const BlogManagement = lazy(() => import("../views/Dispatch/dashboard/BlogManagement.jsx"));
const BlogViewModal = lazy(()=>import("../components/Dispatch/dashboard/blog/ViewModal.jsx"));
const ProductManagement = lazy(()=>import("../views/Dispatch/ProductManagment.jsx"));
const ProductViewPage = lazy(()=>import("../components/Dispatch/dashboard/product/ProductViewModal.jsx"));
const ProductDetails =lazy(()=>import("../views/ProductDetails.jsx"));

const MessagingPhoneManagement = lazy(() => import("../views/Dispatch/dashboard/SendMessagePage.jsx"));
const MessagingEmailManagement = lazy(() => import("../views/Dispatch/dashboard/SendEmailMessage.jsx"));




const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<Loader />}>{children}</Suspense>
);

// Define routes
const routes = [
  {
    path: "/",
    element: (
      <SuspenseWrapper>
        <LandingLayout />
      </SuspenseWrapper>
    ),

    children: [
      {
        path: "",
        element: (
          <SuspenseWrapper>
            <Home />
          </SuspenseWrapper>
        ),
      },

      {
        path: "blog",
        element: (
          <SuspenseWrapper>
            <Blog />
          </SuspenseWrapper>
        ),
      },
      {
        path: "payment-success",
        element: (
          <SuspenseWrapper>
            <PaymentSuccess />
          </SuspenseWrapper>
        ),

      },
      {
        path: "payment-failed",
        element: (
          <SuspenseWrapper>
            <PaymentFailed />
          </SuspenseWrapper>
        ),
      },
      {
        path: "reservation-pending",
        element: (
          <SuspenseWrapper>
            <ReservationPendingPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "application-pending",
        element: (
          <SuspenseWrapper>
            <ApplicationPendingPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "reservation-canceling/:id",
        element: (
          <SuspenseWrapper>
            <ReservationCanceledPage />
          </SuspenseWrapper>
        )
      },
      {
        path: "rate-driver/:id",
        element: (
          <SuspenseWrapper>
            <ReservationRatingPage />
          </SuspenseWrapper>
        )
      },
      {
        path: "declare-lost-item/:id",
        element: (
          <SuspenseWrapper>
            <DeclareLostItemPage />
          </SuspenseWrapper>
        )
      },
      {
        path: "blog/:id",
        element: (
          <Suspense>
            <BlogDetails />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <SuspenseWrapper>
            <AboutUs />
          </SuspenseWrapper>
        ),
      },
      {
        path: "product",
        element: (
          <SuspenseWrapper>
            <Product />
          </SuspenseWrapper>
        ),
      },
      {
        path: "product/:id",
        element: (
          <SuspenseWrapper>
            <ProductDetails />
          </SuspenseWrapper>
        ),
      },

      {
        path: "contact-us",
        element: (
          <SuspenseWrapper>
            <ContactUs />
          </SuspenseWrapper>
        ),
      },
      {
        path: "found-properties",
        element: (
          <SuspenseWrapper>
            <FoundPropertiesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "lost-property",
        element: (
          <SuspenseWrapper>
            <LostPropertyPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "fleet",
        element: (
          <SuspenseWrapper>
            <Fleet />
          </SuspenseWrapper>
        ),
      },
      {
        path: "joinUs",
        element: (
          <SuspenseWrapper>
            <SignInOptions />
          </SuspenseWrapper>
        ),
      },

      {
        path: "team",
        element: (
          <SuspenseWrapper>
            <Team />
          </SuspenseWrapper>
        ),
      },
      {
        path: "faq",
        element: (
          <SuspenseWrapper>
            <Faq />
          </SuspenseWrapper>
        ),
      },
      {
        path: "history",
        element: (
          <SuspenseWrapper>
            <History />
          </SuspenseWrapper>
        ),
      },
      {
        path: "terms-and-conditions",
        element: (
          <SuspenseWrapper>
            <TermsAndConditions />
          </SuspenseWrapper>
        ),
      },
     
      {
        path: "privacy-policy",
        element: (
          <SuspenseWrapper>
            <PrivacyPolicy />
          </SuspenseWrapper>
        ),
      },
      {
        path: "copyright",
        element: (
          <SuspenseWrapper>
            <Copyright />
          </SuspenseWrapper>
        ),
      },
      {
        path: "pricing",
        element: (
          <SuspenseWrapper>
            <Pricing />
          </SuspenseWrapper>
        ),
      },

      {
        path: '/location',
        element: <SuspenseWrapper>
          <ExploreLocation />
        </SuspenseWrapper>

      }
      ,

      {
        path: "services",
        element: (
          <SuspenseWrapper>
            <Service />
          </SuspenseWrapper>
        ),
        children: [
          {
            path: "",
            element: (
              <SuspenseWrapper>
                <PortfolioManage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "home-care",
            element: (
              <SuspenseWrapper>
                <TeamLeadership />
              </SuspenseWrapper>
            ),
          },
          {
            path: "language-translation",
            element: (
              <SuspenseWrapper>
                <MarketResearch />
              </SuspenseWrapper>
            ),
          },
          {
            path: "depanage",
            element: (
              <SuspenseWrapper>
                <ExecutiveSearch />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },


  {
    path: 'member-registration',
    element: (
      <SuspenseWrapper>
        <MemberRegistrationForm />
      </SuspenseWrapper>
    )
  },
  {
    path: "AbyrideClient",
    element: (
      <SuspenseWrapper>
        <ClientsAuthLayout />
      </SuspenseWrapper>

    ),
    children: [
      {
        index: true,
        element: <ClientLogin />,
      }
    ],
  },


  {
    path: "trips",
    element: (
      <SuspenseWrapper>
        <Activity />
      </SuspenseWrapper>
    ),
  },

  {
    path: "driver-apply",
    element: (
      <SuspenseWrapper>
        <DriverApply />
      </SuspenseWrapper>
    ),
  },

  {
    path: "AbyrideDriver",
    element: (
      <SuspenseWrapper>
        <DriverLayout />
      </SuspenseWrapper>
    ),
    children: [
      {
        index: true,
        element: <DriverLogin />,
      },

    ],
  },


      {
    path: "reservation",
    element: (
      <SuspenseWrapper>
        
        <ReservationForm />
      </SuspenseWrapper>
    )
  },



  {
    path: "DriverDashboard",
    element: (
      <SuspenseWrapper>
        <DriverProtectedLayout />
      </SuspenseWrapper>
    ),
    children: [
      {
        path: "",
        element: <DriverMainLayout />,
        children: [
          {
            index: true,
            element: <DriverSummaryDashboard />,
          },
          {
            path: 'driverprofile',
            element: (
              <SuspenseWrapper>
                <DriverProfile />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'driver-reservation',
            element: (
              <SuspenseWrapper>
                <DriverReservation />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'driver-reservation/:id',
            element: (
              <SuspenseWrapper>
                <DriverReservationDetail />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },


  {
    path: "ClientDashboard",
    element: (
      <SuspenseWrapper>
        <ClientProtectedRouter />
      </SuspenseWrapper>
    ),
    children: [
      {
        path: "",
        element: <ClientMainLayout />,
        children: [
          {
            index: true,
            element: <DriverSummaryDashboard />,
          },

          {
            path: 'Clientprofile',
            element: (
              <SuspenseWrapper>
                <ClientProfile />
              </SuspenseWrapper>
            ),
          },


        ],
      },
    ],
  },






  {
    path: "Dispatch",
    element: (
      <SuspenseWrapper>
        <DashboardLayout />
      </SuspenseWrapper>
    ),
    children: [
      {
        path: "",
        element: <DashboardAuthLayout />,
        children: [
          {
            index: true,
            element: <DashboardLogin />,

          },

        ]
      },
      {
        path: "lock",
        element: (
          <SuspenseWrapper>
            <LockScreen />
          </SuspenseWrapper>
        ),
      },
      {
        path: "dashboard",
        element: <DashboardProtectedLayout />,
        children: [

          {
            path: "",
            element: (
              <SuspenseWrapper>
                <DashboardMainLayout />
              </SuspenseWrapper>
            ),
            children: [
              {
                index: true,
                element: (
                  <SuspenseWrapper>
                    <SummaryPage />
                  </SuspenseWrapper>
                ),

              },
              {
                path: "reservation",
                element: (
                  <SuspenseWrapper>
                    <BookingManagement />
                  </SuspenseWrapper>
                ),
              },
           
              {
                path: "reservation/:id",  // Match full path and use consistent naming
                element: (
                  <SuspenseWrapper>
                    <ReservationView />
                  </SuspenseWrapper>
                ),
              },
              {
                path: "profile",
                element: (
                  <SuspenseWrapper>
                    <Profile />
                  </SuspenseWrapper>
                ),
              },
              {
                path: "FeeManagement",
                element: (
                  <SuspenseWrapper>
                    <FeeManagement />
                  </SuspenseWrapper>
                ),
              },
              {
                path: "DriverManagement",
                element: (
                  <SuspenseWrapper>
                    <DriverManagement />
                  </SuspenseWrapper>
                ),

              },
              {
                path: "DriverManagement/:id",
                element: (
                  <SuspenseWrapper>
                    <DriverManagementDetail />
                  </SuspenseWrapper>
                ),
              },
              {
                path: "VehicleManagement",
                element: (
                  <SuspenseWrapper>
                    <VehicleManagement />
                  </SuspenseWrapper>
                ),
              },
              {
                path: "VehicleManagement/:id",
                element: (
                  <SuspenseWrapper>
                    <VehicleManagementDetail />
                  </SuspenseWrapper>
                ),
              },

              {
                path: "ContactMessages",
                element: (
                  <SuspenseWrapper>
                    <ContactMessages />
                  </SuspenseWrapper>
                ),
              },
              {
                path: "Lost-property",
                element: (
                  <SuspenseWrapper>
                    <LostPropertiesManagement/>
                  </SuspenseWrapper>
                ),
              },
              {
                path: "FoundProperty",
                element: (
                  <SuspenseWrapper>
                    <FoundPropertyManagement />
                  </SuspenseWrapper>
                ),
              },
                                   {
                path: "complaint",
                element: (
                  <SuspenseWrapper>
                    <ComplaintManagement />
                  </SuspenseWrapper>
                ),
              },
              {
                path: "FeeSettings",
                element: (
                  <SuspenseWrapper>
                    <FeeSettingManagement />
                  </SuspenseWrapper>
                ),
              },
              {
                path: "blog-management",
                element: (
                  <SuspenseWrapper>
                    <BlogManagement />
                  </SuspenseWrapper>
                ),
              },
              {
                path: "blog-management/:id",
                element: (
                  <SuspenseWrapper>
                    <BlogViewModal />
                  </SuspenseWrapper>
                ),
              },
              {
                path: "product-management",
                element: (
                  <SuspenseWrapper>
                    <ProductManagement />
                  </SuspenseWrapper>
                ),
              },
              {
                path: "product-management/:id",
                element: (
                  <SuspenseWrapper>
                    <ProductViewPage />
                  </SuspenseWrapper>
                ),
              },
              
              {
                path: "dashboard-overview",
                element: (
                  <SuspenseWrapper>
                    <DashboardOverview />
                  </SuspenseWrapper>
                ),
              },
              

               {
                    path: "user-management",
                    element: (
                      <SuspenseWrapper>
                        <UserManagementLayout />
                      </SuspenseWrapper>
                    ),
                    children: [

                      {
                        index: true,
                        element: (
                          <SuspenseWrapper>
                            <UserMangementHomePage />
                          </SuspenseWrapper>
                        ),
                      },
                      {
                        path: "permissions",
                        element: (
                          <SuspenseWrapper>
                            <TaskManagement />
                          </SuspenseWrapper>
                        ),
                      },
                      {
                        path: "employees",
                        element: (
                          <SuspenseWrapper>
                            <EmployeeManagement />
                          </SuspenseWrapper>
                        ),
                      },
                    ]
                  },
                  {
                    path: "customer",
                    element: (
                      <SuspenseWrapper>
                        <CustomerManagement />
                      </SuspenseWrapper>
                    ),
                  },
                  {
                    path: "found-property",
                    element: (
                      <SuspenseWrapper>
                        <FoundPropertiesManagement />
                      </SuspenseWrapper>
                    ),
                  },
                  {
                    path: "found-property/:id",
                    element: (
                      <SuspenseWrapper>
                        <FoundPropertyViewMore />
                      </SuspenseWrapper>
                    ),
                  },
              {
                path: "FeeSettings",
                element: (
                  <SuspenseWrapper>
                    <FeeSettingManagement />
                  </SuspenseWrapper>
                ),
              },
              {
                path: "ReservationFormDipatch",
                element: (
                  <SuspenseWrapper>
                    <ReservationFormDipatch />
                  </SuspenseWrapper>
                ),
              },
              {
                path: "member-management",
                element: (
                  <SuspenseWrapper>
                    <MemberManagement />
                  </SuspenseWrapper>
                ),
              },
              
              {
                path: "LocationManagement",
                element: (
                  <SuspenseWrapper>
                    <LocationManagement />
                  </SuspenseWrapper>
                ),
              },
                 {
                path: "send-message",
                element: (
                  <SuspenseWrapper>
                    <MessagingPhoneManagement />
                  </SuspenseWrapper>
                ),
              },
                {
                path: "send-email",
                element: (
                  <SuspenseWrapper>
                    <MessagingEmailManagement />
                  </SuspenseWrapper>
                ),
              },
            ]
          }
        ]
      },

    ],
  },
  {
    path: "*",
    element: (
      <SuspenseWrapper>
        <ErrorLayout />
      </SuspenseWrapper>
    ),
  },
];

// Create router instance
const router = createBrowserRouter(routes);

export default router;
