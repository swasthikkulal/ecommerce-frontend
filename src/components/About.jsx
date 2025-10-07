import React from "react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 py-20 mt-[4.2%]">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">About Frutify</h1>
          <p className="text-xl text-pink-100 max-w-3xl mx-auto">
            Crafting happiness, one scoop at a time! We're passionate about
            creating the most delicious and innovative ice cream experiences for
            you.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Sweet Story
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Founded in 2020, Frutify began as a small family dream to bring
                joy through authentic, handcrafted ice creams. What started in a
                humble kitchen has now become a beloved destination for ice
                cream enthusiasts.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We believe that great ice cream starts with great ingredients.
                That's why we source the freshest fruits, premium dairy, and
                natural flavors to create unforgettable frozen treats.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-pink-50 px-4 py-2 rounded-full">
                  <span className="text-pink-600 font-semibold">
                    🎯 Mission:
                  </span>
                  <span className="text-gray-700 ml-2">
                    Spread joy through quality ice cream
                  </span>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-full">
                  <span className="text-blue-600 font-semibold">
                    👁️ Vision:
                  </span>
                  <span className="text-gray-700 ml-2">
                    Be the most loved ice cream brand
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <img
                src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Ice cream making process"
                className="rounded-2xl shadow-2xl w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do at Frutify
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:transform hover:scale-105 transition duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Quality First
              </h3>
              <p className="text-gray-600">
                We never compromise on quality. Every ingredient is carefully
                selected and every batch is crafted with love and attention to
                detail.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:transform hover:scale-105 transition duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Innovation
              </h3>
              <p className="text-gray-600">
                We're constantly experimenting with new flavors and techniques
                to bring you unique and exciting ice cream experiences.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:transform hover:scale-105 transition duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Customer Love
              </h3>
              <p className="text-gray-600">
                Your happiness is our success. We listen to your feedback and
                strive to make every visit to Frutify a memorable one.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            How We Make Our Ice Cream
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍓</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                1. Select Ingredients
              </h3>
              <p className="text-sm text-gray-600">
                Fresh fruits & premium dairy
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍🍳</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                2. Craft & Mix
              </h3>
              <p className="text-sm text-gray-600">Expert preparation</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❄️</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                3. Slow Churn
              </h3>
              <p className="text-sm text-gray-600">Perfect texture</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                4. Deliver Fresh
              </h3>
              <p className="text-sm text-gray-600">Quick to your door</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Meet Our Team
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl">
                👨‍🍳
              </div>
              <h3 className="text-xl font-bold text-gray-900">Swasthik</h3>
              <p className="text-purple-600 font-semibold">
                Founder & Head Chef
              </p>
              <p className="text-gray-600 mt-2">
                Passionate ice cream artisan with 10+ years of experience
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl">
                🧑‍💻
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Development Team
              </h3>
              <p className="text-blue-600 font-semibold">Tech Wizards</p>
              <p className="text-gray-600 mt-2">
                Creating amazing digital experiences for our customers
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl">
                👩‍💼
              </div>
              <h3 className="text-xl font-bold text-gray-900">Customer Care</h3>
              <p className="text-red-600 font-semibold">Support Heroes</p>
              <p className="text-gray-600 mt-2">
                Always here to make your experience sweeter
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-pink-600 mb-2">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-gray-600">Flavors Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">25+</div>
              <div className="text-gray-600">Cities Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600">Delivery Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Taste Happiness?
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers and experience the Frutify
            difference today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-white text-pink-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition duration-300 shadow-lg"
            >
              Browse Our Flavors
            </Link>
            <Link className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-pink-600 transition duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
