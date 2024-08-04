import config from '~/config';
// import Home from '~/pages/user/pages/Home';
// import Profile from '~/pages/user/pages/Profile';
// import Products from '~/pages/user/pages/Products/Products';
// import LoginForm from '~/pages/account/login/LoginForm';
// import RegistrationForm from '~/pages/account/register/RegistrationForm';
// import Cart from '~/pages/user/pages/Cart/Cart';
// import Checkout from '~/components/Checkout/Checkout';
// import Chat from '~/components/Chat';
// import Order from '~/components/Order/Order';
// import OrderDetails from '~/components/Order/OrderDetail';
// import RateProduct from '~/components/ReviewProduct/RateProduct';

// không cần đăng nhập vẫn xem được
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.login, component: LoginForm },
    { path: config.routes.register, component: RegistrationForm },
    { path: config.routes.checkout, component: Checkout },
];

// phải đăng nhập, nếu không sẽ đưa ra login
const privateRoutes = [];

// const adminRoutes = [
//     {path: config.routes.admin, component: }
// ]

export { publicRoutes, privateRoutes };
