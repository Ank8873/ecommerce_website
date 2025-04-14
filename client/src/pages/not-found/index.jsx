import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="max-w-2xl w-full text-center space-y-8"
      >
        <motion.div variants={itemVariants} className="space-y-4">
          <motion.div
            variants={floatingAnimation}
            initial="initial"
            animate="animate"
            className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60"
          >
            404
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600">
            Looks like this page is as elusive as last season's fashion trends!
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center space-x-4">
          <div className="w-16 h-1 bg-primary/20 rounded-full" />
          <div className="w-16 h-1 bg-primary/40 rounded-full" />
          <div className="w-16 h-1 bg-primary/60 rounded-full" />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
          <div className="p-4 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm">
            <span className="text-2xl">👕</span>
            <p className="mt-2 text-sm text-gray-600">Latest Collection</p>
          </div>
          <div className="p-4 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm">
            <span className="text-2xl">🛍️</span>
            <p className="mt-2 text-sm text-gray-600">Trending Styles</p>
          </div>
          <div className="p-4 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm">
            <span className="text-2xl">✨</span>
            <p className="mt-2 text-sm text-gray-600">Premium Quality</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Return to Homepage
          </Link>
          <p className="text-sm text-gray-500">
            Don't worry, we've got plenty of other amazing fashion pieces for you!
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="text-center text-sm text-gray-500 mt-8"
        >
          <p>Need help? Contact us at support@arriveforvision.com</p>
          <div className="flex justify-center space-x-4 mt-4">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600">🚚 Fast Delivery</span>
            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600">💰 Best Prices</span>
            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600">👕 Premium Quality</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default NotFound;
