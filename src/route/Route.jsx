import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../pages/Home/Home";
import Root from "../pages/Root";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import Login from "../pages/Login";
import UserProfile from "../pages/UserProfile";
import PrivateRoute from "../providers/PrivateRoute";
import AddPost from "../pages/AddPost";
import LoadingPage from "../pages/LoadingPage";
import MyPosts from "../pages/MyPosts";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
        hydrateFallbackElement: <LoadingPage></LoadingPage>
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/login",
        Component: Login
      },
      {
        path: "/profile/:email",
        element: <PrivateRoute><UserProfile></UserProfile></PrivateRoute>,
        loader:({params})=>fetch(`https://vibe-hive-omega.vercel.app/users/${params.email}`),
        hydrateFallbackElement: <LoadingPage></LoadingPage>
      },
      {
        path: "/add-post",
        element: <PrivateRoute><AddPost></AddPost></PrivateRoute>
      },
      {
        path: "/my-posts",
        element: <PrivateRoute><MyPosts></MyPosts></PrivateRoute>,
        hydrateFallbackElement: <LoadingPage></LoadingPage>
      }
      ,
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);

export default router;
