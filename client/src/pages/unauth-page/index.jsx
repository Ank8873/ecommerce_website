import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LockIcon, HomeIcon, LogInIcon, AlertTriangleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

function UnauthPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12"
      >
        <motion.div
          variants={iconVariants}
          className="mx-auto w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mb-8"
        >
          <LockIcon className="w-16 h-16 text-red-500" />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold text-gray-900 mb-6 text-center"
        >
          Access Denied
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-2 mb-8 text-amber-600 bg-amber-50 rounded-lg p-4"
        >
          <AlertTriangleIcon className="w-5 h-5" />
          <p className="text-lg text-center">
            Sorry, you don't have permission to access this page
          </p>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-gray-600 text-lg mb-10 text-center"
        >
          Please log in with appropriate credentials or return to the home page to continue browsing.
        </motion.p>

        <motion.div
          variants={containerVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <motion.div variants={itemVariants}>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto flex items-center gap-3 text-lg px-8"
            >
              <HomeIcon className="w-5 h-5" />
              Go Home
            </Button>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              onClick={() => navigate("/auth/login")}
              size="lg"
              className="w-full sm:w-auto flex items-center gap-3 bg-primary hover:bg-primary/90 text-lg px-8"
            >
              <LogInIcon className="w-5 h-5" />
              Log In
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-gray-100 text-center"
        >
          <p className="text-base text-gray-500">
            If you believe this is a mistake or need assistance, please contact our support team at{" "}
            <a href="mailto:support@arriveforvision.com" className="text-primary hover:underline">
              support@arriveforvision.com
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default UnauthPage;
