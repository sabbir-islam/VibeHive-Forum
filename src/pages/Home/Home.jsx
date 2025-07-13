import React from "react";
import Banner from "./Banner";
import ForumPosts from "./ForumPosts";
import Announcement from "./Announcement";
const Home = () => {
  

  return (
    <div>
      <Banner></Banner>
      <div>
        <Announcement></Announcement>
      </div>
      <div className="mt-20">
        <ForumPosts></ForumPosts>
      </div>
    </div>
  
  );
}

export default Home;
