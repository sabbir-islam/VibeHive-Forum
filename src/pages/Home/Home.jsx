import React from "react";
import Banner from "./Banner";
import ForumPosts from "./ForumPosts";
const Home = () => {
  

  return (
    <div>
      <Banner></Banner>
      <div className="mt-20">
        <ForumPosts></ForumPosts>
      </div>
    </div>
  
  );
}

export default Home;
