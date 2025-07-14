import React from "react";
import Banner from "./Banner";
import ForumPosts from "./ForumPosts";
import Announcement from "./Announcement";
import ShowAnnoucement from "./ShowAnnoucement";
const Home = () => {
  

  return (
    <div>
      <Banner></Banner>
      <div className="mt-20">
        <ShowAnnoucement></ShowAnnoucement>
      </div>
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
