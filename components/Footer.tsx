const Footer = () => {
    return (
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">GoldmanX</h4>
              <p className="text-sm">Revolutionizing digital asset security with quantum ledger technology.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="text-sm">
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
              <ul className="text-sm">
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Follow Us</h4>
              <ul className="text-sm">
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">&copy; {new Date().getFullYear()} GoldmanX. All rights reserved.</div>
        </div>
      </footer>
    )
  }
  
  export default Footer
  