import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/home/Footer'
import Navbar from '@/components/navbar/Navbar'
import { Contact } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar />
      <AboutSection />
      <ContactSection />
          <Footer/>
    </div>
  )
}

export default page
