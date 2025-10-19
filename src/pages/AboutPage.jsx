import React from 'react';
import { Lock, Zap, Heart, Clock, Shield, Brain, Users, CheckCircle } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden py-20">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">About Digital Healthcare Assistant</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              We're on a mission to make healthcare more accessible, safe, and personalized through innovative technology and evidence-based information.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                To democratize healthcare by providing everyone with access to reliable, personalized medical information and tools that empower informed health decisions.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                We believe that technology can bridge the gap between patients and healthcare providers, making medical knowledge more accessible while maintaining the highest standards of safety and accuracy.
              </p>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all">
                Join Our Mission
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-2xl p-6 text-center">
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Privacy First</h3>
                <p className="text-sm text-gray-600">Your health data is encrypted and secure</p>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 text-center">
                <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Real-time</h3>
                <p className="text-sm text-gray-600">Instant access to health information</p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6 text-center">
                <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Personalized</h3>
                <p className="text-sm text-gray-600">Tailored to your unique health profile</p>
              </div>

              <div className="bg-orange-50 rounded-2xl p-6 text-center">
                <div className="bg-orange-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Accessible</h3>
                <p className="text-sm text-gray-600">Available whenever you need it</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600">
              Comprehensive healthcare tools and information at your fingertips
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow border border-blue-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Medicine Information Database</h3>
                  <p className="text-sm text-blue-600 font-medium">Comprehensive coverage</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Extensive database with detailed information on medicines, interactions, and usage guidelines.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow border border-blue-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">AI-Powered Health Insights</h3>
                  <p className="text-sm text-blue-600 font-medium">Advanced precision</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Get personalized health recommendations using advanced artificial intelligence technology.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow border border-blue-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Expert Medical Review</h3>
                  <p className="text-sm text-blue-600 font-medium">Continuous verification</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                All content is reviewed and verified by licensed healthcare professionals.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow border border-blue-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">24/7 Support</h3>
                  <p className="text-sm text-blue-600 font-medium">Always available</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Round-the-clock customer support for all your healthcare information needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <h3 className="text-5xl font-bold text-white mb-2">24/7</h3>
              <p className="text-blue-100 text-lg font-medium">Available Support</p>
            </div>

            <div>
              <h3 className="text-5xl font-bold text-white mb-2">10K+</h3>
              <p className="text-blue-100 text-lg font-medium">Active Users</p>
            </div>

            <div>
              <h3 className="text-5xl font-bold text-white mb-2">100%</h3>
              <p className="text-blue-100 text-lg font-medium">Verified Information</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Join Our Growing Community
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Be part of a community that cares about health and wellness
          </p>
          <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all shadow-lg">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;