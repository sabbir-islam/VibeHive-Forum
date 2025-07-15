import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Home from "../pages/Home/Home";
import Root from "../pages/Root";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import Login from "../pages/Login";
import UserProfile from "../pages/UserProfile";
import PrivateRoute from "../providers/PrivateRoute";
import AddPost from "../pages/AddPost";
import EditPost from "../pages/EditPost";
import LoadingPage from "../pages/LoadingPage";
import MyPosts from "../pages/MyPosts";
import Membership from "../pages/Membership";
import AdminGuard from "../pages/AdminGuard";
import AdminProfile from "../pages/AdminProfile";
import ManageUser from "../pages/ManageUser";
import Announcement from "../pages/Announcement";
import Comments from "../pages/Comments";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
        hydrateFallbackElement: <LoadingPage></LoadingPage>,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/membership",
        Component: Membership,
      },
      {
        path: "/profile/:email",
        element: (
          <PrivateRoute>
            <UserProfile></UserProfile>
          </PrivateRoute>
        ),
        loader: ({ params }) =>
          fetch(`https://vibe-hive-omega.vercel.app/users/${params.email}`),
        hydrateFallbackElement: <LoadingPage></LoadingPage>,
      },
      {
        path: "/add-post",
        element: (
          <PrivateRoute>
            <AddPost></AddPost>
          </PrivateRoute>
        ),
      },
      {
        path: "/edit-post/:postId",
        element: (
          <PrivateRoute>
            <EditPost></EditPost>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <LoadingPage></LoadingPage>,
      },
      {
        path: "/my-posts",
        element: (
          <PrivateRoute>
            <MyPosts></MyPosts>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <LoadingPage></LoadingPage>,
      },
      {
        path: "/comments/:postId",
        element: (
          <PrivateRoute>
            <Comments></Comments>
          </PrivateRoute>
        ),
        hydrateFallbackElement: <LoadingPage></LoadingPage>,
      },
      {
        path: "/admin",
        element: <AdminGuard />,
        children: [
          {
            index: true,
            element: <Navigate to="/admin/profile" replace />,
          },
          {
            path: "profile",
            element: <AdminProfile></AdminProfile>,
          },
          {
            path: "manage-users",
            element: <ManageUser></ManageUser>,
          },
          {
            path: "reported-activities",
            element: (
              <div className="min-h-screen p-8">
                <h1 className="text-3xl font-bold mb-6">
                  Reported Comments/Activities
                </h1>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <p>This page will show reported content for moderation.</p>
                </div>
              </div>
            ),
          },
          {
            path: "make-announcement",
            element: <Announcement></Announcement>,
          },
        ],
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);

export default router;
