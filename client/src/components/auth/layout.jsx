import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 w-1/2 px-12"
      >
        <div className="max-w-xl space-y-8 text-center text-white">
          <div className="space-y-2">
            <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-blue-50">
              Singh Style Studio Store
            </h1>
            <p className="text-xl text-gray-300 mt-4">Your Premium Fashion Destination</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-12">
            <div className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2">Premium Collection</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>👕 Round Neck T-Shirts</li>
                <li>👔 Polo Neck T-Shirts</li>
                <li>🧥 Sweatshirts</li>
                <li>👗 Crop Tops</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-2">Size Range</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>XS (36") - XXL</li>
                <li>Kids: 3-13 years</li>
                <li>Perfect Fit Guarantee</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-sm">🚚 Cash on Delivery</span>
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-300 text-sm">💬 Bulk Orders Welcome</span>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Experience premium quality clothing with our extensive collection of trendy and comfortable wear.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-12 sm:px-8 lg:px-12"
      >
        <div className="w-full max-w-lg">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
}

export default AuthLayout;
