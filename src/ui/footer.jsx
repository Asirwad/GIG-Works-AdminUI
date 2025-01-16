import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-teal-700 text-white py-6 mt-8">
        <div className="max-w-screen-xl mx-auto px-4 flex justify-between">
            <div>
                <h3 className="text-xl font-semibold">About Us</h3>
                <p className="mt-2 text-sm">We are a platform that connects gig workers with job opportunities.</p>
            </div>

            <div>
                <h3 className="text-xl font-semibold">Quick Links</h3>
                <ul className="mt-2 text-sm">
                    <li><a href="#" className="hover:text-teal-400">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-teal-400">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-teal-400">Contact Us</a></li>
                </ul>
            </div>

            <div>
                <h3 className="text-xl font-semibold">Contact</h3>
                <p className="mt-2 text-sm">Email: support@gigworks.com</p>
                <p className="text-sm">Phone: +123-456-7890</p>
            </div>
        </div>
        <div className="text-center mt-6 text-sm">
            &copy; 2025 GIG WORKS. All rights reserved.
        </div>
    </footer>
  )
}

export default Footer