import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const resolveUser = async () => {
      if (currentUser && currentUser instanceof Promise) {
        const result = await currentUser;
        setUser(result);
      } else {
        setUser(currentUser);
      }
    };
    resolveUser();
  }, [currentUser]);
  return (
    <>
      <section className="bg-white">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
            Find Your Ride, Sell With Ease
            </h1>
            <p className="max-w-2xl mb-6 font-light lg:mb-8 md:text-lg lg:text-xl">
            From search to sale, our platform helps buyers and sellers connect seamlessly in the automotive world
            </p>
            <Link to={user ? '/listing' : '/signUp'}>
              <button
                className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white bg-custom-blue hover:bg-blue-hover rounded-lg focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
              >
                {user ? 'Post Ad' : 'Get Started'}
              </button>
            </Link>

            <Link to={user ? '/search' : '/signUp'}>
              <button className="custom-button inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center abc">
                Find
                <FaSearch className="ml-2" /> {/* Adding the icon with margin */}
              </button>
            </Link>



          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src='/Images/auto_show_08.jpg' alt="mockup" /> {/* Use img variable here */}
          </div>
        </div>
      </section>
    </>
  )
}

export default HeroSection
