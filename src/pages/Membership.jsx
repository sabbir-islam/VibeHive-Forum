import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../providers/authContext";
import { toast } from "react-toastify";

const Membership = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentMembership, setCurrentMembership] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch current membership status on component mount
  useEffect(() => {
    const fetchMembership = async () => {
      try {
        // Ensure email is lowercase for consistency
        const email = currentUser?.email?.toLowerCase();
        console.log("Fetching membership for:", email);

        const response = await axios.get(
          `https://vibe-hive-omega.vercel.app/users/membership/${email}`
        );

        console.log("Membership response:", response.data);
        setCurrentMembership(response.data);
      } catch (error) {
        console.error("Error fetching membership:", error);
        if (error.response?.status === 404) {
          console.log("No membership found for user");
          setCurrentMembership(null);
        }
      }
    };

    if (currentUser?.email) {
      fetchMembership();
    }
  }, [currentUser]);

  const plans = {
    monthly: {
      basic: {
        name: "Forum Explorer",
        price: 9.99,
        features: [
          "Unlimited forum posts",
          "Direct messaging",
          "Basic profile customization",
          "Email support",
          "Access to general discussions",
        ],
        color: "from-blue-500 to-blue-600",
        popular: false,
      },
      premium: {
        name: "Forum Master",
        price: 19.99,
        features: [
          "Everything in Explorer",
          "Priority support",
          "Advanced profile themes",
          "Create private groups",
          "Exclusive content access",
          "Badge collection system",
          "Analytics dashboard",
        ],
        color: "from-purple-500 to-purple-600",
        popular: true,
      },
    },
    annual: {
      basic: {
        name: "Forum Explorer",
        price: 99.99,
        originalPrice: 119.88,
        features: [
          "Unlimited forum posts",
          "Direct messaging",
          "Basic profile customization",
          "Email support",
          "Access to general discussions",
        ],
        color: "from-blue-500 to-blue-600",
        popular: false,
      },
      premium: {
        name: "Forum Master",
        price: 199.99,
        originalPrice: 239.88,
        features: [
          "Everything in Explorer",
          "Priority support",
          "Advanced profile themes",
          "Create private groups",
          "Exclusive content access",
          "Badge collection system",
          "Analytics dashboard",
        ],
        color: "from-purple-500 to-purple-600",
        popular: true,
      },
    },
  };

  const currentPlans = isAnnual ? plans.annual : plans.monthly;

  const handlePlanSelect = async (planType) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const currentPlans = isAnnual ? plans.annual : plans.monthly;
      const selectedPlanDetails = currentPlans[planType];

      const startDate = new Date();
      const expireDate = new Date();
      if (isAnnual) {
        expireDate.setFullYear(expireDate.getFullYear() + 1);
      } else {
        expireDate.setMonth(expireDate.getMonth() + 1);
      }

      const membershipData = {
        email: currentUser.email.toLowerCase(), // Ensure lowercase
        plan: planType,
        startDate: startDate.toISOString(),
        expireDate: expireDate.toISOString(),
        isActive: true,
      };

      console.log("Sending membership data:", membershipData);

      const response = await axios.post(
        "https://vibe-hive-omega.vercel.app/users/membership",
        membershipData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Membership creation response:", response.data);

      // Fetch updated membership data to confirm it was saved
      const updatedMembership = await axios.get(
        `https://vibe-hive-omega.vercel.app/users/membership/${currentUser.email.toLowerCase()}`
      );

      console.log("Updated membership data:", updatedMembership.data);

      setSelectedPlan(planType);
      setCurrentMembership(updatedMembership.data);

      toast.success(
        `Successfully subscribed to ${selectedPlanDetails.name} plan!`
      );
    } catch (error) {
      console.error("Error selecting plan:", error);

      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        toast.error(
          `Server error: ${
            error.response.data?.message || error.response.statusText
          }`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        console.error("Error message:", error.message);
        toast.error(`Error: ${error.message}`);
      }
    }
    setLoading(false);
  };

  // Add this section in your JSX to show current membership status
  const renderMembershipStatus = () => {
    if (!currentMembership) return null;

    const expireDate = new Date(currentMembership.expireDate);
    return (
      <div className="text-center mb-8 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Current Membership Status
        </h3>
        <p className="text-gray-700">
          Plan:{" "}
          {currentMembership.plan === "premium"
            ? "Forum Master"
            : "Forum Explorer"}
        </p>
        <p className="text-gray-700">
          Expires: {expireDate.toLocaleDateString()}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Membership
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock premium features and elevate your forum experience with our
            carefully crafted membership plans
          </p>
        </div>

        {/* Membership Status */}
        {renderMembershipStatus()}

        {/* Toggle Switch */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-1 shadow-lg border">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  !isAnnual
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 relative ${
                  isAnnual
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Annual
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {Object.entries(currentPlans).map(([planType, plan]) => (
            <div
              key={planType}
              className={`relative bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 ${
                selectedPlan === planType
                  ? "border-purple-500"
                  : "border-transparent"
              } ${plan.popular ? "transform scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center py-2 font-semibold">
                  🔥 Most Popular
                </div>
              )}

              <div className={`h-2 bg-gradient-to-r ${plan.color}`}></div>

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">
                      /{isAnnual ? "year" : "month"}
                    </span>
                  </div>
                  {isAnnual && plan.originalPrice && (
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-gray-500 line-through">
                        ${plan.originalPrice}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                        Save ${(plan.originalPrice - plan.price).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div
                        className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelect(planType)}
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                    loading
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : selectedPlan === planType
                      ? `bg-gradient-to-r ${plan.color} text-white shadow-lg transform scale-105`
                      : `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg hover:transform hover:scale-105`
                  }`}
                >
                  {loading
                    ? "Processing..."
                    : selectedPlan === planType
                    ? "Selected!"
                    : "Choose Plan"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features Section */}
        <div className="mt-16 bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Choose Our Membership?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-600">
                Experience blazing fast forum interactions with our optimized
                platform
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure & Reliable
              </h3>
              <p className="text-gray-600">
                Your data is protected with enterprise-grade security measures
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                24/7 Support
              </h3>
              <p className="text-gray-600">
                Get help whenever you need it with our round-the-clock support
                team
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel my membership anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your membership at any time. Your access
                will continue until the end of your current billing period.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial available?
              </h3>
              <p className="text-gray-600">
                We offer a 7-day free trial for all new members. No credit card
                required to start your trial.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and various digital
                payment methods for your convenience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;
