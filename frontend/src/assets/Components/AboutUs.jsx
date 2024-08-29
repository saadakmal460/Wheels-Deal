import React from 'react'
import { FaCar, FaCheckCircle, FaExchangeAlt, FaShieldAlt } from 'react-icons/fa'

const AboutUs = () => {
  return (
    <>
      <div class="bg-wgite px-2 py-7">

        <div id="features" class="mx-auto max-w-6xl">
          <h2 class="text-center font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            What We Offer
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-6 text-center text-slate-700 md:grid-cols-3" style={{cursor : 'pointer'}}>
            <li className="rounded-xl bg-white px-6 py-8 shadow-sm border card-hover">
              <FaCar className="mx-auto h-10 w-10" />
              <h3 className="my-3 font-display font-medium">Wide Vehicle Selection</h3>
              <p className="mt-1.5 text-sm leading-6 text-secondary-500">
                Explore a vast selection of cars, trucks, and SUVs from various makes and models. Whether you're looking for a brand-new vehicle or a reliable used car, we have options that fit every budget and preference.
              </p>
            </li>

            <li className="rounded-xl bg-white px-6 py-8 shadow-sm border card-hover">
              <FaExchangeAlt className="mx-auto h-10 w-10" />
              <h3 className="my-3 font-display font-medium">Easy Buying and Selling</h3>
              <p className="mt-1.5 text-sm leading-6 text-secondary-500">
                Our platform makes buying and selling vehicles simple and hassle-free. With intuitive search filters and an easy listing process, you can find your dream car or sell your vehicle in just a few clicks.
              </p>
            </li>

            <li className="rounded-xl bg-white px-6 py-8 shadow-sm border card-hover">
              <FaCheckCircle className="mx-auto h-10 w-10" />
              <h3 className="my-3 font-display font-medium">Verified Listings</h3>
              <p className="mt-1.5 text-sm leading-6 text-secondary-500">
                Trust in the quality of our listings. We ensure that each vehicle is thoroughly inspected and verified, providing you with accurate information and peace of mind during your buying or selling process.
              </p>
            </li>
          </ul>
        </div>

      </div>
    </>
  )
}

export default AboutUs
