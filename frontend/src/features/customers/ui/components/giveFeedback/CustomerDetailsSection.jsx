import React from "react";
import { User } from "lucide-react";

export const CustomerDetailsSection = ({
  organization,
  name,
  setName,
  email,
  setEmail,
}) => {
  const primaryColor = organization?.primaryColor;
  return (
    <section className="pt-6 border-t border-[#EFE4D6]">
      <div className="rounded-xl bg-[#FFF2DB]/40 border border-[#E6D7C3] p-4.5 sm:p-5">
        <div className="flex items-center gap-2 mb-1.5">
          <User className="w-4 h-4 text-[#92001D]" />
          <span className="text-xs uppercase tracking-wider text-[#5E5851] font-bold">
            Your Details (Optional)
          </span>
        </div>
        <p className="text-xs text-[#5E5851] mb-4">
          Optional. We'll use this only if you want our team to follow up on your feedback.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="customer-name"
              className="block text-xs text-[#5E5851] mb-1 font-medium"
            >
              Your Name
            </label>
            <input
              id="customer-name"
              type="text"
              name="customer_name"
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[40px] px-3.5 text-sm rounded-lg border border-[#E8DFD5] bg-[#FFFFFF] text-[#1E1A17] placeholder:text-[#8C847B] focus:border-[#F62440] focus:ring-2 focus:ring-[#F62440]/15 outline-none transition-all"
            />
          </div>
          <div>
            <label
              htmlFor="customer-email"
              className="block text-xs text-[#5E5851] mb-1 font-medium"
            >
              Email Address
            </label>
            <input
              id="customer-email"
              type="email"
              name="customer_email"
              placeholder="e.g. alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[40px] px-3.5 text-sm rounded-lg border border-[#E8DFD5] bg-[#FFFFFF] text-[#1E1A17] placeholder:text-[#8C847B] focus:border-[#F62440] focus:ring-2 focus:ring-[#F62440]/15 outline-none transition-all"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerDetailsSection;
