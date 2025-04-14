import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate("/auth/login");
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-8"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <img src="/main_logo.png" alt="Ankit Vastraa Logo" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Create Account
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Create your account and start shopping
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-white py-10 px-8 shadow-xl rounded-xl"
      >
        <CommonForm
          submitText="Create Account"
          formControls={registerFormControls}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          className="space-y-6"
        />

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-200"
              to="/auth/login"
            >
              Sign in here
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm">👕 Wide Selection</span>
            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm">📏 All Sizes</span>
            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-sm">👶 Kids Collection</span>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Join thousands of satisfied customers shopping at Ankit Vastraa Store
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AuthRegister;
