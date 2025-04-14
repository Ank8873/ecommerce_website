import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

const AboutPage = () => {
  const sizeCharts = {
    male: [
      { size: "XS", chest: "34-36", waist: "28-30", hips: "35-37" },
      { size: "S", chest: "36-38", waist: "30-32", hips: "37-39" },
      { size: "M", chest: "38-40", waist: "32-34", hips: "39-41" },
      { size: "L", chest: "40-42", waist: "34-36", hips: "41-43" },
      { size: "XL", chest: "42-44", waist: "36-38", hips: "43-45" },
      { size: "XXL", chest: "44-46", waist: "38-40", hips: "45-47" },
    ],
    female: [
      { size: "XS", chest: "34-36", waist: "28-30", hips: "35-37" },
      { size: "S", chest: "36-38", waist: "30-32", hips: "37-39" },
      { size: "M", chest: "38-40", waist: "32-34", hips: "39-41" },
      { size: "L", chest: "40-42", waist: "34-36", hips: "41-43" },
      { size: "XL", chest: "42-44", waist: "36-38", hips: "43-45" },
      { size: "XXL", chest: "44-46", waist: "38-40", hips: "45-47" },
    ],
    kids: [
      { size: "3-5Y", chest: "21-22", waist: "20-21", height: "37-43" },
      { size: "6-8Y", chest: "22-25", waist: "21-23", height: "44-51" },
      { size: "9-13Y", chest: "25-28", waist: "23-26", height: "52-59" },
    ],
  };

  const deliveryLocations = [
    { name: "Kolkata Sealdah", code: "SDAH" },
    { name: "Bidhan Nagar", code: "BNXR" },
    { name: "Dum Dum", code: "DDJ" },
    { name: "Dum Dum Cant", code: "DDC" },
    { name: "Durganagar", code: "DGNR" },
    { name: "Birati", code: "BBT" },
    { name: "Bisharpara Kodaliya", code: "BRPK" },
    { name: "New Barrackpore", code: "NBE" },
    { name: "Madhyamgram", code: "MMG" },
    { name: "Hridaypur", code: "HHR" },
    { name: "Barasat", code: "BT" },
    { name: "Bamangachhi", code: "BMG" },
    { name: "Dattapukur", code: "DTK" },
    { name: "Bira", code: "BIRA" },
    { name: "Guma", code: "GUMA" },
    { name: "Ashok Nagar Road", code: "ASKR" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 space-y-8"
    >
      {/* About Section */}
      <section className="space-y-4">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold text-center"
        >
          About Us
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground text-center max-w-3xl mx-auto"
        >
          Welcome to your premier fashion destination. We are passionate about bringing you
          the latest trends and timeless classics in clothing for Male, Female, and kids.
        </motion.p>
      </section>

      {/* Size Charts */}
      <section id="size-charts" className="space-y-4">
        <h2 className="text-2xl font-semibold">Size Charts</h2>
        <Tabs defaultValue="male" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
            <TabsTrigger value="male">Male</TabsTrigger>
            <TabsTrigger value="female">Female</TabsTrigger>
            <TabsTrigger value="kids">Kids</TabsTrigger>
          </TabsList>
          {Object.entries(sizeCharts).map(([category, sizes]) => (
            <TabsContent key={category} value={category}>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="p-2 text-left">Size</th>
                      <th className="p-2 text-left">Chest (inches)</th>
                      <th className="p-2 text-left">Waist (inches)</th>
                      <th className="p-2 text-left">
                        {category === "kids" ? "Height (inches)" : "Hips (inches)"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizes.map((size, index) => (
                      <tr
                        key={size.size}
                        className={index % 2 === 0 ? "bg-secondary/50" : ""}
                      >
                        <td className="p-2">{size.size}</td>
                        <td className="p-2">{size.chest}</td>
                        <td className="p-2">{size.waist}</td>
                        <td className="p-2">
                          {category === "kids" ? size.height : size.hips}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="space-y-4">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I place an order?</AccordionTrigger>
            <AccordionContent>
              Browse our collection, select your items, add them to cart, and proceed to
              checkout. You can receive your Order with Cash on Delivery or Online payment on Delivery.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" id="shipping">
            <AccordionTrigger>What are your shipping times?</AccordionTrigger>
            <AccordionContent>
              We typically process orders within 24-48 hours. Delivery usually takes 3-5
              business days depending on your location.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" id="returns">
            <AccordionTrigger>What should I do if my order is approved but hasn't been shipped yet?
          </AccordionTrigger>
            <AccordionContent>
            Sellers usually ship orders 1-2 business days before
            the delivery date so that they reach you on time. In
            case your order hasn't been shipped within this time
            please contact our Customer Support so that we can
            look into it.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" id="payment">
            <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
            <AccordionContent>
              We accept all major UPI, net banking, and popular digital
              wallets as well as cash after a successful delivery at your doorstep.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5" id="delivery">
            <AccordionTrigger>How will my order be delivered?</AccordionTrigger>
            <AccordionContent>
              All orders are shipped by sellers through courier
              service providers who deliver the packages to your
              doorstep.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6" id="tracking">
            <AccordionTrigger>Why can't I track my order even though it
            has been InShipping?
            </AccordionTrigger>
            <AccordionContent>
              Courier services usually take upto 24 - 48  hours to reach you for an order once it's shipped. Please contact our Customer Support if you want to know your order position.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Location Map Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Visit us at</h2>
        <p className="text-muted-foreground mb-4">Find us in Duttapukur Nebadhai near Nebadhui Boy's Primary School</p>
        <div className="w-full rounded-lg overflow-hidden">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m13!1m11!1m3!1d499.4389748753761!2d88.54595122358985!3d22.77184514788397!2m2!1f0!2f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1733243542452!5m2!1sen!2sin" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg"
            title="Google Maps - Duttapukur Nebadhai Location"
          />
        </div>
      </section>

      {/* Delivery Locations Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Delivery Locations</h2>
        <p className="text-muted-foreground mb-4">We deliver to all listed locations on the Sealdah to Bangaon</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deliveryLocations.map((location) => (
            <div 
              key={location.code}
              className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <p className="font-medium">{location.name}</p>
              <p className="text-sm text-muted-foreground">{location.code}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Need Help?</h2>
        <div className="text-muted-foreground">
          <p>
            Contact us at{" "}
            <a
              href="mailto:arriveforvision@gmail.com"
              className="text-primary hover:underline"
            >
              arriveforvision@gmail.com
            </a>{" "}
            or call us at{" "}
            <a href="tel:+917003382167" className="text-primary hover:underline">
              +91 7003382167
            </a>
          </p>
          <p className="mt-2">
            For quick responses, chat with us on WhatsApp:{" "}
            <a
              href="https://wa.me/918981572735"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              +91 8981572735
            </a>
          </p>
        </div>
      </section>
    </motion.div>
  );
};

export default AboutPage;
