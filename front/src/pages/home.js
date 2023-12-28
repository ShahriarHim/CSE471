import React from "react";
import Navbar from "./Comp/navbar";
import Footer from "./Comp/footer";
import About from "./HomePage/about";
import Carousel from "./HomePage/carousel";
import Service from "./HomePage/service";
import CourseCategories from "./HomePage/categories";
import Instructors from "./HomePage/instructors";
// import Dashboard from "./Comp/dashboard";

const HomePage = () => {
  return (
    <div>
   
      {/* <Dashboard /> */}
      <Navbar />
      <Carousel />
      <Instructors />
      <CourseCategories />
      <Service />
      <About />
      <Footer />

    </div>
  );
};

export default HomePage;
