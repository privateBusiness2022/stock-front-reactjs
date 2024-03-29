import { lazy, Suspense } from 'react';
import { Navigate, useLocation, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import AuthGuard from '../guards/AuthGuard';
import GuestGuard from '../guards/GuestGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'verify', element: <VerifyCode /> },
      ],
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralApp /> },
        { path: 'ecommerce', element: <GeneralEcommerce /> },
        { path: 'analytics', element: <GeneralAnalytics /> },
        { path: 'banking', element: <GeneralBanking /> },
        { path: 'booking', element: <GeneralBooking /> },

        {
          path: 'e-commerce',
          children: [
            { element: <Navigate to="/dashboard/e-commerce/shop" replace />, index: true },
            { path: 'shop', element: <EcommerceShop /> },
            { path: 'product/:name', element: <EcommerceProductDetails /> },
            { path: 'list', element: <EcommerceProductList /> },
            { path: 'product/new', element: <EcommerceProductCreate /> },
            { path: 'product/:name/edit', element: <EcommerceProductCreate /> },
            { path: 'checkout', element: <EcommerceCheckout /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
            { path: 'profile', element: <UserProfile /> },
            { path: 'cards', element: <UserCards /> },
            { path: 'list', element: <UserList /> },
            { path: 'new', element: <UserCreate /> },
            { path: 'edit', element: <UserCreate /> },
            { path: 'account', element: <UserAccount /> },
          ],
        },
        {
          path: 'project',
          children: [
            { element: <Navigate to="/dashboard/project/list" replace />, index: true },
            { path: 'list', element: <ProjectList /> },
            { path: 'new', element: <ProjectCreate /> },
            { path: 'edit', element: <ProjectCreate /> },
            { path: 'profile', element: <ProjectProfile /> },
          ],
        },
        {
          path: 'request',
          children: [
            { element: <Navigate to="/dashboard/request/to-change-list" replace />, index: true },
            { path: 'to-change-list', element: <RequestToChangeList /> },
            { path: 'to-withdrawal-list', element: <RequestToWithdrawalList /> },
          ],
        },
        {
          path: 'period',
          children: [
            { element: <Navigate to="/dashboard/periods/list" replace />, index: true },
            { path: 'profile', element: <PeriodProfile /> },
            // { path: 'cards', element: <UserCards /> },
            { path: 'list', element: <PeriodList /> },
            { path: 'new', element: <PeriodCreate /> },
            // { path: 'edit', element: <UserCreate /> },
            // { path: 'account', element: <UserAccount /> },
          ],
        },
        {
          path: 'investor',
          children: [
            { element: <Navigate to="/dashboard/investor/list" replace />, index: true },
            // { path: 'profile', element: <UserProfile /> },
            // { path: 'cards', element: <UserCards /> },
            { path: 'list', element: <InvestorList /> },
            { path: 'new', element: <InvestorCreate /> },
            { path: 'edit', element: <InvestorCreate /> },
            { path: 'account', element: <InvestorAccount /> },
          ],
        },
        {
          path: 'dividing',
          children: [
            { element: <Navigate to="/dashboard/dividing/list" replace />, index: true },
            { path: 'profile', element: <StageProfile /> },
            { path: 'commissions', element: <CommissionList /> },
            { path: 'commissions-profile', element: <StageCommissionProfile /> },
            { path: 'list', element: <DividingList /> },
            // { path: 'account', element: <DividingAccount /> },
          ],
        },
        {
          path: 'invoice',
          children: [
            { element: <Navigate to="/dashboard/invoice/list" replace />, index: true },
            { path: 'list', element: <InvoiceList /> },
            { path: ':id', element: <InvoiceDetails /> },
            { path: ':id/edit', element: <InvoiceEdit /> },
            { path: 'new', element: <InvoiceCreate /> },
          ],
        },
        {
          path: 'blog',
          children: [
            { element: <Navigate to="/dashboard/blog/posts" replace />, index: true },
            { path: 'posts', element: <BlogPosts /> },
            { path: 'post/:title', element: <BlogPost /> },
            { path: 'new', element: <BlogNewPost /> },
          ],
        },
        {
          path: 'mail',
          children: [
            { element: <Navigate to="/dashboard/mail/all" replace />, index: true },
            { path: 'label/:customLabel', element: <Mail /> },
            { path: 'label/:customLabel/:mailId', element: <Mail /> },
            { path: ':systemLabel', element: <Mail /> },
            { path: ':systemLabel/:mailId', element: <Mail /> },
          ],
        },
        {
          path: 'chat',
          children: [
            { element: <Chat />, index: true },
            { path: 'new', element: <Chat /> },
            { path: ':conversationKey', element: <Chat /> },
          ],
        },
        { path: 'calendar', element: <Calendar /> },
        { path: 'kanban', element: <Kanban /> },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        // { path: 'coming-soon', element: <ComingSoon /> },
        // { path: 'maintenance', element: <Maintenance /> },
        // { path: 'pricing', element: <Pricing /> },
        // { path: 'payment', element: <Payment /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: (
        <GuestGuard>
          <Login />
        </GuestGuard>
      ),
      // children: [
      //   { element: <HomePage />, index: true },
      //   { path: 'about-us', element: <About /> },
      //   { path: 'contact-us', element: <Contact /> },
      //   { path: 'faqs', element: <Faqs /> },
      // ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));

// DASHBOARD

// GENERAL
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const GeneralEcommerce = Loadable(lazy(() => import('../pages/dashboard/GeneralEcommerce')));
const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));
const GeneralBanking = Loadable(lazy(() => import('../pages/dashboard/GeneralBanking')));
const GeneralBooking = Loadable(lazy(() => import('../pages/dashboard/GeneralBooking')));

// ECOMMERCE
const EcommerceShop = Loadable(lazy(() => import('../pages/dashboard/EcommerceShop')));
const EcommerceProductDetails = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductDetails')));
const EcommerceProductList = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductList')));
const EcommerceProductCreate = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductCreate')));
const EcommerceCheckout = Loadable(lazy(() => import('../pages/dashboard/EcommerceCheckout')));

// INVOICE
const InvoiceList = Loadable(lazy(() => import('../pages/dashboard/InvoiceList')));
const InvoiceDetails = Loadable(lazy(() => import('../pages/dashboard/InvoiceDetails')));
const InvoiceCreate = Loadable(lazy(() => import('../pages/dashboard/InvoiceCreate')));
const InvoiceEdit = Loadable(lazy(() => import('../pages/dashboard/InvoiceEdit')));

// BLOG
const BlogPosts = Loadable(lazy(() => import('../pages/dashboard/BlogPosts')));
const BlogPost = Loadable(lazy(() => import('../pages/dashboard/BlogPost')));
const BlogNewPost = Loadable(lazy(() => import('../pages/dashboard/BlogNewPost')));

// USER
const UserProfile = Loadable(lazy(() => import('../pages/dashboard/UserProfile')));
const UserCards = Loadable(lazy(() => import('../pages/dashboard/UserCards')));
const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));

const ProjectList = Loadable(lazy(() => import('../pages/dashboard/ProjectList')));
const ProjectProfile = Loadable(lazy(() => import('../pages/dashboard/ProjectProfile')));
const ProjectCreate = Loadable(lazy(() => import('../pages/dashboard/ProjectCreate')));
// const ProjectEdit = Loadable(lazy(() => import('../pages/dashboard/ProjectEdit')));

// Request
const RequestToChangeList = Loadable(lazy(() => import('../pages/dashboard/RequestToChangeList')));
const RequestToWithdrawalList = Loadable(lazy(() => import('../pages/dashboard/RequestToWithdrawalList')));

// PERIOD
const PeriodProfile = Loadable(lazy(() => import('../pages/dashboard/PeriodProfile')));
// const UserCards = Loadable(lazy(() => import('../pages/dashboard/UserCards')));
const PeriodList = Loadable(lazy(() => import('../pages/dashboard/PeriodList')));
// const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const PeriodCreate = Loadable(lazy(() => import('../pages/dashboard/PeriodCreate')));

// INVESTOR
const InvestorList = Loadable(lazy(() => import('../pages/dashboard/InvestorList')));
const InvestorCreate = Loadable(lazy(() => import('../pages/dashboard/InvestorCreate')));
const InvestorAccount = Loadable(lazy(() => import('../pages/dashboard/InvestorAccount')));
// const InvestorEdit = Loadable(lazy(() => import('../pages/dashboard/InvestorEdit')));

// DIVIDING
const DividingList = Loadable(lazy(() => import('../pages/dashboard/DividingList')));
const StageProfile = Loadable(lazy(() => import('../pages/dashboard/StageProfile')));
const CommissionList = Loadable(lazy(() => import('../pages/dashboard/CommissionList')));
const StageCommissionProfile = Loadable(lazy(() => import('../pages/dashboard/StageCommissionProfile')));
// APP
const Chat = Loadable(lazy(() => import('../pages/dashboard/Chat')));
const Mail = Loadable(lazy(() => import('../pages/dashboard/Mail')));
const Calendar = Loadable(lazy(() => import('../pages/dashboard/Calendar')));
const Kanban = Loadable(lazy(() => import('../pages/dashboard/Kanban')));

// MAIN;
// const HomePage = Loadable(lazy(() => import('../pages/Home')));
// const About = Loadable(lazy(() => import('../pages/About')));
// const Contact = Loadable(lazy(() => import('../pages/Contact')));
// const Faqs = Loadable(lazy(() => import('../pages/Faqs')));
// const ComingSoon = Loadable(lazy(() => import('../pages/ComingSoon')));
// const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
// const Pricing = Loadable(lazy(() => import('../pages/Pricing')));
// const Payment = Loadable(lazy(() => import('../pages/Payment')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
