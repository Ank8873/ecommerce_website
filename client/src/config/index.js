import { Shirt, Flower2, Baby } from "lucide-react";

export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
    validation: {
      required: true,
      pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#%^&*()\\[\\]{};:'\",._<>])[A-Za-z\\d!@#%^&*()\\[\\]{};:'\",._<>]{8,24}$",
      message: "Password must be 8-24 characters and include uppercase, lowercase, number, and special character (except < > $ ? | / \\)"
    }
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "male", label: "Male" },
      { id: "female", label: "Female" },
      { id: "kids", label: "Kids" },
    ],
  },
  {
    label: "Product Type",
    name: "productType",
    componentType: "select",
    options: [
      { id: "round_neck_half", label: "Round Neck Half Sleeve" },
      { id: "polo_neck", label: "Polo Neck T-shirts" },
      { id: "round_neck_full", label: "Round Neck Full Sleeve" },
      { id: "sweat_shirts_full", label: "Sweatshirts Full Set" },
      { id: "sweat_shirts_upper", label: "Sweatshirts Upper" },
      { id: "round_neck_oversize", label: "Round Neck Oversize" },
      { id: "crop_top", label: "Crop Top" }
    ],
  },
  {
    label: "Type",
    name: "type",
    componentType: "select",
    options: [
      { id: "size", label: "Size" },
      { id: "age_group", label: "Age Group" },
    ],
  },
  {
    label: "Size",
    name: "size",
    componentType: "select",
    options: [
      { id: "XS", label: "XS" },
      { id: "S", label: "S" },
      { id: "M", label: "M" },
      { id: "L", label: "L" },
      { id: "XL", label: "XL" },
      { id: "XXL", label: "XXL" },
      { id: "3-5yr", label: "3-5 Years" },
      { id: "6-8yr", label: "6-8 Years" },
      { id: "9-13yr", label: "9-13 Years" }
    ],
  },
  {
    label: "Measurement",
    name: "measurement",
    componentType: "select",
    options: [
      { id: "36in", label: "36 inches" },
      { id: "38in", label: "38 inches" },
      { id: "40in", label: "40 inches" },
      { id: "42in", label: "42 inches" },
      { id: "44in", label: "44 inches" },
      { id: "free_size", label: "Free Size" },
      { id: "kids", label: "Kids" },
    ],
  },
  {
    label: "Price Increment",
    name: "percentageIncrement",
    componentType: "input",
    type: "number",
    placeholder: "Enter Price increment (e.g., 25)",
    initialValue: "",
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter product sale price",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/",
  },
  {
    id: "all-products",
    label: "All Products",
    path: "/shop/listing",
  },
  {
    id: "male",
    label: "Male",
    path: "/shop/listing?category=male",
  },
  {
    id: "female",
    label: "Female",
    path: "/shop/listing?category=female",
  },
  {
    id: "kids",
    label: "Kids",
    path: "/shop/listing?category=kids",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
  {
    id: "about",
    label: "About",
    path: "/shop/about",
  },
];

export const productTypes = [
  { id: "round_neck_half", label: "Round Neck Half Sleeve" },
  { id: "polo_neck", label: "Polo Neck T-shirts" },
  { id: "round_neck_full", label: "Round Neck Full Sleeve" },
  { id: "sweat_shirts_full", label: "Sweatshirts Full Set" },
  { id: "sweat_shirts_upper", label: "Sweatshirts Upper" },
  { id: "round_neck_oversize", label: "Round Neck Oversize" },
  { id: "crop_top", label: "Crop Top" }
];

export const productTypeMap = {
  round_neck_half: "Round Neck Half Sleeve",
  polo_neck: "Polo Neck T-shirts",
  round_neck_full: "Round Neck Full Sleeve",
  sweat_shirts_full: "Sweatshirts Full Set",
  sweat_shirts_upper: "Sweatshirts Upper",
  round_neck_oversize: "Round Neck Oversize",
  crop_top: "Crop Top"
};

export const categories = {
  male: {
    label: "Male Fashion",
    icon: Shirt,
    color: "bg-white",
    subcategories: productTypes.map(type => ({ ...type, icon: Shirt }))
  },
  female: {
    label: "Female Fashion",
    icon: Flower2,
    color: "bg-white",
    subcategories: productTypes.map(type => ({ ...type, icon: Shirt }))
  },
  kids: {
    label: "Kids' Fashion",
    icon: Baby,
    color: "bg-white",
    subcategories: [
      { id: "3-5", label: "3-5 Years", icon: Baby },
      { id: "6-8", label: "6-8 Years", icon: Baby },
      { id: "9-13", label: "9-13 Years", icon: Baby }
    ]
  }
};

export const sizes = [
  { id: "xs", label: "XS", size: "36 in", chest: "34-36", waist: "28-30", color: "bg-white" },
  { id: "s", label: "S", size: "38 in", chest: "36-38", waist: "30-32", color: "bg-white" },
  { id: "m", label: "M", size: "40 in", chest: "38-40", waist: "32-34", color: "bg-white" },
  { id: "l", label: "L", size: "42 in", chest: "40-42", waist: "34-36", color: "bg-white" },
  { id: "xl", label: "XL", size: "44 in", chest: "42-44", waist: "36-38", color: "bg-white" },
  { id: "xxl", label: "XXL", size: "46 in", chest: "44-46", waist: "38-40", color: "bg-white" }
];

export const kidsAgeGuide = [
  { 
    age: "3-5 Years", 
    height: "95-110 cm",
    chest: "53-55 cm",
    waist: "51-53 cm",
    color: "bg-white"
  },
  { 
    age: "6-8 Years", 
    height: "111-130 cm",
    chest: "56-63 cm",
    waist: "54-58 cm",
    color: "bg-white"
  },
  { 
    age: "9-13 Years", 
    height: "131-150 cm",
    chest: "64-72 cm",
    waist: "59-66 cm",
    color: "bg-white"
  }
];

export const categoryOptionsMap = {
  male: "Male",
  female: "Female",
  kids: "Kids",
};

export const filterOptions = {
  category: [
    { id: "male", label: "Male" },
    { id: "female", label: "Female" },
    { id: "kids", label: "Kids" },
  ],
  age: [
    { id: "3-5yr", label: "3-5 Years" },
    { id: "6-8yr", label: "6-8 Years" },
    { id: "9-13yr", label: "9-13 Years" }
  ]
};


export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "newest", label: "Newest First" },
  { id: "popular", label: "Most Popular" }
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
    validation: {
      required: true,
      pattern: "^[a-zA-Z0-9\\s,.'-]{3,100}$",
      message: "Please enter a valid address (3-100 characters)"
    }
  },
  {
    label: "City",
    name: "city", 
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
    validation: {
      required: true,
      pattern: "^[a-zA-Z\\s]{2,50}$",
      message: "Please enter a valid city name (letters only, 2-50 characters)"
    }
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input", 
    type: "text",
    placeholder: "Enter your pincode",
    validation: {
      required: true,
      pattern: "^[0-9]{6}$",
      message: "Please enter a valid 6-digit pincode"
    }
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text", 
    placeholder: "Enter your phone number",
    validation: {
      required: true,
      pattern: "^[6-9]\\d{9}$",
      message: "Please enter a valid 10-digit mobile number starting with 6-9"
    }
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
    validation: {
      required: false,
      pattern: "^[\\s\\S]{0,200}$",
      message: "Notes cannot exceed 200 characters"
    }
  },
];
